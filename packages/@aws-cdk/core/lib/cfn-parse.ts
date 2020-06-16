import { Fn } from './cfn-fn';
import { Aws } from './cfn-pseudo';
import { CfnDeletionPolicy } from './cfn-resource-policy';
import { CfnTag } from './cfn-tag';
import { IResolvable } from './resolvable';
import { isResolvableObject, Token } from './token';

/**
 * This class contains functions for translating from a pure CFN value
 * (like a JS object { "Ref": "Bucket" })
 * to a form CDK understands
 * (like Fn.ref('Bucket')).
 *
 * While this file not exported from the module
 * (to not make it part of the public API),
 * it is directly referenced in the generated L1 code,
 * so any renames of it need to be reflected in cfn2ts/codegen.ts as well.
 *
 * @experimental
 */
export class FromCloudFormation {
  public static parseValue(cfnValue: any): any {
    return parseCfnValueToCdkValue(cfnValue);
  }

  // nothing to for any but return it
  public static getAny(value: any) { return value; }

  // nothing to do - if 'value' is not a boolean or a Token,
  // a validator should report that at runtime
  public static getBoolean(value: any): boolean | IResolvable { return value; }

  public static getDate(value: any): Date | IResolvable {
    // if the date is a deploy-time value, just return it
    if (isResolvableObject(value)) {
      return value;
    }

    // if the date has been given as a string, convert it
    if (typeof value === 'string') {
      return new Date(value);
    }

    // all other cases - just return the value,
    // if it's not a Date, a validator should catch it
    return value;
  }

  public static getString(value: any): string {
    // if the string is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return value.toString();
    }

    // in all other cases, just return the input,
    // and let a validator handle it if it's not a string
    return value;
  }

  public static getNumber(value: any): number {
    // if the string is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return Token.asNumber(value);
    }

    // in all other cases, just return the input,
    // and let a validator handle it if it's not a number
    return value;
  }

  public static getStringArray(value: any): string[] {
    // if the array is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return Token.asList(value);
    }

    // in all other cases, delegate to the standard mapping logic
    return this.getArray(value, this.getString);
  }

  public static getArray<T>(value: any, mapper: (arg: any) => T): T[] {
    if (!Array.isArray(value)) {
      // break the type system, and just return the given value,
      // which hopefully will be reported as invalid by the validator
      // of the property we're transforming
      // (unless it's a deploy-time value,
      // which we can't map over at build time anyway)
      return value;
    }

    return value.map(mapper);
  }

  public static getMap<T>(value: any, mapper: (arg: any) => T): { [key: string]: T } {
    if (typeof value !== 'object') {
      // if the input is not a map (= object in JS land),
      // just return it, and let the validator of this property handle it
      // (unless it's a deploy-time value,
      // which we can't map over at build time anyway)
      return value;
    }

    const ret: { [key: string]: T } = {};
    for (const [key, val] of Object.entries(value)) {
      ret[key] = mapper(val);
    }
    return ret;
  }

  public static parseDeletionPolicy(policy: any): CfnDeletionPolicy | undefined {
    switch (policy) {
      case null: return undefined;
      case undefined: return undefined;
      case 'Delete': return CfnDeletionPolicy.DELETE;
      case 'Retain': return CfnDeletionPolicy.RETAIN;
      case 'Snapshot': return CfnDeletionPolicy.SNAPSHOT;
      default: throw new Error(`Unrecognized DeletionPolicy '${policy}'`);
    }
  }

  public static getCfnTag(tag: any): CfnTag {
    return tag == null
      ? { } as any // break the type system - this should be detected at runtime by a tag validator
      : {
        key: tag.Key,
        value: tag.Value,
      };
  }
}

function parseCfnValueToCdkValue(cfnValue: any): any {
  // == null captures undefined as well
  if (cfnValue == null) {
    return undefined;
  }
  // if we have any late-bound values,
  // just return them
  if (isResolvableObject(cfnValue)) {
    return cfnValue;
  }
  if (Array.isArray(cfnValue)) {
    return cfnValue.map(el => parseCfnValueToCdkValue(el));
  }
  if (typeof cfnValue === 'object') {
    // an object can be either a CFN intrinsic, or an actual object
    const cfnIntrinsic = parseIfCfnIntrinsic(cfnValue);
    if (cfnIntrinsic) {
      return cfnIntrinsic;
    }
    const ret: any = {};
    for (const [key, val] of Object.entries(cfnValue)) {
      ret[key] = parseCfnValueToCdkValue(val);
    }
    return ret;
  }
  // in all other cases, just return the input
  return cfnValue;
}

function parseIfCfnIntrinsic(object: any): any {
  const key = looksLikeCfnIntrinsic(object);
  switch (key) {
    case undefined:
      return undefined;
    case 'Ref': {
      // ToDo handle translating logical IDs
      return specialCaseRefs(object[key]) ?? Fn._ref(object[key]);
    }
    case 'Fn::GetAtt': {
      // Fn::GetAtt takes a 2-element list as its argument
      const value = object[key];
      // ToDo same comment here as in Ref above
      return Fn.getAtt((value[0]), value[1]);
    }
    case 'Fn::Join': {
      // Fn::Join takes a 2-element list as its argument,
      // where the first element is the delimiter,
      // and the second is the list of elements to join
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.join(value[0], value[1]);
    }
    case 'Fn::Cidr': {
      const value = parseCfnValueToCdkValue(object[key]);
      
      if (value.length == 2)
        return Fn.cidr(value[0], value[1]);
      return Fn.cidr(value[0], value[1], value[2]);
    }
    case 'Fn::FindInMap': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.findInMap(value[0], value[1], value[2]);
    }
    case 'Fn::Select': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.select(value[0], value[1]);
    }
    case 'Fn::GetAZs': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.getAzs(value);
    }
    case 'Fn::ImportValue': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.importValue(value);
    }
    case 'Fn::Split': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.split(value[0], value[1]);
    }
    case 'Fn::Transform': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.transform(value);
    }
    case 'Fn::If': {
      // Fn::If takes a 3-element list as its argument
      // ToDo the first argument is the name of the condition,
      // so we will need to retrieve the actual object from the template
      // when we handle preserveLogicalIds=false
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.conditionIf(value[0], value[1], value[2]);
    }
    case 'Fn::Equals': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.conditionEquals(value[0], value[1]);
    }
    case 'Fn::And': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.conditionAnd(...value);
    }
    case 'Fn::Not': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.conditionNot(value[0]);
    }
    case 'Fn::Or': {
      const value = parseCfnValueToCdkValue(object[key]);
      return Fn.conditionOr(...value);
    }
    default:
      throw new Error(`Unsupported CloudFormation function '${key}'`);
  }
}

function looksLikeCfnIntrinsic(object: object): string | undefined {
  const objectKeys = Object.keys(object);
  // a CFN intrinsic is always an object with a single key
  if (objectKeys.length !== 1) {
    return undefined;
  }

  const key = objectKeys[0];
  return key === 'Ref' || key.startsWith('Fn::') ? key : undefined;
}

function specialCaseRefs(value: any): any {
  switch (value) {
    case 'AWS::AccountId': return Aws.ACCOUNT_ID;
    case 'AWS::Region': return Aws.REGION;
    case 'AWS::Partition': return Aws.PARTITION;
    case 'AWS::URLSuffix': return Aws.URL_SUFFIX;
    case 'AWS::NotificationARNs': return Aws.NOTIFICATION_ARNS;
    case 'AWS::StackId': return Aws.STACK_ID;
    case 'AWS::StackName': return Aws.STACK_NAME;
    case 'AWS::NoValue': return Aws.NO_VALUE;
    default: return undefined;
  }
}
