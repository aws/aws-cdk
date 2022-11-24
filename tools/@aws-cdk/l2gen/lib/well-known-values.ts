import { IValue } from './value';
import { DURATION, STRING, BOOLEAN, NUMBER, ANY } from './well-known-types';
import { HelperFunction, CM2 } from './cm2';
import { IType } from './type';

export function javascriptValue(x: any): IValue {
  const type = ((): IType => {
    switch (typeof x) {
      case 'boolean': return BOOLEAN;
      case 'string': return STRING;
      case 'number': return NUMBER;
      default: throw new Error(`Don't have type object for ${typeof x}`);
    }
  })();

  return {
    type,
    render(code) {
      code.add(JSON.stringify(x));
    },
    toString: () => JSON.stringify(x),
  };
}

export function literalValue(x: string, type: IType = ANY): IValue {
  return {
    type,
    render(code) {
      code.add(x);
    },
    toString: () => x,
  };
}

export const TRUE = javascriptValue(true);
export const FALSE = javascriptValue(false);
export const UNDEFINED = literalValue('undefined');

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

export function ifDefined(c: IValue, v: IValue, otherwise: IValue = UNDEFINED): IValue {
  return {
    type: v.type,
    toString() { return `conditional ${v}` },
    render(code: CM2) {
      code.add(c, ' !== undefined ? ', v, ' : ', otherwise);
    },
  };
}

export function ifDefinedAny(cs: IValue[], v: IValue, otherwise: IValue = UNDEFINED): IValue {
  return {
    type: v.type,
    toString() { return `conditional ${v}` },
    render(code: CM2) {
      let first = true;
      for (const c of cs) {
        if (!first) {
          code.add(' || ');
        }
        first = false;
        code.add(c, ' !== undefined');
      }
      code.add(' ? ', v, ' : ', otherwise);
    },
  };
}

export function definedOrElse(v: IValue, otherwise: IValue): IValue {
  return {
    type: v.type,
    toString() { return `conditional ${v}` },
    render(code: CM2) {
      code.add(v, ' ?? ', otherwise);
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