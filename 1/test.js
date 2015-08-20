var data = require('./data');

var neural = require('./');

var n = neural.create([ 28 * 28, 100, 10 ]);

function validate(n, data) {
  var match = 0;
  for (var j = 0; j < data.images.length; j++) {
    var image = data.images[j];

    var out = n.run(image);
    var maxLabel = -1;
    for (var k = 0; k < out.values.length; k++) {
      if (out.values[k] < 0.5)
        continue;

      maxLabel = k;
      break;
    }

    if (maxLabel === data.labels[j])
      match++;
  }
  match /= data.images.length;

  return match;
}

console.log('Start...');
for (var i = 0; i < 500; i++) {
  console.time('train');
  n.train(data.train.pairs, {
    chunkSize: 10,
    rate: 0.5,
    regParam: 5
  });
  console.timeEnd('train');

  console.log('epoch', i);

  var train = validate(n, data.train);
  console.log('training %d', train);

  var validation = validate(n, data.validate);
  console.log('validation %d', validation);
}
