import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Bucket } from '../lib';

describe('metrics', () => {
  test('Can use addMetrics() to add a metric configuration', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addMetric({
      id: 'test',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
      }],
    });
  });

  test('Bucket with metrics on prefix', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
        Prefix: 'prefix',
      }],
    });
  });

  test('Bucket with metrics on tag filter', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      MetricsConfigurations: [{
        Id: 'test',
        TagFilters: [
          { Key: 'tagname1', Value: 'tagvalue1' },
          { Key: 'tagname2', Value: 'tagvalue2' },
        ],
      }],
    });
  });

  test('Bucket with multiple metric configurations', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
    });
  });
});
