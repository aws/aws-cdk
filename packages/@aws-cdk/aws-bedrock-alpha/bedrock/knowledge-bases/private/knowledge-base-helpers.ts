import { ArnFormat, Stack, Token, ValidationError } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';
import type { CommonKnowledgeBaseProps } from '../knowledge-base';

/**
 * Build the ARN of a knowledge base in the scope's account and region.
 */
export function knowledgeBaseArnFromId(scope: Construct, knowledgeBaseId: string): string {
  return Stack.of(scope).formatArn({
    service: 'bedrock',
    resource: 'knowledge-base',
    resourceName: knowledgeBaseId,
    arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
  });
}

/**
 * Create the service role Amazon Bedrock assumes to operate a knowledge base,
 * trusted only for knowledge bases in the scope's account and region
 */
export function createKnowledgeBaseServiceRole(scope: Construct): iam.Role {
  return new iam.Role(scope, 'Role', {
    assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
      conditions: {
        StringEquals: {
          'aws:SourceAccount': Stack.of(scope).account,
        },
        ArnLike: {
          'aws:SourceArn': Stack.of(scope).formatArn({
            service: 'bedrock',
            resource: 'knowledge-base',
            resourceName: '*',
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          }),
        },
      },
    }),
  });
}

/**
 * Validate the properties shared by all knowledge base types against the
 * constraints of `AWS::Bedrock::KnowledgeBase`.
 */
export function validateCommonKnowledgeBaseProps(scope: Construct, props: CommonKnowledgeBaseProps): void {
  if (props.knowledgeBaseName !== undefined && !Token.isUnresolved(props.knowledgeBaseName)
    && !/^([0-9a-zA-Z][_-]?){1,100}$/.test(props.knowledgeBaseName)) {
    throw new ValidationError(
      lit`InvalidKnowledgeBaseName`,
      `knowledgeBaseName ${JSON.stringify(props.knowledgeBaseName)} must be 1-100 characters of letters, digits, hyphens and underscores without consecutive hyphens or underscores`,
      scope,
    );
  }

  if (props.description !== undefined && !Token.isUnresolved(props.description)
    && (props.description.length < 1 || props.description.length > 200)) {
    throw new ValidationError(
      lit`InvalidKnowledgeBaseDescription`,
      `description must be 1-200 characters, got ${props.description.length}`,
      scope,
    );
  }
}
