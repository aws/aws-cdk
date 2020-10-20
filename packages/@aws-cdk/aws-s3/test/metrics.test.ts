import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { Bucket } from '../lib';

nodeunitShim({
  'Can use addMetrics() to add a metric configuration'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addMetric({
      id: 'test',
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
      }],
    }));

    test.done();
  },

  'Bucket with metrics on prefix'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      metrics: [{
        id: 'test',
        prefix: 'prefix',
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
        Prefix: 'prefix',
      }],
    }));

    test.done();
  },

  'Bucket with metrics on tag filter'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      metrics: [{
        id: 'test',
        tagFilters: { tagname1: 'tagvalue1', tagname2: 'tagvalue2' },
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
        TagFilters: [
          { Key: 'tagname1', Value: 'tagvalue1' },
          { Key: 'tagname2', Value: 'tagvalue2' },
        ],
      }],
    }));

    test.done();
  },

  'Bucket with multiple metric configurations'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      metrics: [
        {
          id: 'test',
          tagFilters: { tagname1: 'tagvalue1', tagname2: 'tagvalue2' },

        },
        {
          id: 'test2',
          prefix: 'prefix',
        },
      ],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
        TagFilters: [
          { Key: 'tagname1', Value: 'tagvalue1' },
          { Key: 'tagname2', Value: 'tagvalue2' },
        ],
      },
      {
        Id: 'test2',
        Prefix: 'prefix',
      }],
    }));

    test.done();
  },
});
