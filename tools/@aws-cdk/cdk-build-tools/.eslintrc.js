const baseConfig = require('./config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
