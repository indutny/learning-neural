var data = require('./data');

var neural = require('./');

var n = neural.create([ 28 * 28, 60, 30, 10 ]);

console.log('Start...');
for (var i = 0; i < 90; i++) {
  n.train(data.train.pairs, {
    chunkSize: 10,
    rate: 1
  });

  console.log('epoch', i);

  var match = 0;
  for (var j = 0; j < 100; j++) {
    var index = (Math.random() * data.train.images.length) | 0;
    var image = data.train.images[index];

    var out = n.run(image);
    var maxLabel = -1;
    for (var k = 0; k < out.values.length; k++) {
      if (out.values[k] < 0.5)
        continue;

      maxLabel = k;
      break;
    }

    if (maxLabel === data.train.labels[index])
      match++;
  }
  console.log('minor %d', match / 100);

  var match = 0;
  for (var j = 0; j < data.test.images.length; j++) {
    var image = data.test.images[j];

    var out = n.run(image);
    var maxLabel = -1;
    for (var k = 0; k < out.values.length; k++) {
      if (out.values[k] < 0.5)
        continue;

      maxLabel = k;
      break;
    }

    if (maxLabel === data.test.labels[j])
      match++;
  }
  console.log('major %d', match / data.test.images.length);
}
