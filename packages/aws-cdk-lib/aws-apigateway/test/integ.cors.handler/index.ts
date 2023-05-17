exports.handler = async (evt: any) => {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify(evt, undefined, 2));
  return {
    statusCode: 200,
    body: 'hello, cors!',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};