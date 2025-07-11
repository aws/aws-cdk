/**
 * Simple function to evaluate CloudFormation intrinsics.
 *
 * Note that this function is not production quality, it exists to support tests.
 */
export function evaluateCFN(object: any, context: {[key: string]: string} = {}): any {
  const intrinsicFns: any = {
    'Fn::Join'(separator: string, args: string[]) {
      if (typeof separator !== 'string') {
        // CFN does not support expressions here!
        throw new Error('\'separator\' argument of { Fn::Join } must be a string literal');
      }
      return evaluate(args).map(evaluate).join(separator);
    },

    'Fn::Split'(separator: string, args: any) {
      if (typeof separator !== 'string') {
        // CFN does not support expressions here!
        throw new Error('\'separator\' argument of { Fn::Split } must be a string literal');
      }
      return evaluate(args).split(separator);
    },

    'Fn::Select'(index: number, args: any) {
      return evaluate(args).map(evaluate)[index];
    },

    'Ref'(logicalId: string) {
      if (!(logicalId in context)) {
        throw new Error(`Trying to evaluate Ref of '${logicalId}' but not in context!`);
      }
      return context[logicalId];
    },

    'Fn::GetAtt'(logicalId: string, attributeName: string) {
      const key = `${logicalId}.${attributeName}`;
      if (!(key in context)) {
        throw new Error(`Trying to evaluate Fn::GetAtt of '${logicalId}.${attributeName}' but not in context!`);
      }
      return context[key];
    },

    'Fn::Sub'(template: string, explicitPlaceholders?: Record<string, string>) {
      const placeholders = explicitPlaceholders ? evaluate(explicitPlaceholders) : context;

      if (typeof template !== 'string') {
        throw new Error('The first argument to {Fn::Sub} must be a string literal (cannot be the result of an expression)');
      }

      return template.replace(/\$\{([a-zA-Z0-9.:-]*)\}/g, (_: string, key: string) => {
        if (key in placeholders) { return placeholders[key]; }
        throw new Error(`Unknown placeholder in Fn::Sub: ${key}`);
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

      const ret: {[key: string]: any} = {};
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
  if (typeof x !== 'object' || x === null) { return undefined; }
  const keys = Object.keys(x);
  if (keys.length === 1 && (isNameOfCloudFormationIntrinsic(keys[0]) || keys[0] === 'Ref')) {
    return {
      name: keys[0],
      args: x[keys[0]],
    };
  }
  return undefined;
}

function isNameOfCloudFormationIntrinsic(name: string): boolean {
  if (!name.startsWith('Fn::')) {
    return false;
  }
  // these are 'fake' intrinsics, only usable inside the parameter overrides of a CFN CodePipeline Action
  return name !== 'Fn::GetArtifactAtt' && name !== 'Fn::GetParam';
}
