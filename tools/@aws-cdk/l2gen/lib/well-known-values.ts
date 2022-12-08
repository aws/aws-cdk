import { IValue, litVal } from './value';
import { DURATION, FN, TOKENIZATION } from './well-known-types';
import { CM2, interleave, CodePart, IRenderable } from './cm2';
import { IType, ANY, BOOLEAN, STRING, NUMBER } from './type';

export function jsVal(x: any): IValue {
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

export function arrayVal(xs: CodePart[]): IValue {
  return {
    type: ANY,
    render(code) {
      code.add('[', ...interleave(', ', xs), ']');
    },
    toString: () => JSON.stringify(xs),
  };
}

export const TRUE = jsVal(true);
export const FALSE = jsVal(false);
export const UNDEFINED = litVal('undefined');

export function renderDuration(style: 'toMinutes' | 'toSeconds') {
  return (v: IValue): IValue => {
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
  };
}

export function ifDefined(c: IRenderable, v: IRenderable, otherwise: IRenderable = UNDEFINED): IValue {
  return {
    type: ANY,
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

export function invoke(fn: IValue): IValue {
  return {
    type: ANY,
    toString() { return `${fn}()` },
    render(code: CM2) {
      code.add(fn, '()');
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

export function splitSelect(sep: string, fieldNr: number | undefined, value: IRenderable) {
  if (fieldNr === undefined) { return value; }

  return FN.callExp('select')(jsVal(fieldNr), FN.callExp('split')(jsVal(sep), value));
}

export function stackToJsonString(x: IRenderable): IRenderable {
  return TOKENIZATION.callExp('toJsonString')(x);
}

export function transformArray(tx: ValueTransform) {
  return (x: IRenderable): IRenderable => ({
    render(code: CM2) {
      code.add(x, '.map(x => ', tx(litVal('x')), ')');
    },
  });
}

export function transformMap(tx: ValueTransform) {
  return (x: IRenderable): IRenderable => ({
    render(code: CM2) {
      code.add('Object.fromEntries(Object.entries(', x, ').map(([k, v]) => [k, ', tx(litVal('v')), '] as const))');
    },
  });
}
export type ValueTransform = (x: IRenderable) => IRenderable;
