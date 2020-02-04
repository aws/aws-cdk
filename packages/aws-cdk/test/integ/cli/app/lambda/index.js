exports.handler = async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
  const response = require('./response.json');
  return response;
};
