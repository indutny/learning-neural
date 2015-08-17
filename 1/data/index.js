var assert = require('assert');
var path = require('path');
var fs = require('fs');

var Vector = require('../lib/vector');

function Loader() {
}

Loader.prototype.readFile = function readFile(name) {
  return fs.readFileSync(path.resolve(__dirname, name));
};

Loader.prototype.loadImages = function loadImages(name) {
  var buf = this.readFile(name);

  var magic = buf.readUInt32BE(0);
  assert.equal(magic, 0x803);

  var count = buf.readUInt32BE(4);
  var width = buf.readUInt32BE(8);
  var height = buf.readUInt32BE(12);
  var size = width * height;

  var out = new Array(count);
  for (var i = 0, off = 16; i < out.length; i++, off += size)
    out[i] = this.loadImage(buf, off, size);

  return out;
};

Loader.prototype.loadImage = function loadImage(buf, off, size) {
  var out = new Vector(size);
  for (var i = 0; i < size; i++)
    out.values[i] = buf[off + i] / 256;
  return out;
};

Loader.prototype.loadLabels = function loadLabels(name) {
  var buf = this.readFile(name);

  var magic = buf.readUInt32BE(0);
  assert.equal(magic, 0x801);

  var count = buf.readUInt32BE(4);

  var out = new Array(count);
  for (var i = 0, off = 8; i < count; i++, off++)
    out[i] = buf[off];
  return out;
};

Loader.prototype.createLabel = function createLabel(num) {
  var out = new Vector(10).zero();
  out.values[num] = 1;
  return out;
};

Loader.prototype.pair = function pair(obj) {
  return obj.images.map(function(image, i) {
    return {
      input: image,
      output: this.createLabel(obj.labels[i])
    };
  }, this);
};

var l = new Loader();

exports.train = {
  images: l.loadImages('train-images-idx3-ubyte'),
  labels: l.loadLabels('train-labels-idx1-ubyte'),
  pairs: null
};

exports.test = {
  images: l.loadImages('t10k-images-idx3-ubyte'),
  labels: l.loadLabels('t10k-labels-idx1-ubyte'),
  pairs: null
};

exports.train.pairs = l.pair(exports.train);
exports.test.pairs = l.pair(exports.test);
