/* eslint-disable */
const {SQS} = require("aws-sdk");

exports.handler = () => {
  const sqs = new SQS()
  sqs.sendMessage({
    MessageBody: 'hello world!',
    QueueUrl: process.env.QUEUE_URL,
    DelaySeconds: 60,
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log(data);
    }
  });
};
