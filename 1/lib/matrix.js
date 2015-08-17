var Vector = require('./vector');

function Matrix(w, h) {
  this.w = w;
  this.h = h;
  this.rows = new Array(h);
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i] = new Vector(w);
}
module.exports = Matrix;

Matrix.prototype.zero = function zero() {
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i].zero();

  return this;
};

Matrix.prototype.randomize = function randomize() {
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i].randomize();

  return this;
};

Matrix.prototype.arrayInit = function arrayInit(arr) {
  for (var i = 0; i < this.h; i++)
    this.rows[i].arrayInit(arr[i]);
  return this;
};

Matrix.prototype.mul = function mul(other) {
  if (other instanceof Vector)
    return this.mulVec(other);

  var res = new Matrix(other.w, this.h);
  for (var i = 0; i < this.rows.length; i++) {
    var row = this.rows[i];
    for (var j = 0; j < other.w; j++) {
      var acc = 0;
      for (var k = 0; k < this.w; k++)
        acc += row.values[k] * other.rows[k].values[j];

      res.rows[i].values[j] = acc;
    }
  }

  return res;
};

Matrix.prototype.mulVec = function mulVec(vec) {
  var out = new Vector(this.h);

  for (var i = 0; i < this.rows.length; i++)
    out.values[i] = this.rows[i].smul(vec);

  return out;
};

Matrix.prototype.imuln = function imuln(n) {
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i].imuln(n);
  return this;
};

Matrix.prototype.iadd = function iadd(other) {
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i].iadd(other.rows[i]);
  return this;
};

Matrix.prototype.iapply = function iapply(fn) {
  for (var i = 0; i < this.rows.length; i++)
    this.rows[i].iapply(fn);
  return this;
};

Matrix.prototype.inspect = function inspect() {
  return '(' + this.rows.map(function(row) {
    return row.inspect();
  }).join(',\n') + ')';
};
