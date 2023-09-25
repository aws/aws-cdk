import {
  CfnEvaluationException,
  EvaluateCloudFormationTemplate,
  ListStackResources,
  Template,
} from '../../lib/api/evaluate-cloudformation-template';
import { MockSdkProvider } from '../util/mock-sdk';

const sdkProvider: MockSdkProvider = new MockSdkProvider();
const sdk = sdkProvider.sdk;
const listStackResources: ListStackResources = {
  listStackResources: jest.fn(),
};

const createEvaluateCloudFormationTemplate = (template: Template) => new EvaluateCloudFormationTemplate({
  template,
  parameters: {},
  account: '0123456789',
  region: 'ap-south-east-2',
  partition: 'aws',
  urlSuffix: (region) => sdk.getEndpointSuffix(region),
  listStackResources,
});

test('resolves Fn::Join correctly', async () => {
  // GIVEN
  const template: Template = {};
  const evaluateCfnTemplate = createEvaluateCloudFormationTemplate(template);

  // WHEN
  const result = await evaluateCfnTemplate.evaluateCfnExpression({
    'Fn::Join': [':', ['a', 'b', 'c']],
  });

  // THEN
  expect(result).toEqual('a:b:c');
});

test('fails because Fn::ImportValue is unsupported', async () => {
  // GIVEN
  const template: Template = {};
  const evaluateCfnTemplate = createEvaluateCloudFormationTemplate(template);

  // WHEN
  const evaluate = () => evaluateCfnTemplate.evaluateCfnExpression({
    'Fn::ImportValue': 'blah',
  });

  // THEN
  await expect(evaluate).rejects.toBeInstanceOf(CfnEvaluationException);

});
