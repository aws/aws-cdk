import { Test } from 'nodeunit';
import cloudwatch = require('../lib');
import {sum} from '../lib';

export = {
  'SUM([m1,m2]) + 100'(test: Test) {
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
    const math = sum(m1, m2).plus(100);

    test.deepEqual(cloudwatch.compileExpression(math), [{
      id: 'm1',
      metric: {
        metricName: 'NumberOfPublishedMessages',
        namespace: 'AWS/SNS',
        dimensions: []
      },
      period: 300,
      stat: 'Average',
      unit: undefined,
      returnData: false
    }, {
      id: 'm2',
      metric: {
        metricName: 'Errors',
        namespace: 'Custom',
        dimensions: [{
          name: 'a',
          value: '1'
        }, {
          name: 'b',
          value: '2'
        }]
      },
      period: 300,
      stat: 'Average',
      unit: undefined,
      returnData: false
    }, {
      id: 'm3',
      expression: 'SUM([m1,m2]) + 100',
      returnData: true
    }]);

    test.done();
  }
};