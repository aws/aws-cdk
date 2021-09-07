export function evaluateCfn(object: any, context: { [key: string]: string }): any {
  const intrinsicFns: any = {
    'Fn::Join'(separator: string, args: string[]): string {
      return evaluate(args).map(evaluate).join(separator);
    },

    'Fn::Split'(separator: string, args: string): string {
      return evaluate(args).split(separator);
    },

    'Fn::Select'(index: number, args: string[]): string {
      return evaluate(args).map(evaluate)[index];
    },

    'Ref'(logicalId: string): string {
      if (logicalId in context) {
        return context[logicalId];
      } else {
        throw new Error(`Reference target '${logicalId}' was not found`);
      }
    },

    'Fn::Sub'(template: string, explicitPlaceholders?: { [variable: string]: string }): string {
      const placeholders = explicitPlaceholders
        ? { ...context, ...evaluate(explicitPlaceholders) }
        : context;

      return template.replace(/\${([^}]*)}/g, (_: string, key: string) => {
        if (key in placeholders) {
          return placeholders[key];
        } else {
          throw new Error(`Fn::Sub target '${key}' was not found`);
        }
      });
    },
  };

  return evaluate(object);

  function evaluate(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(evaluate);
    }

    if (typeof obj === 'object') {
      const intrinsic = parseIntrinsic(obj);
      if (intrinsic) {
        return evaluateIntrinsic(intrinsic);
      }

      const ret: { [key: string]: any } = {};
      for (const key of Object.keys(obj)) {
        ret[key] = evaluate(obj[key]);
      }
      return ret;
    }

    return obj;
  }

  function evaluateIntrinsic(intrinsic: Intrinsic) {
    if (!(intrinsic.name in intrinsicFns)) {
      throw new Error(`Intrinsic ${intrinsic.name} not supported here`);
    }

    const argsAsArray = Array.isArray(intrinsic.args) ? intrinsic.args : [intrinsic.args];

    return intrinsicFns[intrinsic.name].apply(intrinsicFns, argsAsArray);
  }
}

interface Intrinsic {
  readonly name: string;
  readonly args: any;
}

function parseIntrinsic(x: any): Intrinsic | undefined {
  if (typeof x !== 'object' || x === null) {
    return undefined;
  }
  const keys = Object.keys(x);
  if (keys.length === 1 && (keys[0].startsWith('Fn::') || keys[0] === 'Ref')) {
    return {
      name: keys[0],
      args: x[keys[0]],
    };
  }
  return undefined;
}
