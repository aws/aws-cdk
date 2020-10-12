const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, '../../lib/rules');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['rulesdir'],
  rules: {
    quotes: [ 'error', 'single', { avoidEscape: true }],
    'rulesdir/no-core-construct': [ 'error' ],
  }
}
