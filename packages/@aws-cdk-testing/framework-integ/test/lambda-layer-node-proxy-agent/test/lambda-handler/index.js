var ProxyAgent = require('proxy-agent');

exports.handler = (_) => {
  new ProxyAgent();
};
