import { Test } from 'nodeunit';
import cloudwatch = require('../lib');

export = {
  'SUM([m1,m2]) * 100'(test: Test) {
    const m1 = new cloudwatch.Metric({
      metricName: 'NumberOfPublishedMessages',
      namespace: 'AWS/SNS',
    });
    const m2 = new cloudwatch.Metric({
      metricName: 'Errors',
      namespace: 'Custom',
      dimensions: {
        a: '1',
        b: '2'
      }
    });
    const math = new cloudwatch.Sum(m1, m2).multiply(100);

    test.deepEqual(math.compile(), {
      expression: 'SUM([m1,m2]) * 100',
      metrics: [{
        id: 'm1',
        metric: {
          metricName: 'NumberOfPublishedMessages',
          namespace: 'AWS/SNS',
          dimensions: undefined
        },
        period: 300,
        stat: 'Average',
        unit: undefined
      }, {
        id: 'm2',
        metric: {
          metricName: 'Errors',
          namespace: 'Custom',
          dimensions: {
            a: '1',
            b: '2'
          }
        },
        period: 300,
        stat: 'Average',
        unit: undefined
      }]
    });
    test.done();
  }
};