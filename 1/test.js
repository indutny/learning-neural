var data = require('./data');

var neural = require('./');

var n = neural.create([ 28 * 28, 100, 10 ]);

function validate(n, data) {
  var match = 0;
  var cost = 0;
  for (var j = 0; j < data.images.length; j++) {
    var image = data.images[j];

    var out = n.run(image);
    var max = 0;
    var maxLabel = -1;
    for (var k = 0; k < out.values.length; k++) {
      if (out.values[k] <= max)
        continue;

      max = out.values[k];
      maxLabel = k;
    }

    if (maxLabel === data.labels[j])
      match++;

    cost += n.cost(data.pairs[j].input, data.pairs[j].output);
  }
  match /= data.images.length;
  cost /= data.images.length;

  return { match: match, cost: cost };
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
  console.log('training %d, cost=%d', train.match, train.cost);

  var validation = validate(n, data.validate);
  console.log('validation %d, cost=%d', validation.match, validation.cost);
}
