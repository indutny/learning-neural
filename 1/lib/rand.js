var next = undefined;

exports.generate = function generate() {
  var u1 = Math.random();
  var u2 = Math.random();
  var factor = Math.sqrt(-2 * Math.log(u1))

  return factor * Math.cos(2 * Math.PI * u2);
};
