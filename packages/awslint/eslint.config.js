// @ts-check
const { defineConfig } = require('eslint/config');
const awsCdkConfig = require('@aws-cdk/eslint-config');

module.exports = defineConfig(awsCdkConfig);