import { IValue } from './value';
import { DURATION, STRING } from './well-known-types';
import { HelperFunction, CM2 } from './cm2';

export function renderDuration(v: IValue, style: 'toMinutes' | 'toSeconds'): IValue {
  if (v.type !== DURATION) {
    throw new Error(`Expecting a Duration, got ${v.type}`);
  }
  return {
    type: DURATION,
    toString() { return `${v}.${style}()` },
    render(code: CM2) {
      code.add(v, `.${style}()`);
    },
  };
}

export function ifDefined(c: IValue, v: IValue): IValue {
  return {
    type: v.type,
    toString() { return `conditional ${v}` },
    render(code: CM2) {
      code.add(c, ' !== undefined ? ', v, ' : undefined');
    },
  };
}

export function enumMapping(mapping: Array<[IValue, string]>) {
  if (mapping.length === 0) { throw new Error('Mapping is empty'); }
  const enumType = mapping[0][0].type;
  if (!mapping.every(([v, _]) => v.type === enumType)) {
    throw new Error('All enums in mapping must be from the same type');
  }
  const functionName = `${enumType.typeRefName}ToCloudFormation`;

  // FIXME: Exhaustiveness check?

  const renderFn = new HelperFunction(functionName, code => {
    code.openBlock('function ', functionName, '(x: ', enumType, '): string');
    code.openBlock('switch (x)');

    for (const [enumMember, str] of mapping) {
      code.line('case ', enumMember, ': return ', JSON.stringify(str), ';');
    }

    code.closeBlock(); // switch
    code.closeBlock();
  });

  return (value: IValue): IValue => ({
    type: STRING,
    toString: () => `${functionName}(${value})`,
    render(code: CM2) {
      code.addHelper(renderFn);
      code.add(functionName, '(', value, ')');
    },
  });
}