import { Test } from 'nodeunit';
import cloudwatch = require('../lib');

export = {
  'm1 * 100'(test: Test) {
    const expression = new cloudwatch.TimeSeries('m1').multiply(100).render(new cloudwatch.ExpressionContext());

    test.equals(expression, 'm1 * 100');
    test.done();
  },

  'SUM(m1)'(test: Test) {
    const m1 = new cloudwatch.Metric({
      metricName: 'NumberOfPublishedMessages',
      namespace: 'AWS/SNS',
    });
    const expression = new cloudwatch.Sum(m1).render(new cloudwatch.ExpressionContext());

    test.equals(expression, 'SUM(m1)');
    test.done();
  },

  'SUM([m1,m2])'(test: Test) {
    const m1 = new cloudwatch.Metric({
      metricName: 'NumberOfPublishedMessages',
      namespace: 'AWS/SNS',
    });
    const m2 = new cloudwatch.Metric({
      metricName: 'Errors',
      namespace: 'Custom',
    });
    const expression = new cloudwatch.Sum(m1, m2).render(new cloudwatch.ExpressionContext());

    test.equals(expression, 'SUM([m1,m2])');
    test.done();
  },

  'SUM([m1,m2]) * 100'(test: Test) {
    const m1 = new cloudwatch.Metric({
      metricName: 'NumberOfPublishedMessages',
      namespace: 'AWS/SNS',
    });
    const m2 = new cloudwatch.Metric({
      metricName: 'Errors',
      namespace: 'Custom',
    });
    const expression = new cloudwatch.Sum(m1, m2).multiply(100)
      .render(new cloudwatch.ExpressionContext());

    test.equals(expression, 'SUM([m1,m2]) * 100');
    test.done();
  }
};