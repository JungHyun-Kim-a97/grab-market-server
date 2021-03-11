const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const fs = require("fs"); //파일들을 읽어주고 불러오는 것

module.exports = function detectProduct(url, callback) {
  const image = fs.readFileSync(url); // 파일을 동기적으로 불러옴
  const input = tf.node.decodeImage(image, 3);
  mobilenet.load().then((model) => {
    model.classify(input).then((result) => {
      callback(result[0].className);
    });
  });
};
