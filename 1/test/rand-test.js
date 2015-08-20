var assert = require('assert');
var rand = require('../lib/rand');

describe('Normal Random', function() {
  it('should have zero expectation value', function() {
    var count = 1e6;

    var acc = 0;
    for (var i = 0; i < count; i++)
      acc += rand.generate();
    acc /= count;

    assert(Math.abs(acc) < 0.01);
  });

  it('should have 1 std dev', function() {
    var count = 1e6;

    var acc = 0;
    for (var i = 0; i < count; i++) {
      var r = rand.generate();
      acc += r * r;
    }
    acc /= count;

    assert(Math.abs(acc - 1) < 0.01);
  });
});
