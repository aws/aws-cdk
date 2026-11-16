exports.handler = async (evt: any) => {
  console.error(JSON.stringify(evt, undefined, 2));
  return {
    statusCode: 200,
    body: 'hello, cors!',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};
