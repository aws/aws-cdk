import * as cdk from '../../core';
import * as bedrock from '../lib';

/* eslint-disable quote-props */

describe('ProvisionedModel', () => {
  test('fromProvisionedModelArn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Model', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // THEN
    expect(model.modelArn).toEqual('arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');
  });
});

describe('FoundationModel', () => {
  test('fromFoundationModelId', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const model = bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_V2);

    // THEN
    expect(stack.resolve(model.modelArn)).toEqual({ 'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' }, ':bedrock:', { 'Ref': 'AWS::Region' }, '::foundation-model/anthropic.claude-v2']] });
  });

  test('fromFoundationModelId with newer model ID', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const model = bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', new bedrock.FoundationModelIdentifier('new-base-model'));

    // THEN
    expect(stack.resolve(model.modelArn)).toEqual({ 'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' }, ':bedrock:', { 'Ref': 'AWS::Region' }, '::foundation-model/new-base-model']] });
  });
});
