var Cache = require('./cache');

var rand = require('./rand');

function Vector(size) {
  this.size = size;
  this.values = Vector.cache.alloc(size);
}
module.exports = Vector;

Vector.cache = new Cache();

Vector.prototype.free = function free() {
  Vector.cache.free(this.values);
  this.values = null;
};

Vector.prototype.zero = function zero() {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = 0;

  return this;
};

Vector.prototype.randomize = function randomize() {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = rand.generate();

  return this;
};

Vector.prototype.arrayInit = function arrayInit(arr) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = arr[i];
  return this;
};

Vector.prototype.copy = function copy(from) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = from.values[i];
  return this;
};

Vector.prototype.clone = function clone() {
  var res = new Vector(this.size);
  for (var i = 0; i < this.values.length; i++)
    res.values[i] = this.values[i];
  return res;
};

Vector.prototype.smul = function smul(other) {
  var acc = 0;
  for (var i = 0; i < this.values.length; i++)
    acc += this.values[i] * other.values[i];
  return acc;
};

Vector.prototype.mul = function mul(matrix) {
  var out = new Vector(matrix.w);

  for (var i = 0; i < out.values.length; i++) {
    var acc = 0;
    for (var j = 0; j < this.values.length; j++)
      acc += this.values[j] * matrix.values[i * matrix.h + j];
    out.values[i] = acc;
  }

  return out;
};

Vector.prototype.imuln = function imuln(num) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] *= num;
  return this;
};

Vector.prototype.iadd = function iadd(other) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] += other.values[i];
  return this;
};

Vector.prototype.sub = function sub(other) {
  var out = new Vector(this.size);
  for (var i = 0; i < this.values.length; i++)
    out.values[i] = this.values[i] - other.values[i];
  return out;
};

Vector.prototype.iapply = function iapply(fn) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = fn(this.values[i]);
  return this;
};

Vector.prototype.apply = function apply(fn) {
  var out = new Vector(this.size);
  for (var i = 0; i < this.values.length; i++)
    out.values[i] = fn(this.values[i]);
  return out;
};

Vector.prototype.ihadamard = function ihadamard(other) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] *= other.values[i];
  return this;
};

Vector.prototype.inspect = function inspect() {
  return '(' + this.values.map(function(val) {
    return Math.round(val * 100) / 100;
  }).join(', ') + ')';
};
