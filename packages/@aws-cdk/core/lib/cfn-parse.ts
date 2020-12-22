import { CfnCondition } from './cfn-condition';
import { CfnElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { CfnMapping } from './cfn-mapping';
import { Aws } from './cfn-pseudo';
import { CfnResource } from './cfn-resource';
import {
  CfnAutoScalingReplacingUpdate, CfnAutoScalingRollingUpdate, CfnAutoScalingScheduledAction, CfnCodeDeployLambdaAliasUpdate,
  CfnCreationPolicy, CfnDeletionPolicy, CfnResourceAutoScalingCreationPolicy, CfnResourceSignal, CfnUpdatePolicy,
} from './cfn-resource-policy';
import { CfnTag } from './cfn-tag';
import { Lazy } from './lazy';
import { CfnReference, ReferenceRendering } from './private/cfn-reference';
import { IResolvable } from './resolvable';
import { Validator } from './runtime';
import { isResolvableObject, Token } from './token';
import { undefinedIfAllValuesAreEmpty } from './util';

/**
 * The class used as the intermediate result from the generated L1 methods
 * that convert from CloudFormation's UpperCase to CDK's lowerCase property names.
 * Saves any extra properties that were present in the argument object,
 * but that were not found in the CFN schema,
 * so that they're not lost from the final CDK-rendered template.
 */
export class FromCloudFormationResult<T> {
  public readonly value: T;
  public readonly extraProperties: { [key: string]: any };

  public constructor(value: T) {
    this.value = value;
    this.extraProperties = {};
  }

  public appendExtraProperties(prefix: string, properties: { [key: string]: any } | undefined): void {
    for (const [key, val] of Object.entries(properties ?? {})) {
      this.extraProperties[`${prefix}.${key}`] = val;
    }
  }
}

/**
 * A property object we will accumulate properties into
 */
export class FromCloudFormationPropertyObject<T extends Record<string, any>> extends FromCloudFormationResult<T> {
  private readonly recognizedProperties = new Set<string>();

  public constructor() {
    super({} as any); // We're still accumulating
  }

  /**
   * Add a parse result under a given key
   */
  public addPropertyResult(cdkPropName: keyof T, cfnPropName: string, result?: FromCloudFormationResult<any>): void {
    this.recognizedProperties.add(cfnPropName);
    if (!result) { return; }
    this.value[cdkPropName] = result.value;
    this.appendExtraProperties(cfnPropName, result.extraProperties);
  }

  public addUnrecognizedPropertiesAsExtra(properties: object): void {
    for (const [key, val] of Object.entries(properties)) {
      if (!this.recognizedProperties.has(key)) {
        this.extraProperties[key] = val;
      }
    }
  }
}

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
  public static getAny(value: any): FromCloudFormationResult<any> {
    return new FromCloudFormationResult(value);
  }

  public static getBoolean(value: any): FromCloudFormationResult<boolean | IResolvable> {
    if (typeof value === 'string') {
      // CloudFormation allows passing strings as boolean
      switch (value) {
        case 'true': return new FromCloudFormationResult(true);
        case 'false': return new FromCloudFormationResult(false);
        default: throw new Error(`Expected 'true' or 'false' for boolean value, got: '${value}'`);
      }
    }

    // in all other cases, just return the value,
    // and let a validator handle if it's not a boolean
    return new FromCloudFormationResult(value);
  }

  public static getDate(value: any): FromCloudFormationResult<Date | IResolvable> {
    // if the date is a deploy-time value, just return it
    if (isResolvableObject(value)) {
      return new FromCloudFormationResult(value);
    }

    // if the date has been given as a string, convert it
    if (typeof value === 'string') {
      return new FromCloudFormationResult(new Date(value));
    }

    // all other cases - just return the value,
    // if it's not a Date, a validator should catch it
    return new FromCloudFormationResult(value);
  }

  // won't always return a string; if the input can't be resolved to a string,
  // the input will be returned.
  public static getString(value: any): FromCloudFormationResult<string> {
    // if the string is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return new FromCloudFormationResult(value.toString());
    }

    // CloudFormation treats numbers and strings interchangeably;
    // so, if we get a number here, convert it to a string
    if (typeof value === 'number') {
      return new FromCloudFormationResult(value.toString());
    }

    // in all other cases, just return the input,
    // and let a validator handle it if it's not a string
    return new FromCloudFormationResult(value);
  }

  // won't always return a number; if the input can't be parsed to a number,
  // the input will be returned.
  public static getNumber(value: any): FromCloudFormationResult<number> {
    // if the string is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return new FromCloudFormationResult(Token.asNumber(value));
    }

    // return a number, if the input can be parsed as one
    if (typeof value === 'string') {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        return new FromCloudFormationResult(parsedValue);
      }
    }

    // otherwise return the input,
    // and let a validator handle it if it's not a number
    return new FromCloudFormationResult(value);
  }

  public static getStringArray(value: any): FromCloudFormationResult<string[]> {
    // if the array is a deploy-time value, serialize it to a Token
    if (isResolvableObject(value)) {
      return new FromCloudFormationResult(Token.asList(value));
    }

    // in all other cases, delegate to the standard mapping logic
    return this.getArray(this.getString)(value);
  }

  public static getArray<T>(mapper: (arg: any) => FromCloudFormationResult<T>): (x: any) => FromCloudFormationResult<T[]> {
    return (value: any) => {
      if (!Array.isArray(value)) {
        // break the type system, and just return the given value,
        // which hopefully will be reported as invalid by the validator
        // of the property we're transforming
        // (unless it's a deploy-time value,
        // which we can't map over at build time anyway)
        return new FromCloudFormationResult(value);
      }

      const values = new Array<any>();
      const ret = new FromCloudFormationResult(values);
      for (let i = 0; i < value.length; i++) {
        const result = mapper(value[i]);
        values.push(result.value);
        ret.appendExtraProperties(`${i}`, result.extraProperties);
      }
      return ret;
    };
  }

  public static getMap<T>(mapper: (arg: any) => FromCloudFormationResult<T>): (x: any) => FromCloudFormationResult<{ [key: string]: T }> {
    return (value: any) => {
      if (typeof value !== 'object') {
        // if the input is not a map (= object in JS land),
        // just return it, and let the validator of this property handle it
        // (unless it's a deploy-time value,
        // which we can't map over at build time anyway)
        return new FromCloudFormationResult(value);
      }

      const values: { [key: string]: T } = {};
      const ret = new FromCloudFormationResult(values);
      for (const [key, val] of Object.entries(value)) {
        const result = mapper(val);
        values[key] = result.value;
        ret.appendExtraProperties(key, result.extraProperties);
      }
      return ret;
    };
  }

  public static getCfnTag(tag: any): FromCloudFormationResult<CfnTag> {
    return tag == null
      ? new FromCloudFormationResult({ } as any) // break the type system - this should be detected at runtime by a tag validator
      : new FromCloudFormationResult({
        key: tag.Key,
        value: tag.Value,
      });
  }

  /**
   * Return a function that, when applied to a value, will return the first validly deserialized one
   */
  public static getTypeUnion(validators: Validator[], mappers: Array<(x: any) => FromCloudFormationResult<any>>):
  (x: any) => FromCloudFormationResult<any> {
    return (value: any) => {
      for (let i = 0; i < validators.length; i++) {
        const candidate = mappers[i](value);
        if (validators[i](candidate.value).isSuccess) {
          return candidate;
        }
      }

      // if nothing matches, just return the input unchanged, and let validators catch it
      return new FromCloudFormationResult(value);
    };
  }
}

/**
 * An interface that represents callbacks into a CloudFormation template.
 * Used by the fromCloudFormation methods in the generated L1 classes.
 */
export interface ICfnFinder {
  /**
   * Return the Condition with the given name from the template.
   * If there is no Condition with that name in the template,
   * returns undefined.
   */
  findCondition(conditionName: string): CfnCondition | undefined;

  /**
   * Return the Mapping with the given name from the template.
   * If there is no Mapping with that name in the template,
   * returns undefined.
   */
  findMapping(mappingName: string): CfnMapping | undefined;

  /**
   * Returns the element referenced using a Ref expression with the given name.
   * If there is no element with this name in the template,
   * return undefined.
   */
  findRefTarget(elementName: string): CfnElement | undefined;

  /**
   * Returns the resource with the given logical ID in the template.
   * If a resource with that logical ID was not found in the template,
   * returns undefined.
   */
  findResource(logicalId: string): CfnResource | undefined;
}

/**
 * The interface used as the last argument to the fromCloudFormation
 * static method of the generated L1 classes.
 */
export interface FromCloudFormationOptions {
  /**
   * The parser used to convert CloudFormation to values the CDK understands.
   */
  readonly parser: CfnParser;
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

  /** We're currently parsing the 'Rules' section. */
  RULES,
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

  /**
   * Values provided here will replace references to parameters in the parsed template.
   */
  readonly parameters: { [parameterName: string]: any };
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

  public handleAttributes(resource: CfnResource, resourceAttributes: any, logicalId: string): void {
    const cfnOptions = resource.cfnOptions;

    cfnOptions.creationPolicy = this.parseCreationPolicy(resourceAttributes.CreationPolicy);
    cfnOptions.updatePolicy = this.parseUpdatePolicy(resourceAttributes.UpdatePolicy);
    cfnOptions.deletionPolicy = this.parseDeletionPolicy(resourceAttributes.DeletionPolicy);
    cfnOptions.updateReplacePolicy = this.parseDeletionPolicy(resourceAttributes.UpdateReplacePolicy);
    cfnOptions.version = this.parseValue(resourceAttributes.Version);
    cfnOptions.description = this.parseValue(resourceAttributes.Description);
    cfnOptions.metadata = this.parseValue(resourceAttributes.Metadata);

    // handle Condition
    if (resourceAttributes.Condition) {
      const condition = this.finder.findCondition(resourceAttributes.Condition);
      if (!condition) {
        throw new Error(`Resource '${logicalId}' uses Condition '${resourceAttributes.Condition}' that doesn't exist`);
      }
      cfnOptions.condition = condition;
    }

    // handle DependsOn
    resourceAttributes.DependsOn = resourceAttributes.DependsOn ?? [];
    const dependencies: string[] = Array.isArray(resourceAttributes.DependsOn) ?
      resourceAttributes.DependsOn : [resourceAttributes.DependsOn];
    for (const dep of dependencies) {
      const depResource = this.finder.findResource(dep);
      if (!depResource) {
        throw new Error(`Resource '${logicalId}' depends on '${dep}' that doesn't exist`);
      }
      resource.node.addDependency(depResource);
    }
  }

  private parseCreationPolicy(policy: any): CfnCreationPolicy | undefined {
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
        minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent).value,
      });
    }

    function parseResourceSignal(p: any): CfnResourceSignal | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        count: FromCloudFormation.getNumber(p.Count).value,
        timeout: FromCloudFormation.getString(p.Timeout).value,
      });
    }
  }

  private parseUpdatePolicy(policy: any): CfnUpdatePolicy | undefined {
    if (typeof policy !== 'object') { return undefined; }

    // change simple JS values to their CDK equivalents
    policy = this.parseValue(policy);

    return undefinedIfAllValuesAreEmpty({
      autoScalingReplacingUpdate: parseAutoScalingReplacingUpdate(policy.AutoScalingReplacingUpdate),
      autoScalingRollingUpdate: parseAutoScalingRollingUpdate(policy.AutoScalingRollingUpdate),
      autoScalingScheduledAction: parseAutoScalingScheduledAction(policy.AutoScalingScheduledAction),
      codeDeployLambdaAliasUpdate: parseCodeDeployLambdaAliasUpdate(policy.CodeDeployLambdaAliasUpdate),
      enableVersionUpgrade: FromCloudFormation.getBoolean(policy.EnableVersionUpgrade).value,
      useOnlineResharding: FromCloudFormation.getBoolean(policy.UseOnlineResharding).value,
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
        maxBatchSize: FromCloudFormation.getNumber(p.MaxBatchSize).value,
        minInstancesInService: FromCloudFormation.getNumber(p.MinInstancesInService).value,
        minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent).value,
        pauseTime: FromCloudFormation.getString(p.PauseTime).value,
        suspendProcesses: FromCloudFormation.getStringArray(p.SuspendProcesses).value,
        waitOnResourceSignals: FromCloudFormation.getBoolean(p.WaitOnResourceSignals).value,
      });
    }

    function parseCodeDeployLambdaAliasUpdate(p: any): CfnCodeDeployLambdaAliasUpdate | undefined {
      if (typeof p !== 'object') { return undefined; }

      return {
        beforeAllowTrafficHook: FromCloudFormation.getString(p.BeforeAllowTrafficHook).value,
        afterAllowTrafficHook: FromCloudFormation.getString(p.AfterAllowTrafficHook).value,
        applicationName: FromCloudFormation.getString(p.ApplicationName).value,
        deploymentGroupName: FromCloudFormation.getString(p.DeploymentGroupName).value,
      };
    }

    function parseAutoScalingScheduledAction(p: any): CfnAutoScalingScheduledAction | undefined {
      if (typeof p !== 'object') { return undefined; }

      return undefinedIfAllValuesAreEmpty({
        ignoreUnmodifiedGroupSizeProperties: FromCloudFormation.getBoolean(p.IgnoreUnmodifiedGroupSizeProperties).value,
      });
    }
  }

  private parseDeletionPolicy(policy: any): CfnDeletionPolicy | undefined {
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
      if (cfnIntrinsic !== undefined) {
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

  public get finder(): ICfnFinder {
    return this.options.finder;
  }

  private parseIfCfnIntrinsic(object: any): any {
    const key = this.looksLikeCfnIntrinsic(object);
    switch (key) {
      case undefined:
        return undefined;
      case 'Ref': {
        const refTarget = object[key];
        const specialRef = this.specialCaseRefs(refTarget);
        if (specialRef !== undefined) {
          return specialRef;
        } else {
          const refElement = this.finder.findRefTarget(refTarget);
          if (!refElement) {
            throw new Error(`Element used in Ref expression with logical ID: '${refTarget}' not found`);
          }
          return CfnReference.for(refElement, 'Ref');
        }
      }
      case 'Fn::GetAtt': {
        const value = object[key];
        let logicalId: string, attributeName: string, stringForm: boolean;
        // Fn::GetAtt takes as arguments either a string...
        if (typeof value === 'string') {
          // ...in which case the logical ID and the attribute name are separated with '.'
          const dotIndex = value.indexOf('.');
          if (dotIndex === -1) {
            throw new Error(`Short-form Fn::GetAtt must contain a '.' in its string argument, got: '${value}'`);
          }
          logicalId = value.substr(0, dotIndex);
          attributeName = value.substr(dotIndex + 1); // the +1 is to skip the actual '.'
          stringForm = true;
        } else {
          // ...or a 2-element list
          logicalId = value[0];
          attributeName = value[1];
          stringForm = false;
        }
        const target = this.finder.findResource(logicalId);
        if (!target) {
          throw new Error(`Resource used in GetAtt expression with logical ID: '${logicalId}' not found`);
        }
        return CfnReference.for(target, attributeName, stringForm ? ReferenceRendering.GET_ATT_STRING : undefined);
      }
      case 'Fn::Join': {
        // Fn::Join takes a 2-element list as its argument,
        // where the first element is the delimiter,
        // and the second is the list of elements to join
        const value = this.parseValue(object[key]);
        // wrap the array as a Token,
        // as otherwise Fn.join() will try to concatenate
        // the non-token parts,
        // causing a diff with the original template
        return Fn.join(value[0], Lazy.list({ produce: () => value[1] }));
      }
      case 'Fn::Cidr': {
        const value = this.parseValue(object[key]);
        return Fn.cidr(value[0], value[1], value[2]);
      }
      case 'Fn::FindInMap': {
        const value = this.parseValue(object[key]);
        // the first argument to FindInMap is the mapping name
        const mapping = this.finder.findMapping(value[0]);
        if (!mapping) {
          throw new Error(`Mapping used in FindInMap expression with name '${value[0]}' was not found in the template`);
        }
        return Fn._findInMap(mapping.logicalId, value[1], value[2]);
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
        const condition = this.finder.findCondition(value[0]);
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
      case 'Fn::Sub': {
        const value = this.parseValue(object[key]);
        let fnSubString: string;
        let map: { [key: string]: any } | undefined;
        if (typeof value === 'string') {
          fnSubString = value;
          map = undefined;
        } else {
          fnSubString = value[0];
          map = value[1];
        }

        return Fn.sub(this.parseFnSubString(fnSubString, map), map);
      }
      case 'Condition': {
        // a reference to a Condition from another Condition
        const condition = this.finder.findCondition(object[key]);
        if (!condition) {
          throw new Error(`Referenced Condition with name '${object[key]}' was not found in the template`);
        }
        return { Condition: condition.logicalId };
      }
      default:
        if (this.options.context === CfnParsingContext.RULES) {
          return this.handleRulesIntrinsic(key, object);
        } else {
          throw new Error(`Unsupported CloudFormation function '${key}'`);
        }
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

  private parseFnSubString(value: string, map: { [key: string]: any } = {}): string {
    const leftBrace = value.indexOf('${');
    const rightBrace = value.indexOf('}') + 1;
    // don't include left and right braces when searching for the target of the reference
    if (leftBrace === -1 || leftBrace >= rightBrace) {
      return value;
    }

    const leftHalf = value.substring(0, leftBrace);
    const rightHalf = value.substring(rightBrace);
    const refTarget = value.substring(leftBrace + 2, rightBrace - 1).trim();
    if (refTarget[0] === '!') {
      return value.substring(0, rightBrace) + this.parseFnSubString(rightHalf, map);
    }

    // lookup in map
    if (refTarget in map) {
      return leftHalf + '${' + refTarget + '}' + this.parseFnSubString(rightHalf, map);
    }

    // since it's not in the map, check if it's a pseudo parameter
    const specialRef = this.specialCaseSubRefs(refTarget);
    if (specialRef !== undefined) {
      return leftHalf + specialRef + this.parseFnSubString(rightHalf, map);
    }

    const dotIndex = refTarget.indexOf('.');
    const isRef = dotIndex === -1;
    if (isRef) {
      const refElement = this.finder.findRefTarget(refTarget);
      if (!refElement) {
        throw new Error(`Element referenced in Fn::Sub expression with logical ID: '${refTarget}' was not found in the template`);
      }
      return leftHalf + CfnReference.for(refElement, 'Ref', ReferenceRendering.FN_SUB).toString() + this.parseFnSubString(rightHalf, map);
    } else {
      const targetId = refTarget.substring(0, dotIndex);
      const refResource = this.finder.findResource(targetId);
      if (!refResource) {
        throw new Error(`Resource referenced in Fn::Sub expression with logical ID: '${targetId}' was not found in the template`);
      }
      const attribute = refTarget.substring(dotIndex + 1);
      return leftHalf + CfnReference.for(refResource, attribute, ReferenceRendering.FN_SUB).toString() + this.parseFnSubString(rightHalf, map);
    }
  }

  private handleRulesIntrinsic(key: string, object: any): any {
    // Rules have their own set of intrinsics:
    // https://docs.aws.amazon.com/servicecatalog/latest/adminguide/intrinsic-function-reference-rules.html
    switch (key) {
      case 'Fn::ValueOf': {
        // ValueOf is special,
        // as it takes the name of a Parameter as its first argument
        const value = this.parseValue(object[key]);
        const parameterName = value[0];
        if (parameterName in this.parameters) {
          // since ValueOf returns the value of a specific attribute,
          // fail here - this substitution is not allowed
          throw new Error(`Cannot substitute parameter '${parameterName}' used in Fn::ValueOf expression with attribute '${value[1]}'`);
        }
        const param = this.finder.findRefTarget(parameterName);
        if (!param) {
          throw new Error(`Rule references parameter '${parameterName}' which was not found in the template`);
        }
        // create an explicit IResolvable,
        // as Fn.valueOf() returns a string,
        // which is incorrect
        // (Fn::ValueOf can also return an array)
        return Lazy.any({ produce: () => ({ 'Fn::ValueOf': [param.logicalId, value[1]] }) });
      }
      default:
        // I don't want to hard-code the list of supported Rules-specific intrinsics in this function;
        // so, just return undefined here,
        // and they will be treated as a regular JSON object
        return undefined;
    }
  }

  private specialCaseRefs(value: any): any {
    if (value in this.parameters) {
      return this.parameters[value];
    }
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

  private specialCaseSubRefs(value: string): string | undefined {
    if (value in this.parameters) {
      return this.parameters[value];
    }
    return value.indexOf('::') === -1 ? undefined: '${' + value + '}';
  }

  private get parameters(): { [parameterName: string]: any } {
    return this.options.parameters || {};
  }
}
