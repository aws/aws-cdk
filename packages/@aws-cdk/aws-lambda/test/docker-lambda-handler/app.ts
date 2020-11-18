/* eslint-disable no-console */

exports.handler = async (event: any) => {
  console.log('hello world');
  console.log(`event ${event}`);
  return {
    statusCode: 200,
  };
};