module.exports = {
  plugins: ['@aws-cdk'],
  rules: {
    '@aws-cdk/promiseall-no-unbounded-parallelism': [ 'error' ],
  }
}
