var next = undefined;

exports.generate = function generate() {
  if (next !== undefined) {
    var res = next;
    next = undefined;
    return res;
  }

  var u1 = Math.random();
  var u2 = Math.random();
  var factor = Math.sqrt(-2 * Math.log(u1))

  next = factor * Math.sin(2 * Math.PI * u2);
  return factor * Math.cos(2 * Math.PI * u2);
};
