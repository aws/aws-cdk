import { TemplateParameters } from '../../lib/api/util/cloudformation';

const PARAM = 'TheParameter';
const DEFAULT = 'TheDefault';
const OVERRIDE = 'TheOverride';

const USE_OVERRIDE = { ParameterKey: PARAM, ParameterValue: OVERRIDE };
const USE_PREVIOUS = { ParameterKey: PARAM, UsePreviousValue: true };

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

function makeParams(defaultValue: boolean, hasPrevValue: boolean, override: boolean) {
  const params = TemplateParameters.fromTemplate({
    Parameters: {
      [PARAM]: {
        Default: defaultValue ? DEFAULT : undefined,
      },
    }
  });
  const prevParams = hasPrevValue ? [PARAM] : [];
  return params.makeApiParameters({ [PARAM]: override ? OVERRIDE : undefined }, prevParams);
}