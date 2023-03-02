import { SSMPARAM_NO_INVALIDATE } from '@aws-cdk/cx-api';
import { MockedObject, MockSdkProvider, SyncHandlerSubsetOf } from './mock-sdk';
import { CloudFormationStack, TemplateParameters } from '../../lib/api/util/cloudformation';

const PARAM = 'TheParameter';
const DEFAULT = 'TheDefault';
const OVERRIDE = 'TheOverride';

const USE_OVERRIDE = { ParameterKey: PARAM, ParameterValue: OVERRIDE };
const USE_PREVIOUS = { ParameterKey: PARAM, UsePreviousValue: true };

let sdkProvider: MockSdkProvider;
let describeStackMock: jest.Mock;
let getTemplateMock: jest.Mock;
let cfnMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;
let cfn: AWS.CloudFormation;
beforeEach(async () => {
  sdkProvider = new MockSdkProvider();

  describeStackMock = jest.fn();
  getTemplateMock = jest.fn();
  cfnMocks = {
    describeStacks: describeStackMock,
    getTemplate: getTemplateMock,
  };
  sdkProvider.stubCloudFormation(cfnMocks as any);
  cfn = (await sdkProvider.forEnvironment()).sdk.cloudFormation();
});

test('A non-existent stack pretends to have an empty template', async () => {
  // GIVEN
  describeStackMock.mockImplementation(() => ({ Stacks: [] })); // No stacks exist

  // WHEN
  const stack = await CloudFormationStack.lookup(cfn, 'Dummy');

  // THEN
  expect(await stack.template()).toEqual({});
});

test("Retrieving a processed template passes 'Processed' to CloudFormation", async () => {
  // GIVEN
  describeStackMock.mockImplementation(() => ({
    Stacks: [
      {
        StackName: 'Dummy',
      },
    ],
  }));
  getTemplateMock.mockImplementation(() => ({
    TemplateBody: '{}',
  }));

  // WHEN
  const retrieveProcessedTemplate = true;
  const cloudFormationStack = await CloudFormationStack.lookup(cfn, 'Dummy', retrieveProcessedTemplate);
  await cloudFormationStack.template();

  // THEN
  expect(getTemplateMock).toHaveBeenCalledWith({
    StackName: 'Dummy',
    TemplateStage: 'Processed',
  });
});

test.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])('given override, always use the override (parameter has a default: %p, parameter previously supplied: %p)',
  (haveDefault, havePrevious) => {
    expect(makeParams(haveDefault, havePrevious, true)).toEqual({
      apiParameters: [USE_OVERRIDE],
      changed: true,
    });
  });

test('no default, no prev, no override => error', () => {
  expect(() => makeParams(false, false, false)).toThrow(/missing a value: TheParameter/);
});

test('no default, yes prev, no override => use previous', () => {
  expect(makeParams(false, true, false)).toEqual({
    apiParameters: [USE_PREVIOUS],
    changed: false,
  });
});

test('default, no prev, no override => empty param set (and obviously changes to be applied)', () => {
  expect(makeParams(true, false, false)).toEqual({
    apiParameters: [],
    changed: true,
  });
});

test('default, prev, no override => use previous', () => {
  expect(makeParams(true, true, false)).toEqual({
    apiParameters: [USE_PREVIOUS],
    changed: false,
  });
});

test('if a parameter is retrieved from SSM, the parameters always count as changed', () => {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: {
        Type: 'AWS::SSM::Parameter::Name',
        Default: '/Some/Key',
      },
    },
  });
  const oldValues = { Foo: '/Some/Key' };

  // If we don't pass a new value
  expect(params.updateExisting({}, oldValues).hasChanges(oldValues)).toEqual('ssm');

  // If we do pass a new value but it's the same as the old one
  expect(params.updateExisting({ Foo: '/Some/Key' }, oldValues).hasChanges(oldValues)).toEqual('ssm');
});

test('if a parameter is retrieved from SSM, the parameters doesnt count as changed if it has the magic marker', () => {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: {
        Type: 'AWS::SSM::Parameter::Name',
        Default: '/Some/Key',
        Description: `blabla ${SSMPARAM_NO_INVALIDATE}`,
      },
    },
  });
  const oldValues = { Foo: '/Some/Key' };

  // If we don't pass a new value
  expect(params.updateExisting({}, oldValues).hasChanges(oldValues)).toEqual(false);

  // If we do pass a new value but it's the same as the old one
  expect(params.updateExisting({ Foo: '/Some/Key' }, oldValues).hasChanges(oldValues)).toEqual(false);

  // If we do pass a new value and it's different
  expect(params.updateExisting({ Foo: '/OTHER/Key' }, oldValues).hasChanges(oldValues)).toEqual(true);
});

test('empty string is a valid update value', () => {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: { Type: 'String', Default: 'Foo' },
    },
  });

  expect(params.updateExisting({ Foo: '' }, { Foo: 'ThisIsOld' }).apiParameters).toEqual([
    { ParameterKey: 'Foo', ParameterValue: '' },
  ]);
});

test('unknown parameter in overrides, pass it anyway', () => {
  // Not sure if we really want this. It seems like it would be nice
  // to not pass parameters that aren't expected, given that CFN will
  // just error out. But maybe we want to be warned of typos...
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: { Type: 'String', Default: 'Foo' },
    },
  });

  expect(params.updateExisting({ Bar: 'Bar' }, {}).apiParameters).toEqual([
    { ParameterKey: 'Bar', ParameterValue: 'Bar' },
  ]);
});

test('if an unsupplied parameter reverts to its default, it can still be dirty', () => {
  // GIVEN
  const templateParams = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: { Type: 'String', Default: 'Foo' },
    },
  });

  // WHEN
  const stackParams = templateParams.supplyAll({});

  // THEN
  expect(stackParams.hasChanges({ Foo: 'NonStandard' })).toEqual(true);
  expect(stackParams.hasChanges({ Foo: 'Foo' })).toEqual(false);
});

function makeParams(defaultValue: boolean, hasPrevValue: boolean, override: boolean) {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      [PARAM]: {
        Type: 'String',
        Default: defaultValue ? DEFAULT : undefined,
      },
    },
  });
  const prevParams: Record<string, string> = hasPrevValue ? { [PARAM]: 'Foo' } : {};
  const stackParams = params.updateExisting({ [PARAM]: override ? OVERRIDE : undefined }, prevParams);

  return { apiParameters: stackParams.apiParameters, changed: stackParams.hasChanges(prevParams) };
}
