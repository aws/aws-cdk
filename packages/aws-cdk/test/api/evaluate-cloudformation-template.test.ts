import {
  CfnEvaluationException,
  EvaluateCloudFormationTemplate,
  Template,
} from '../../lib/api/evaluate-cloudformation-template';
import { MockSdk } from '../util/mock-sdk';

const listStackResources = jest.fn();
const listExports: jest.Mock<AWS.CloudFormation.ListExportsOutput, AWS.CloudFormation.ListExportsInput[]> = jest.fn();
const sdk = new MockSdk();
sdk.stubCloudFormation({
  listExports,
  listStackResources,
});

const createEvaluateCloudFormationTemplate = (template: Template) => new EvaluateCloudFormationTemplate({
  template,
  parameters: {},
  account: '0123456789',
  region: 'ap-south-east-2',
  partition: 'aws',
  urlSuffix: (region) => sdk.getEndpointSuffix(region),
  sdk,
  stackName: 'test-stack',
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

  describe('resolving Fn::ImportValue', () => {
    const template: Template = {};
    const evaluateCfnTemplate = createEvaluateCloudFormationTemplate(template);

    const createMockExport = (num: number) => ({
      ExportingStackId: `test-exporting-stack-id-${num}`,
      Name: `test-name-${num}`,
      Value: `test-value-${num}`,
    });

    beforeEach(async () => {
      listExports.mockReset();
      listExports
        .mockReturnValueOnce({
          Exports: [
            createMockExport(1),
            createMockExport(2),
            createMockExport(3),
          ],
          NextToken: 'next-token-1',
        })
        .mockReturnValueOnce({
          Exports: [
            createMockExport(4),
            createMockExport(5),
            createMockExport(6),
          ],
          NextToken: undefined,
        });
    });

    test('resolves Fn::ImportValue using lookup', async () => {
      const result = await evaluateCfnTemplate.evaluateCfnExpression({ 'Fn::ImportValue': 'test-name-5' });
      expect(result).toEqual('test-value-5');
    });

    test('throws error when Fn::ImportValue cannot be resolved', async () => {
      const evaluate = () => evaluateCfnTemplate.evaluateCfnExpression({
        'Fn::ImportValue': 'blah',
      });
      await expect(evaluate).rejects.toBeInstanceOf(CfnEvaluationException);
    });
  });
});
