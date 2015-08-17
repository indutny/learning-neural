'use strict';
var Vector = require('./vector');
var Matrix = require('./matrix');

function Network(sizes) {
  this.layers = sizes.length;
  this.weights = new Array(this.layers - 1);
  this.biases = new Array(this.layers - 1);

  for (var i = 0; i < this.weights.length; i++)
    this.weights[i] = new Matrix(sizes[i], sizes[i + 1]).randomize();

  for (var i = 0; i < this.biases.length; i++)
    this.biases[i] = new Vector(sizes[i + 1]).randomize();
}
module.exports = Network;

Network.create = function create(sizes) {
  return new Network(sizes);
};

Network.prototype.sigma = function sigma(z) {
  return 1 / (1 + Math.exp(-z));
};

Network.prototype.run = function run(input) {
  var out = input;
  for (var i = 0; i < this.weights.length; i++) {
    out = this.weights[i].mul(out).iadd(this.biases[i]);
    out = out.iapply(this.sigma);
  }
  return out;
};

Network.prototype.extRun = function extRun(input) {
  var tmp = input;
  var out = [ tmp ];
  for (var i = 0; i < this.weights.length; i++) {
    tmp = this.weights[i].mul(tmp).iadd(this.biases[i]);
    tmp = tmp.iapply(this.sigma);
    out.push(tmp);
  }
  return out;
};

Network.prototype.train = function train(samples, options) {
  var queue = samples.slice();
  var chunkSize = options.chunkSize;
  var rate = options.rate;

  while (queue.length !== 0) {
    var chunk = [];
    for (var i = 0; i < chunkSize && queue.length !== 0; i++)
      chunk.push(queue.splice((queue.length * Math.random()) | 0, 1)[0]);

    var nw = new Array(this.weights.length);
    var nb = new Array(this.biases.length);
    for (var i = 0; i < nw.length; i++) {
      nw[i] = new Matrix(this.weights[i].w, this.weights[i].h).zero();
      nb[i] = new Vector(this.biases[i].size).zero();
    }

    for (var i = 0; i < chunk.length; i++)
      this.backprop(chunk[i].input, chunk[i].output, nw, nb);

    var mul = -rate / chunk.length;
    for (var i = 0; i < nw.length; i++) {
      this.weights[i].iadd(nw[i].imuln(mul));
      this.biases[i].iadd(nb[i].imuln(mul));
    }
  }
};

Network.prototype.backprop = function backprop(input, expected, nw, nb) {
  var outputs = this.extRun(input);
  var output = outputs[outputs.length - 1];

  // Initial Nabla C
  var nc = new Vector(output.size);
  for (var i = 0; i < nc.values.length; i++)
    nc.values[i] = output.values[i] - expected.values[i];

  for (var k = this.weights.length - 1; k >= 0; k--) {
    var input = outputs[k];
    var biases = this.biases[k];
    var currentNW = nw[k];
    var currentNB = nb[k];

    // Calculate B out of dC/dy
    var b = new Vector(output.size);
    for (var i = 0; i < b.values.length; i++)
      b.values[i] = nc.values[i] * output.values[i] * (1 - output.values[i]);

    // Update biases and weights
    currentNB.iadd(b);
    for (var i = 0; i < b.values.length; i++)
      for (var j = 0; j < input.values.length; j++)
        currentNW.rows[i].values[j] += b.values[i] * input.values[j];

    // Propagate dC/dy
    if (k === 0)
      break;

    var weights = this.weights[k];
    output = input;
    nc = b.mul(weights);
  }
};
