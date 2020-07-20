import { Fn } from './cfn-fn';
import { Aws } from './cfn-pseudo';
import {
  CfnAutoScalingReplacingUpdate, CfnAutoScalingRollingUpdate, CfnAutoScalingScheduledAction, CfnCodeDeployLambdaAliasUpdate,
  CfnCreationPolicy, CfnDeletionPolicy, CfnResourceAutoScalingCreationPolicy, CfnResourceSignal, CfnUpdatePolicy,
} from './cfn-resource-policy';
import { CfnTag } from './cfn-tag';
import { ICfnFinder } from './from-cfn';
import { CfnReference } from './private/cfn-reference';
import { IResolvable } from './resolvable';
import { isResolvableObject, Token } from './token';

/**
 * This class contains static methods called when going from
 * translated values received from {@link CfnParser.parseValue}
 * to the actual L1 properties -
 * things like changing IResolvable to the appropriate type
 * (string, string array, or number), etc.
 *
 * While this file not exported from the module
 * (to not make it part of the public API),
 * it is directly referenced in the generated L1 code.
 *
 * @experimental
 */
export class FromCloudFormation {
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

  public static getCfnTag(tag: any): CfnTag {
    return tag == null
      ? { } as any // break the type system - this should be detected at runtime by a tag validator
      : {
        key: tag.Key,
        value: tag.Value,
      };
  }
}

/**
 * The context in which the parsing is taking place.
 *
 * Some fragments of CloudFormation templates behave differently than others
 * (for example, the 'Conditions' sections treats { "Condition": "NameOfCond" }
 * differently than the 'Resources' section).
 * This enum can be used to change the created {@link CfnParser} behavior,
 * based on the template context.
 */
export enum CfnParsingContext {
  /** We're currently parsing the 'Conditions' section. */
  CONDITIONS,
}

/**
 * The options for {@link FromCloudFormation.parseValue}.
 */
export interface ParseCfnOptions {
  /**
   * The finder interface used to resolve references in the template.
   */
  readonly finder: ICfnFinder;

  /**
   * The context we're parsing the template in.
   *
   * @default - the default context (no special behavior)
   */
  readonly context?: CfnParsingContext;
}

/**
 * This class contains methods for translating from a pure CFN value
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
export class CfnParser {
  private readonly options: ParseCfnOptions;

  constructor(options: ParseCfnOptions) {
    this.options = options;
  }

  public parseCreationPolicy(policy: any): CfnCreationPolicy | undefined {
    if (typeof policy !== 'object') { return undefined; }

    // change simple JS values to their CDK equivalents
    policy = this.parseValue(policy);

    return undefinedIfAllValuesAreEmpty({
      autoScalingCreationPolicy: parseAutoScalingCreationPolicy(policy.AutoScalingCreationPolicy),
      resourceSignal: parseResourceSignal(policy.ResourceSignal),
    });

    function parseAutoScalingCreationPolicy(p: any): CfnResourceAutoScalingCreationPolicy | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent),
      });
    }

    function parseResourceSignal(p: any): CfnResourceSignal | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        count: FromCloudFormation.getNumber(p.Count),
        timeout: FromCloudFormation.getString(p.Timeout),
      });
    }
  }

  public parseUpdatePolicy(policy: any): CfnUpdatePolicy | undefined {
    if (typeof policy !== 'object') { return undefined; }

    // change simple JS values to their CDK equivalents
    policy = this.parseValue(policy);

    return undefinedIfAllValuesAreEmpty({
      autoScalingReplacingUpdate: parseAutoScalingReplacingUpdate(policy.AutoScalingReplacingUpdate),
      autoScalingRollingUpdate: parseAutoScalingRollingUpdate(policy.AutoScalingRollingUpdate),
      autoScalingScheduledAction: parseAutoScalingScheduledAction(policy.AutoScalingScheduledAction),
      codeDeployLambdaAliasUpdate: parseCodeDeployLambdaAliasUpdate(policy.CodeDeployLambdaAliasUpdate),
      enableVersionUpgrade: policy.EnableVersionUpgrade,
      useOnlineResharding: policy.UseOnlineResharding,
    });

    function parseAutoScalingReplacingUpdate(p: any): CfnAutoScalingReplacingUpdate | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        willReplace: p.WillReplace,
      });
    }

    function parseAutoScalingRollingUpdate(p: any): CfnAutoScalingRollingUpdate | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        maxBatchSize: FromCloudFormation.getNumber(p.MaxBatchSize),
        minInstancesInService: FromCloudFormation.getNumber(p.MinInstancesInService),
        minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent),
        pauseTime: FromCloudFormation.getString(p.PauseTime),
        suspendProcesses: FromCloudFormation.getStringArray(p.SuspendProcesses),
        waitOnResourceSignals: p.WaitOnResourceSignals,
      });
    }

    function parseCodeDeployLambdaAliasUpdate(p: any): CfnCodeDeployLambdaAliasUpdate | undefined {
      if (typeof p !== 'object') { return undefined; }

      return {
        beforeAllowTrafficHook: FromCloudFormation.getString(p.BeforeAllowTrafficHook),
        afterAllowTrafficHook: FromCloudFormation.getString(p.AfterAllowTrafficHook),
        applicationName: FromCloudFormation.getString(p.ApplicationName),
        deploymentGroupName: FromCloudFormation.getString(p.DeploymentGroupName),
      };
    }

    function parseAutoScalingScheduledAction(p: any): CfnAutoScalingScheduledAction | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        ignoreUnmodifiedGroupSizeProperties: p.IgnoreUnmodifiedGroupSizeProperties,
      });
    }
  }

  public parseDeletionPolicy(policy: any): CfnDeletionPolicy | undefined {
    switch (policy) {
      case null: return undefined;
      case undefined: return undefined;
      case 'Delete': return CfnDeletionPolicy.DELETE;
      case 'Retain': return CfnDeletionPolicy.RETAIN;
      case 'Snapshot': return CfnDeletionPolicy.SNAPSHOT;
      default: throw new Error(`Unrecognized DeletionPolicy '${policy}'`);
    }
  }

  public parseValue(cfnValue: any): any {
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
      return cfnValue.map(el => this.parseValue(el));
    }
    if (typeof cfnValue === 'object') {
      // an object can be either a CFN intrinsic, or an actual object
      const cfnIntrinsic = this.parseIfCfnIntrinsic(cfnValue);
      if (cfnIntrinsic) {
        return cfnIntrinsic;
      }
      const ret: any = {};
      for (const [key, val] of Object.entries(cfnValue)) {
        ret[key] = this.parseValue(val);
      }
      return ret;
    }
    // in all other cases, just return the input
    return cfnValue;
  }

  private parseIfCfnIntrinsic(object: any): any {
    const key = this.looksLikeCfnIntrinsic(object);
    switch (key) {
      case undefined:
        return undefined;
      case 'Ref': {
        const refTarget = object[key];
        const specialRef = specialCaseRefs(refTarget);
        if (specialRef) {
          return specialRef;
        } else {
          const refElement = this.options.finder.findRefTarget(refTarget);
          if (!refElement) {
            throw new Error(`Element used in Ref expression with logical ID: '${refTarget}' not found`);
          }
          return CfnReference.for(refElement, 'Ref');
        }
      }
      case 'Fn::GetAtt': {
        // Fn::GetAtt takes a 2-element list as its argument
        const value = object[key];
        const target = this.options.finder.findResource(value[0]);
        if (!target) {
          throw new Error(`Resource used in GetAtt expression with logical ID: '${value[0]}' not found`);
        }
        return target.getAtt(value[1]);
      }
      case 'Fn::Join': {
        // Fn::Join takes a 2-element list as its argument,
        // where the first element is the delimiter,
        // and the second is the list of elements to join
        const value = this.parseValue(object[key]);
        return Fn.join(value[0], value[1]);
      }
      case 'Fn::Cidr': {
        const value = this.parseValue(object[key]);
        return Fn.cidr(value[0], value[1], value[2]);
      }
      case 'Fn::FindInMap': {
        const value = this.parseValue(object[key]);
        return Fn.findInMap(value[0], value[1], value[2]);
      }
      case 'Fn::Select': {
        const value = this.parseValue(object[key]);
        return Fn.select(value[0], value[1]);
      }
      case 'Fn::GetAZs': {
        const value = this.parseValue(object[key]);
        return Fn.getAzs(value);
      }
      case 'Fn::ImportValue': {
        const value = this.parseValue(object[key]);
        return Fn.importValue(value);
      }
      case 'Fn::Split': {
        const value = this.parseValue(object[key]);
        return Fn.split(value[0], value[1]);
      }
      case 'Fn::Transform': {
        const value = this.parseValue(object[key]);
        return Fn.transform(value.Name, value.Parameters);
      }
      case 'Fn::Base64': {
        const value = this.parseValue(object[key]);
        return Fn.base64(value);
      }
      case 'Fn::If': {
        // Fn::If takes a 3-element list as its argument,
        // where the first element is the name of a Condition
        const value = this.parseValue(object[key]);
        const condition = this.options.finder.findCondition(value[0]);
        if (!condition) {
          throw new Error(`Condition '${value[0]}' used in an Fn::If expression does not exist in the template`);
        }
        return Fn.conditionIf(condition.logicalId, value[1], value[2]);
      }
      case 'Fn::Equals': {
        const value = this.parseValue(object[key]);
        return Fn.conditionEquals(value[0], value[1]);
      }
      case 'Fn::And': {
        const value = this.parseValue(object[key]);
        return Fn.conditionAnd(...value);
      }
      case 'Fn::Not': {
        const value = this.parseValue(object[key]);
        return Fn.conditionNot(value[0]);
      }
      case 'Fn::Or': {
        const value = this.parseValue(object[key]);
        return Fn.conditionOr(...value);
      }
      case 'Condition': {
        // a reference to a Condition from another Condition
        const condition = this.options.finder.findCondition(object[key]);
        if (!condition) {
          throw new Error(`Referenced Condition with name '${object[key]}' was not found in the template`);
        }
        return { Condition: condition.logicalId };
      }
      default:
        throw new Error(`Unsupported CloudFormation function '${key}'`);
    }
  }

  private looksLikeCfnIntrinsic(object: object): string | undefined {
    const objectKeys = Object.keys(object);
    // a CFN intrinsic is always an object with a single key
    if (objectKeys.length !== 1) {
      return undefined;
    }

    const key = objectKeys[0];
    return key === 'Ref' || key.startsWith('Fn::') ||
        // special intrinsic only available in the 'Conditions' section
        (this.options.context === CfnParsingContext.CONDITIONS && key === 'Condition')
      ? key
      : undefined;
  }
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

function undefinedIfAllValuesAreEmpty(object: object): object | undefined {
  return Object.values(object).some(v => v !== undefined) ? object : undefined;
}
