/**
 * Simple function to evaluate CloudFormation intrinsics.
 *
 * Note that this function is not production quality, it exists to support tests.
 */
import { isNameOfCloudFormationIntrinsic } from '../lib/private/cloudformation-lang';

export function evaluateCFN(object: any, context: {[key: string]: string} = {}): any {
  const intrinsics: any = {
    'Fn::Join'(separator: string, args: string[]) {
      return args.map(evaluate).join(separator);
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

    'Fn::Sub'(argument: string | [string, Record<string, string>]) {
      let template;
      let placeholders: Record<string, string>;
      if (Array.isArray(argument)) {
        template = argument[0];
        placeholders = evaluate(argument[1]);
      } else {
        template = argument;
        placeholders = context;
      }

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
      const keys = Object.keys(obj);
      if (keys.length === 1 && (isNameOfCloudFormationIntrinsic(keys[0]) || keys[0] === 'Ref')) {
        return evaluateIntrinsic(keys[0], obj[keys[0]]);
      }

      const ret: {[key: string]: any} = {};
      for (const key of keys) {
        ret[key] = evaluateCFN(obj[key]);
      }
      return ret;
    }

    return obj;
  }

  function evaluateIntrinsic(name: string, args: any) {
    if (!(name in intrinsics)) {
      throw new Error(`Intrinsic ${name} not supported here`);
    }

    if (!Array.isArray(args)) {
      args = [args];
    }

    return intrinsics[name].apply(intrinsics, args);
  }
}
