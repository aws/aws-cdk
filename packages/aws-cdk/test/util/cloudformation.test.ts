import { CloudFormationStack, TemplateParameters } from '../../lib/api/util/cloudformation';
import { MockedObject, MockSdkProvider, SyncHandlerSubsetOf } from './mock-sdk';

const PARAM = 'TheParameter';
const DEFAULT = 'TheDefault';
const OVERRIDE = 'TheOverride';

const USE_OVERRIDE = { ParameterKey: PARAM, ParameterValue: OVERRIDE };
const USE_PREVIOUS = { ParameterKey: PARAM, UsePreviousValue: true };

let sdkProvider: MockSdkProvider;
let cfnMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;
let cfn: AWS.CloudFormation;
beforeEach(async () => {
  sdkProvider = new MockSdkProvider();

  cfnMocks = {
    describeStacks: jest.fn()
      // No stacks exist
      .mockImplementation(() => ({ Stacks: [] })),
  };
  sdkProvider.stubCloudFormation(cfnMocks as any);
  cfn = (await sdkProvider.forEnvironment()).cloudFormation();
});

test('A non-existent stack pretends to have an empty template', async () => {
  // WHEN
  const stack = await CloudFormationStack.lookup(cfn, 'Dummy');

  // THEN
  expect(await stack.template()).toEqual({});
});

test.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true]])('given override, always use the override (parameter has a default: %p, parameter previously supplied: %p)',
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

test('default, no prev, no override => empty param set', () => {
  expect(makeParams(true, false, false)).toEqual({
    apiParameters: [],
    changed: false,
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

  // If we don't pass a new value
  expect(params.diff({}, {Foo: '/Some/Key'}).changed).toEqual(true);

  // If we do pass a new value but it's the same as the old one
  expect(params.diff({Foo: '/Some/Key'}, {Foo: '/Some/Key'}).changed).toEqual(true);
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

  expect(params.diff({ Bar: 'Bar' }, {}).apiParameters).toEqual([
    { ParameterKey: 'Bar', ParameterValue: 'Bar' },
  ]);
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
  const prevParams: Record<string, string> = hasPrevValue ? {[PARAM]: 'Foo'} : {};
  const stackParams =  params.diff({ [PARAM]: override ? OVERRIDE : undefined }, prevParams);

  return { apiParameters: stackParams.apiParameters, changed: stackParams.changed };
}