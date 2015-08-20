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

Network.prototype.sigmaPrime = function sigmaPrime(a) {
  return a * (1 - a);
};

Network.prototype.run = function run(input) {
  var out = input;
  for (var i = 0; i < this.weights.length; i++) {
    var oldOut = out;
    out = this.weights[i].mul(out).iadd(this.biases[i]);
    out = out.iapply(this.sigma);

    if (oldOut !== input)
      oldOut.free();
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
  var total = samples.length;

  var nw = new Array(this.weights.length);
  var nb = new Array(this.biases.length);
  for (var i = 0; i < nw.length; i++) {
    nw[i] = new Matrix(this.weights[i].w, this.weights[i].h);
    nb[i] = new Vector(this.biases[i].size);
  }

  while (queue.length !== 0) {
    var chunk = [];
    for (var i = 0; i < chunkSize && queue.length !== 0; i++)
      chunk.push(queue.splice((queue.length * Math.random()) | 0, 1)[0]);

    for (var i = 0; i < nw.length; i++) {
      nw[i].zero();
      nb[i].zero();
    }

    for (var i = 0; i < chunk.length; i++)
      this.backprop(chunk[i].input, chunk[i].output, nw, nb, options);

    var regMul = 1 - rate * options.regParam / total;
    var mul = -rate / chunk.length;
    for (var i = 0; i < nw.length; i++) {
      this.weights[i].imuln(regMul)
                     .iadd(nw[i].imuln(mul));
      this.biases[i].iadd(nb[i].imuln(mul));
    }
  }

  for (var i = 0; i < nw.length; i++) {
    nw[i].free();
    nb[i].free();
  }
};

Network.prototype.backprop = function backprop(input,
                                               expected,
                                               nw,
                                               nb,
                                               options) {
  var outputs = this.extRun(input);
  var output = outputs[outputs.length - 1];

  // Initial Error
  var delta = output.sub(expected);

  for (var k = this.weights.length - 1; k >= 0; k--) {
    var input = outputs[k];
    var weights = this.weights[k];
    var currentNW = nw[k];
    var currentNB = nb[k];

    // Update biases and weights
    currentNB.iadd(delta);
    currentNW.iaddcmul(delta, input);

    if (k === 0)
      break;

    output = input;

    // Propagate delta
    var prime = output.apply(this.sigmaPrime);
    var oldDelta = delta;
    delta = delta.mul(weights).ihadamard(prime);
    oldDelta.free();
    prime.free();
  }

  for (var i = 1; i < outputs.length; i++)
    outputs[i].free();
  delta.free();
};
