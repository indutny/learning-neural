var rand = require('./rand');
var Vector = require('./vector');
var Cache = require('./cache');

function Matrix(w, h) {
  this.w = w;
  this.h = h;

  this.values = Matrix.cache.alloc(w * h);
}
module.exports = Matrix;

Matrix.cache = new Cache();

Matrix.prototype.free = function free() {
  Matrix.cache.free(this.values);
  this.values = null;
};

Matrix.prototype.zero = function zero() {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = 0;

  return this;
};

Matrix.prototype.randomize = function randomize(variance) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = rand.generate() * variance;

  return this;
};

Matrix.prototype.arrayInit = function arrayInit(arr) {
  for (var i = 0; i < this.h; i++)
    for (var j = 0; j < this.w; j++)
      this.values[i * this.w + j] = arr[i][j];
  return this;
};

Matrix.prototype.rowInit = function rowInit(arr) {
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i].values;
    for (var j = 0; j < this.w; j++)
      this.values[i * this.w + j] = row[j];
  }
  return this;
};

Matrix.prototype.columnInit = function columnInit(arr) {
  for (var j = 0; j < arr.length; j++) {
    var column = arr[j].values;
    for (var i = 0; i < this.h; i++)
      this.values[i * this.w + j] = column[i];
  }
  return this;
};

Matrix.prototype.mul = function mul(other) {
  if (other instanceof Vector)
    return this.mulVec(other);

  var res = new Matrix(other.w, this.h);
  for (var i = 0; i < res.h; i++) {
    for (var j = 0; j < res.w; j++) {
      var acc = 0;

      // out[i][j] += this[i][k] * other[k][j]
      for (var k = 0; k < this.w; k++)
        acc += this.values[i * this.w + k] * other.values[k * other.w + j];

      res.values[i * res.w + j] = acc;
    }
  }

  return res;
};

Matrix.prototype.iaddcmul = function iaddcmul(a, b) {
  for (var i = 0; i < this.h; i++)
    for (var j = 0; j < this.w; j++)
      this.values[i * this.w + j] += a.values[i] * b.values[j];

  return this;
};

Matrix.prototype.mulVec = function mulVec(vec) {
  var out = new Vector(this.h);

  for (var i = 0; i < this.h; i++) {
    var acc = 0;
    for (var j = 0; j < this.w; j++)
      acc += this.values[i * this.w + j] * vec.values[j];
    out.values[i] = acc;
  }

  return out;
};

Matrix.prototype.imuln = function imuln(n) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] *= n;
  return this;
};

Matrix.prototype.iadd = function iadd(other) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] += other.values[i];
  return this;
};

Matrix.prototype.iapply = function iapply(fn) {
  for (var i = 0; i < this.values.length; i++)
    this.values[i] = fn(this.values[i]);
  return this;
};

Matrix.prototype.inspect = function inspect() {
  var tmp = new Array(this.values.length);
  for (var i = 0; i < tmp.length; i++)
    tmp[i] = this.values[i];
  return '(' + tmp.join(', ') + ')';
};
