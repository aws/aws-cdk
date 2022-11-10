/* eslint-disable no-console */

exports.handler = async (evt: any) => {
  console.error(JSON.stringify(evt, undefined, 2));
  return 'hello, world!';
};
