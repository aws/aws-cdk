/**
 * Unit tests for AWS OpenSearch Ingestion (OSIS) encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::OSIS::Pipeline
 *
 * OSIS Pipeline encryption is optional. When a KMS key is provided,
 * customer-managed encryption is enabled via the encryptionAtRestOptions.kmsKeyArn property.
 */

import { CfnPipeline } from 'aws-cdk-lib/aws-osis';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnPipelineEncryptionAtRestMixin } from '../../../lib/services/aws-osis/encryption-at-rest-mixins.generated';

describe('CfnPipelineEncryptionAtRestMixin', () => {
  test('supports CfnPipeline', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnPipeline(stack, 'Resource', {
      maxUnits: 4,
      minUnits: 1,
      pipelineConfigurationBody: 'version: "2"\nlog-pipeline:\n  source:\n    http:\n      path: "/log/ingest"\n  sink:\n    - opensearch:\n        hosts: ["https://search-domain.us-east-1.es.amazonaws.com"]\n        index: "logs"',
      pipelineName: 'my-pipeline',
    });
    const mixin = new CfnPipelineEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnPipelineEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key sets EncryptionAtRestOptions', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnPipeline(stack, 'Resource', {
      maxUnits: 4,
      minUnits: 1,
      pipelineConfigurationBody: 'version: "2"\nlog-pipeline:\n  source:\n    http:\n      path: "/log/ingest"\n  sink:\n    - opensearch:\n        hosts: ["https://search-domain.us-east-1.es.amazonaws.com"]\n        index: "logs"',
      pipelineName: 'my-pipeline',
    });
    const mixin = new CfnPipelineEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::OSIS::Pipeline', {
      MaxUnits: 4,
      MinUnits: 1,
      PipelineName: 'my-pipeline',
      EncryptionAtRestOptions: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});
