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

test('given override, always use the override', () => {
  for (const haveDefault of [false, true]) {
    for (const havePrevious of [false, true]) {
      expect(makeParams(haveDefault, havePrevious, true)).toEqual([USE_OVERRIDE]);
    }
  }
});

test('no default, no prev, no override => error', () => {
  expect(() => makeParams(false, false, false)).toThrow(/missing a value: TheParameter/);
});

test('no default, yes prev, no override => use previous', () => {
  expect(makeParams(false, true, false)).toEqual([USE_PREVIOUS]);
});

test('default, no prev, no override => empty param set', () => {
  expect(makeParams(true, false, false)).toEqual([]);
});

test('default, prev, no override => use previous', () => {
  expect(makeParams(true, true, false)).toEqual([USE_PREVIOUS]);
});

test('unknown parameter in overrides, pass it anyway', () => {
  // Not sure if we really want this. It seems like it would be nice
  // to not pass parameters that aren't expected, given that CFN will
  // just error out. But maybe we want to be warned of typos...
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      Foo: { Default: 'Foo' },
    },
  });

  expect(params.makeApiParameters({ Bar: 'Bar' }, [])).toEqual([
    { ParameterKey: 'Bar', ParameterValue: 'Bar' },
  ]);
});

function makeParams(defaultValue: boolean, hasPrevValue: boolean, override: boolean) {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      [PARAM]: {
        Default: defaultValue ? DEFAULT : undefined,
      },
    },
  });
  const prevParams = hasPrevValue ? [PARAM] : [];
  return params.makeApiParameters({ [PARAM]: override ? OVERRIDE : undefined }, prevParams);
}