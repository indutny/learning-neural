var assert = require('assert');

var Matrix = require('../lib/matrix');
var Vector = require('../lib/vector');

describe('Matrix', function() {
  it('should multiply matrices', function() {
    var a = new Matrix(2, 3);
    var c = new Matrix(4, 2);

    a.arrayInit([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ]
    ]);

    c.arrayInit([
      [ 7, 8, 9, 10 ],
      [ 11, 12, 13, 14 ]
    ]);

    var out = a.mul(c);
    assert.equal(out.w, 4);
    assert.equal(out.h, 3);

    var expected = new Matrix(4, 3);
    expected.arrayInit([
      [ 29, 32, 35, 38 ],
      [ 65, 72, 79, 86 ],
      [ 101, 112, 123, 134 ]
    ]);

    assert.deepEqual(out, expected);
  });

  it('should multiply by vector', function() {
    var a = new Matrix(2, 3);
    var c = new Vector(2);

    a.arrayInit([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ]
    ]);

    c.arrayInit([ 7, 8 ]);

    var out = a.mul(c);

    var expected = new Vector(3);
    expected.arrayInit([
      1 * 7 + 2 * 8,
      3 * 7 + 4 * 8,
      5 * 7 + 6 * 8
    ]);

    assert.deepEqual(out, expected);
  });

  it('should iadd', function() {
    var a = new Matrix(2, 3);
    var b = new Matrix(2, 3);

    a.arrayInit([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ]
    ]);
    b.arrayInit([
      [ 7, 8 ],
      [ 9, 10 ],
      [ 11, 12 ]
    ]);

    a.iadd(b);

    var expected = new Matrix(2, 3);
    expected.arrayInit([
      [ 1 + 7, 2 + 8 ],
      [ 3 + 9, 4 + 10 ],
      [ 5 + 11, 6 + 12 ]
    ]);

    assert.deepEqual(a, expected);
  });

  it('should imuln', function() {
    var a = new Matrix(2, 3);

    a.arrayInit([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ]
    ]);

    a.imuln(2);

    var expected = new Matrix(2, 3);
    expected.arrayInit([
      [ 1 * 2, 2 * 2 ],
      [ 3 * 2, 4 * 2 ],
      [ 5 * 2, 6 * 2 ]
    ]);

    assert.deepEqual(a, expected);
  });

  it('should iapply', function() {
    var a = new Matrix(2, 3);

    a.arrayInit([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ]
    ]);

    a.imuln(2);

    var expected = new Matrix(2, 3);
    expected.arrayInit([
      [ 1 * 2, 2 * 2 ],
      [ 3 * 2, 4 * 2 ],
      [ 5 * 2, 6 * 2 ]
    ]);

    assert.deepEqual(a, expected);
  });
});
