/* eslint-disable */
const { SQS } = require("@aws-sdk/client-sqs");

exports.handler = async () => {
  try {
    const sqs = new SQS()
    const res = await sqs.sendMessage({
      MessageBody: 'hello world!',
      QueueUrl: process.env.QUEUE_URL,
      DelaySeconds: 60,
    });

    console.log(res);
  } catch (err) {
    console.log(err, err.stack)
  }
};
