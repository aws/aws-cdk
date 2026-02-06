/**
 * Unit tests for AWS LookoutMetrics encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::LookoutMetrics::AnomalyDetector
 */

import { CfnAnomalyDetector } from 'aws-cdk-lib/aws-lookoutmetrics';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnAnomalyDetectorEncryptionAtRestMixin } from '../../../lib/services/aws-lookoutmetrics/encryption-at-rest-mixins.generated';

describe('CfnAnomalyDetectorEncryptionAtRestMixin', () => {
  test('supports CfnAnomalyDetector', () => {
    const { stack } = createTestContext();
    const resource = new CfnAnomalyDetector(stack, 'Resource', {
      anomalyDetectorConfig: {
        anomalyDetectorFrequency: 'PT1H',
      },
      metricSetList: [
        {
          metricSetName: 'test-metric-set',
          metricList: [
            {
              metricName: 'test-metric',
              aggregationFunction: 'SUM',
            },
          ],
          metricSource: {
            s3SourceConfig: {
              roleArn: 'arn:aws:iam::123456789012:role/test-role',
              fileFormatDescriptor: {
                csvFormatDescriptor: {
                  fileCompression: 'NONE',
                },
              },
            },
          },
        },
      ],
    });
    const mixin = new CfnAnomalyDetectorEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnAnomalyDetectorEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnAnomalyDetector(stack, 'Resource', {
      anomalyDetectorConfig: {
        anomalyDetectorFrequency: 'PT1H',
      },
      metricSetList: [
        {
          metricSetName: 'test-metric-set',
          metricList: [
            {
              metricName: 'test-metric',
              aggregationFunction: 'SUM',
            },
          ],
          metricSource: {
            s3SourceConfig: {
              roleArn: 'arn:aws:iam::123456789012:role/test-role',
              fileFormatDescriptor: {
                csvFormatDescriptor: {
                  fileCompression: 'NONE',
                },
              },
            },
          },
        },
      ],
    });
    const mixin = new CfnAnomalyDetectorEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::LookoutMetrics::AnomalyDetector', {
      AnomalyDetectorConfig: {
        AnomalyDetectorFrequency: 'PT1H',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnAnomalyDetector(stack, 'Resource', {
      anomalyDetectorConfig: {
        anomalyDetectorFrequency: 'PT1H',
      },
      metricSetList: [
        {
          metricSetName: 'test-metric-set',
          metricList: [
            {
              metricName: 'test-metric',
              aggregationFunction: 'SUM',
            },
          ],
          metricSource: {
            s3SourceConfig: {
              roleArn: 'arn:aws:iam::123456789012:role/test-role',
              fileFormatDescriptor: {
                csvFormatDescriptor: {
                  fileCompression: 'NONE',
                },
              },
            },
          },
        },
      ],
    });
    const mixin = new CfnAnomalyDetectorEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::LookoutMetrics::AnomalyDetector', {
      AnomalyDetectorConfig: {
        AnomalyDetectorFrequency: 'PT1H',
      },
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
