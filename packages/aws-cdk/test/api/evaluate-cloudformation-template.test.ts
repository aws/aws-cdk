import {
  CfnEvaluationException,
  EvaluateCloudFormationTemplate,
  ListStackResources,
  Template,
} from '../../lib/api/evaluate-cloudformation-template';
import { MockSdkProvider } from '../util/mock-sdk';

const sdkProvider = new MockSdkProvider();
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

describe('evaluateCfnExpression', () => {
  describe('simple literal expressions', () => {
    const template: Template = {};
    const evaluateCfnTemplate = createEvaluateCloudFormationTemplate(template);

    test('resolves Fn::Join correctly', async () => {
      // WHEN
      const result = await evaluateCfnTemplate.evaluateCfnExpression({
        'Fn::Join': [':', ['a', 'b', 'c']],
      });

      // THEN
      expect(result).toEqual('a:b:c');
    });

    test('resolves Fn::Split correctly', async () => {
      // WHEN
      const result = await evaluateCfnTemplate.evaluateCfnExpression({ 'Fn::Split': ['|', 'a|b|c'] });

      // THEN
      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('resolves Fn::Select correctly', async () => {
      // WHEN
      const result = await evaluateCfnTemplate.evaluateCfnExpression({ 'Fn::Select': ['1', ['apples', 'grapes', 'oranges', 'mangoes']] });

      // THEN
      expect(result).toEqual('grapes');
    });

    test('resolves Fn::Sub correctly', async () => {
      // WHEN
      const result = await evaluateCfnTemplate.evaluateCfnExpression({ 'Fn::Sub': ['Testing Fn::Sub Foo=${Foo} Bar=${Bar}', { Foo: 'testing', Bar: 1 }] });

      // THEN
      expect(result).toEqual('Testing Fn::Sub Foo=testing Bar=1');
    });

  });
},
);

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
