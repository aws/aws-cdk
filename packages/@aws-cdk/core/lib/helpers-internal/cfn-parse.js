"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnParser = exports.CfnParsingContext = exports.FromCloudFormation = exports.FromCloudFormationPropertyObject = exports.FromCloudFormationResult = void 0;
const cfn_fn_1 = require("../cfn-fn");
const cfn_pseudo_1 = require("../cfn-pseudo");
const cfn_resource_policy_1 = require("../cfn-resource-policy");
const lazy_1 = require("../lazy");
const cfn_reference_1 = require("../private/cfn-reference");
const token_1 = require("../token");
const util_1 = require("../util");
/**
 * The class used as the intermediate result from the generated L1 methods
 * that convert from CloudFormation's UpperCase to CDK's lowerCase property names.
 * Saves any extra properties that were present in the argument object,
 * but that were not found in the CFN schema,
 * so that they're not lost from the final CDK-rendered template.
 */
class FromCloudFormationResult {
    constructor(value) {
        this.value = value;
        this.extraProperties = {};
    }
    appendExtraProperties(prefix, properties) {
        for (const [key, val] of Object.entries(properties ?? {})) {
            this.extraProperties[`${prefix}.${key}`] = val;
        }
    }
}
exports.FromCloudFormationResult = FromCloudFormationResult;
/**
 * A property object we will accumulate properties into
 */
class FromCloudFormationPropertyObject extends FromCloudFormationResult {
    constructor() {
        super({}); // We're still accumulating
        this.recognizedProperties = new Set();
    }
    /**
     * Add a parse result under a given key
     */
    addPropertyResult(cdkPropName, cfnPropName, result) {
        this.recognizedProperties.add(cfnPropName);
        if (!result) {
            return;
        }
        this.value[cdkPropName] = result.value;
        this.appendExtraProperties(cfnPropName, result.extraProperties);
    }
    addUnrecognizedPropertiesAsExtra(properties) {
        for (const [key, val] of Object.entries(properties)) {
            if (!this.recognizedProperties.has(key)) {
                this.extraProperties[key] = val;
            }
        }
    }
}
exports.FromCloudFormationPropertyObject = FromCloudFormationPropertyObject;
/**
 * This class contains static methods called when going from
 * translated values received from `CfnParser.parseValue`
 * to the actual L1 properties -
 * things like changing IResolvable to the appropriate type
 * (string, string array, or number), etc.
 *
 * While this file not exported from the module
 * (to not make it part of the public API),
 * it is directly referenced in the generated L1 code.
 *
 */
class FromCloudFormation {
    // nothing to for any but return it
    static getAny(value) {
        return new FromCloudFormationResult(value);
    }
    static getBoolean(value) {
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
    static getDate(value) {
        // if the date is a deploy-time value, just return it
        if ((0, token_1.isResolvableObject)(value)) {
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
    static getString(value) {
        // if the string is a deploy-time value, serialize it to a Token
        if ((0, token_1.isResolvableObject)(value)) {
            return new FromCloudFormationResult(value.toString());
        }
        // CloudFormation treats numbers and strings interchangeably;
        // so, if we get a number here, convert it to a string
        if (typeof value === 'number') {
            return new FromCloudFormationResult(value.toString());
        }
        // CloudFormation treats booleans and strings interchangeably;
        // so, if we get a boolean here, convert it to a string
        if (typeof value === 'boolean') {
            return new FromCloudFormationResult(value.toString());
        }
        // in all other cases, just return the input,
        // and let a validator handle it if it's not a string
        return new FromCloudFormationResult(value);
    }
    // won't always return a number; if the input can't be parsed to a number,
    // the input will be returned.
    static getNumber(value) {
        // if the string is a deploy-time value, serialize it to a Token
        if ((0, token_1.isResolvableObject)(value)) {
            return new FromCloudFormationResult(token_1.Token.asNumber(value));
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
    static getStringArray(value) {
        // if the array is a deploy-time value, serialize it to a Token
        if ((0, token_1.isResolvableObject)(value)) {
            return new FromCloudFormationResult(token_1.Token.asList(value));
        }
        // in all other cases, delegate to the standard mapping logic
        return this.getArray(this.getString)(value);
    }
    static getArray(mapper) {
        return (value) => {
            if (!Array.isArray(value)) {
                // break the type system, and just return the given value,
                // which hopefully will be reported as invalid by the validator
                // of the property we're transforming
                // (unless it's a deploy-time value,
                // which we can't map over at build time anyway)
                return new FromCloudFormationResult(value);
            }
            const values = new Array();
            const ret = new FromCloudFormationResult(values);
            for (let i = 0; i < value.length; i++) {
                const result = mapper(value[i]);
                values.push(result.value);
                ret.appendExtraProperties(`${i}`, result.extraProperties);
            }
            return ret;
        };
    }
    static getMap(mapper) {
        return (value) => {
            if (typeof value !== 'object') {
                // if the input is not a map (= object in JS land),
                // just return it, and let the validator of this property handle it
                // (unless it's a deploy-time value,
                // which we can't map over at build time anyway)
                return new FromCloudFormationResult(value);
            }
            const values = {};
            const ret = new FromCloudFormationResult(values);
            for (const [key, val] of Object.entries(value)) {
                const result = mapper(val);
                values[key] = result.value;
                ret.appendExtraProperties(key, result.extraProperties);
            }
            return ret;
        };
    }
    static getCfnTag(tag) {
        return tag == null
            ? new FromCloudFormationResult({}) // break the type system - this should be detected at runtime by a tag validator
            : new FromCloudFormationResult({
                key: tag.Key,
                value: tag.Value,
            });
    }
    /**
     * Return a function that, when applied to a value, will return the first validly deserialized one
     */
    static getTypeUnion(validators, mappers) {
        return (value) => {
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
exports.FromCloudFormation = FromCloudFormation;
/**
 * The context in which the parsing is taking place.
 *
 * Some fragments of CloudFormation templates behave differently than others
 * (for example, the 'Conditions' sections treats { "Condition": "NameOfCond" }
 * differently than the 'Resources' section).
 * This enum can be used to change the created `CfnParser` behavior,
 * based on the template context.
 */
var CfnParsingContext;
(function (CfnParsingContext) {
    /** We're currently parsing the 'Conditions' section. */
    CfnParsingContext[CfnParsingContext["CONDITIONS"] = 0] = "CONDITIONS";
    /** We're currently parsing the 'Rules' section. */
    CfnParsingContext[CfnParsingContext["RULES"] = 1] = "RULES";
})(CfnParsingContext = exports.CfnParsingContext || (exports.CfnParsingContext = {}));
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
 */
class CfnParser {
    constructor(options) {
        this.options = options;
    }
    handleAttributes(resource, resourceAttributes, logicalId) {
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
        const dependencies = Array.isArray(resourceAttributes.DependsOn) ?
            resourceAttributes.DependsOn : [resourceAttributes.DependsOn];
        for (const dep of dependencies) {
            const depResource = this.finder.findResource(dep);
            if (!depResource) {
                throw new Error(`Resource '${logicalId}' depends on '${dep}' that doesn't exist`);
            }
            resource.node.addDependency(depResource);
        }
    }
    parseCreationPolicy(policy) {
        if (typeof policy !== 'object') {
            return undefined;
        }
        // change simple JS values to their CDK equivalents
        policy = this.parseValue(policy);
        return (0, util_1.undefinedIfAllValuesAreEmpty)({
            autoScalingCreationPolicy: parseAutoScalingCreationPolicy(policy.AutoScalingCreationPolicy),
            resourceSignal: parseResourceSignal(policy.ResourceSignal),
        });
        function parseAutoScalingCreationPolicy(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return (0, util_1.undefinedIfAllValuesAreEmpty)({
                minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent).value,
            });
        }
        function parseResourceSignal(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return (0, util_1.undefinedIfAllValuesAreEmpty)({
                count: FromCloudFormation.getNumber(p.Count).value,
                timeout: FromCloudFormation.getString(p.Timeout).value,
            });
        }
    }
    parseUpdatePolicy(policy) {
        if (typeof policy !== 'object') {
            return undefined;
        }
        // change simple JS values to their CDK equivalents
        policy = this.parseValue(policy);
        return (0, util_1.undefinedIfAllValuesAreEmpty)({
            autoScalingReplacingUpdate: parseAutoScalingReplacingUpdate(policy.AutoScalingReplacingUpdate),
            autoScalingRollingUpdate: parseAutoScalingRollingUpdate(policy.AutoScalingRollingUpdate),
            autoScalingScheduledAction: parseAutoScalingScheduledAction(policy.AutoScalingScheduledAction),
            codeDeployLambdaAliasUpdate: parseCodeDeployLambdaAliasUpdate(policy.CodeDeployLambdaAliasUpdate),
            enableVersionUpgrade: FromCloudFormation.getBoolean(policy.EnableVersionUpgrade).value,
            useOnlineResharding: FromCloudFormation.getBoolean(policy.UseOnlineResharding).value,
        });
        function parseAutoScalingReplacingUpdate(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return (0, util_1.undefinedIfAllValuesAreEmpty)({
                willReplace: p.WillReplace,
            });
        }
        function parseAutoScalingRollingUpdate(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return (0, util_1.undefinedIfAllValuesAreEmpty)({
                maxBatchSize: FromCloudFormation.getNumber(p.MaxBatchSize).value,
                minInstancesInService: FromCloudFormation.getNumber(p.MinInstancesInService).value,
                minSuccessfulInstancesPercent: FromCloudFormation.getNumber(p.MinSuccessfulInstancesPercent).value,
                pauseTime: FromCloudFormation.getString(p.PauseTime).value,
                suspendProcesses: FromCloudFormation.getStringArray(p.SuspendProcesses).value,
                waitOnResourceSignals: FromCloudFormation.getBoolean(p.WaitOnResourceSignals).value,
            });
        }
        function parseCodeDeployLambdaAliasUpdate(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return {
                beforeAllowTrafficHook: FromCloudFormation.getString(p.BeforeAllowTrafficHook).value,
                afterAllowTrafficHook: FromCloudFormation.getString(p.AfterAllowTrafficHook).value,
                applicationName: FromCloudFormation.getString(p.ApplicationName).value,
                deploymentGroupName: FromCloudFormation.getString(p.DeploymentGroupName).value,
            };
        }
        function parseAutoScalingScheduledAction(p) {
            if (typeof p !== 'object') {
                return undefined;
            }
            return (0, util_1.undefinedIfAllValuesAreEmpty)({
                ignoreUnmodifiedGroupSizeProperties: FromCloudFormation.getBoolean(p.IgnoreUnmodifiedGroupSizeProperties).value,
            });
        }
    }
    parseDeletionPolicy(policy) {
        switch (policy) {
            case null: return undefined;
            case undefined: return undefined;
            case 'Delete': return cfn_resource_policy_1.CfnDeletionPolicy.DELETE;
            case 'Retain': return cfn_resource_policy_1.CfnDeletionPolicy.RETAIN;
            case 'Snapshot': return cfn_resource_policy_1.CfnDeletionPolicy.SNAPSHOT;
            default: throw new Error(`Unrecognized DeletionPolicy '${policy}'`);
        }
    }
    parseValue(cfnValue) {
        // == null captures undefined as well
        if (cfnValue == null) {
            return undefined;
        }
        // if we have any late-bound values,
        // just return them
        if ((0, token_1.isResolvableObject)(cfnValue)) {
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
            const ret = {};
            for (const [key, val] of Object.entries(cfnValue)) {
                ret[key] = this.parseValue(val);
            }
            return ret;
        }
        // in all other cases, just return the input
        return cfnValue;
    }
    get finder() {
        return this.options.finder;
    }
    parseIfCfnIntrinsic(object) {
        const key = this.looksLikeCfnIntrinsic(object);
        switch (key) {
            case undefined:
                return undefined;
            case 'Ref': {
                const refTarget = object[key];
                const specialRef = this.specialCaseRefs(refTarget);
                if (specialRef !== undefined) {
                    return specialRef;
                }
                else {
                    const refElement = this.finder.findRefTarget(refTarget);
                    if (!refElement) {
                        throw new Error(`Element used in Ref expression with logical ID: '${refTarget}' not found`);
                    }
                    return cfn_reference_1.CfnReference.for(refElement, 'Ref');
                }
            }
            case 'Fn::GetAtt': {
                const value = object[key];
                let logicalId, attributeName, stringForm;
                // Fn::GetAtt takes as arguments either a string...
                if (typeof value === 'string') {
                    // ...in which case the logical ID and the attribute name are separated with '.'
                    const dotIndex = value.indexOf('.');
                    if (dotIndex === -1) {
                        throw new Error(`Short-form Fn::GetAtt must contain a '.' in its string argument, got: '${value}'`);
                    }
                    logicalId = value.slice(0, dotIndex);
                    attributeName = value.slice(dotIndex + 1); // the +1 is to skip the actual '.'
                    stringForm = true;
                }
                else {
                    // ...or a 2-element list
                    logicalId = value[0];
                    attributeName = value[1];
                    stringForm = false;
                }
                const target = this.finder.findResource(logicalId);
                if (!target) {
                    throw new Error(`Resource used in GetAtt expression with logical ID: '${logicalId}' not found`);
                }
                return cfn_reference_1.CfnReference.for(target, attributeName, stringForm ? cfn_reference_1.ReferenceRendering.GET_ATT_STRING : undefined);
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
                return cfn_fn_1.Fn.join(value[0], lazy_1.Lazy.list({ produce: () => value[1] }));
            }
            case 'Fn::Cidr': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.cidr(value[0], value[1], value[2]);
            }
            case 'Fn::FindInMap': {
                const value = this.parseValue(object[key]);
                // the first argument to FindInMap is the mapping name
                let mappingName;
                if (token_1.Token.isUnresolved(value[0])) {
                    // the first argument can be a dynamic expression like Ref: Param;
                    // if it is, we can't find the mapping in advance
                    mappingName = value[0];
                }
                else {
                    const mapping = this.finder.findMapping(value[0]);
                    if (!mapping) {
                        throw new Error(`Mapping used in FindInMap expression with name '${value[0]}' was not found in the template`);
                    }
                    mappingName = mapping.logicalId;
                }
                return cfn_fn_1.Fn._findInMap(mappingName, value[1], value[2]);
            }
            case 'Fn::Select': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.select(value[0], value[1]);
            }
            case 'Fn::GetAZs': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.getAzs(value);
            }
            case 'Fn::ImportValue': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.importValue(value);
            }
            case 'Fn::Split': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.split(value[0], value[1]);
            }
            case 'Fn::Transform': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.transform(value.Name, value.Parameters);
            }
            case 'Fn::Base64': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.base64(value);
            }
            case 'Fn::If': {
                // Fn::If takes a 3-element list as its argument,
                // where the first element is the name of a Condition
                const value = this.parseValue(object[key]);
                const condition = this.finder.findCondition(value[0]);
                if (!condition) {
                    throw new Error(`Condition '${value[0]}' used in an Fn::If expression does not exist in the template`);
                }
                return cfn_fn_1.Fn.conditionIf(condition.logicalId, value[1], value[2]);
            }
            case 'Fn::Equals': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.conditionEquals(value[0], value[1]);
            }
            case 'Fn::And': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.conditionAnd(...value);
            }
            case 'Fn::Not': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.conditionNot(value[0]);
            }
            case 'Fn::Or': {
                const value = this.parseValue(object[key]);
                return cfn_fn_1.Fn.conditionOr(...value);
            }
            case 'Fn::Sub': {
                const value = this.parseValue(object[key]);
                let fnSubString;
                let map;
                if (typeof value === 'string') {
                    fnSubString = value;
                    map = undefined;
                }
                else {
                    fnSubString = value[0];
                    map = value[1];
                }
                return this.parseFnSubString(fnSubString, map);
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
                }
                else {
                    throw new Error(`Unsupported CloudFormation function '${key}'`);
                }
        }
    }
    looksLikeCfnIntrinsic(object) {
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
    parseFnSubString(templateString, expressionMap) {
        const map = expressionMap ?? {};
        const self = this;
        return cfn_fn_1.Fn.sub(go(templateString), Object.keys(map).length === 0 ? expressionMap : map);
        function go(value) {
            const leftBrace = value.indexOf('${');
            if (leftBrace === -1) {
                return value;
            }
            // search for the closing brace to the right of the opening '${'
            // (in theory, there could be other braces in the string,
            // for example if it represents a JSON object)
            const rightBrace = value.indexOf('}', leftBrace);
            if (rightBrace === -1) {
                return value;
            }
            const leftHalf = value.substring(0, leftBrace);
            const rightHalf = value.substring(rightBrace + 1);
            // don't include left and right braces when searching for the target of the reference
            const refTarget = value.substring(leftBrace + 2, rightBrace).trim();
            if (refTarget[0] === '!') {
                return value.substring(0, rightBrace + 1) + go(rightHalf);
            }
            // lookup in map
            if (refTarget in map) {
                return leftHalf + '${' + refTarget + '}' + go(rightHalf);
            }
            // since it's not in the map, check if it's a pseudo-parameter
            // (or a value to be substituted for a Parameter, provided by the customer)
            const specialRef = self.specialCaseSubRefs(refTarget);
            if (specialRef !== undefined) {
                if (token_1.Token.isUnresolved(specialRef)) {
                    // specialRef can only be a Token if the value passed by the customer
                    // for substituting a Parameter was a Token.
                    // This is actually bad here,
                    // because the Token can potentially be something that doesn't render
                    // well inside an Fn::Sub template string, like a { Ref } object.
                    // To handle this case,
                    // instead of substituting the Parameter directly with the token in the template string,
                    // add a new entry to the Fn::Sub map,
                    // with key refTarget, and the token as the value.
                    // This is safe, because this sort of shadowing is legal in CloudFormation,
                    // and also because we're certain the Fn::Sub map doesn't contain an entry for refTarget
                    // (as we check that condition in the code right above this).
                    map[refTarget] = specialRef;
                    return leftHalf + '${' + refTarget + '}' + go(rightHalf);
                }
                else {
                    return leftHalf + specialRef + go(rightHalf);
                }
            }
            const dotIndex = refTarget.indexOf('.');
            const isRef = dotIndex === -1;
            if (isRef) {
                const refElement = self.finder.findRefTarget(refTarget);
                if (!refElement) {
                    throw new Error(`Element referenced in Fn::Sub expression with logical ID: '${refTarget}' was not found in the template`);
                }
                return leftHalf + cfn_reference_1.CfnReference.for(refElement, 'Ref', cfn_reference_1.ReferenceRendering.FN_SUB).toString() + go(rightHalf);
            }
            else {
                const targetId = refTarget.substring(0, dotIndex);
                const refResource = self.finder.findResource(targetId);
                if (!refResource) {
                    throw new Error(`Resource referenced in Fn::Sub expression with logical ID: '${targetId}' was not found in the template`);
                }
                const attribute = refTarget.substring(dotIndex + 1);
                return leftHalf + cfn_reference_1.CfnReference.for(refResource, attribute, cfn_reference_1.ReferenceRendering.FN_SUB).toString() + go(rightHalf);
            }
        }
    }
    handleRulesIntrinsic(key, object) {
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
                return lazy_1.Lazy.any({ produce: () => ({ 'Fn::ValueOf': [param.logicalId, value[1]] }) });
            }
            default:
                // I don't want to hard-code the list of supported Rules-specific intrinsics in this function;
                // so, just return undefined here,
                // and they will be treated as a regular JSON object
                return undefined;
        }
    }
    specialCaseRefs(value) {
        if (value in this.parameters) {
            return this.parameters[value];
        }
        switch (value) {
            case 'AWS::AccountId': return cfn_pseudo_1.Aws.ACCOUNT_ID;
            case 'AWS::Region': return cfn_pseudo_1.Aws.REGION;
            case 'AWS::Partition': return cfn_pseudo_1.Aws.PARTITION;
            case 'AWS::URLSuffix': return cfn_pseudo_1.Aws.URL_SUFFIX;
            case 'AWS::NotificationARNs': return cfn_pseudo_1.Aws.NOTIFICATION_ARNS;
            case 'AWS::StackId': return cfn_pseudo_1.Aws.STACK_ID;
            case 'AWS::StackName': return cfn_pseudo_1.Aws.STACK_NAME;
            case 'AWS::NoValue': return cfn_pseudo_1.Aws.NO_VALUE;
            default: return undefined;
        }
    }
    specialCaseSubRefs(value) {
        if (value in this.parameters) {
            return this.parameters[value];
        }
        return value.indexOf('::') === -1 ? undefined : '${' + value + '}';
    }
    get parameters() {
        return this.options.parameters || {};
    }
}
exports.CfnParser = CfnParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXBhcnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNDQUErQjtBQUUvQiw4Q0FBb0M7QUFFcEMsZ0VBR2dDO0FBRWhDLGtDQUErQjtBQUMvQiw0REFBNEU7QUFHNUUsb0NBQXFEO0FBQ3JELGtDQUF1RDtBQUV2RDs7Ozs7O0dBTUc7QUFDSCxNQUFhLHdCQUF3QjtJQUluQyxZQUFtQixLQUFRO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0tBQzNCO0lBRU0scUJBQXFCLENBQUMsTUFBYyxFQUFFLFVBQThDO1FBQ3pGLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUN6RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ2hEO0tBQ0Y7Q0FDRjtBQWRELDREQWNDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGdDQUFnRSxTQUFRLHdCQUEyQjtJQUc5RztRQUNFLEtBQUssQ0FBQyxFQUFTLENBQUMsQ0FBQyxDQUFDLDJCQUEyQjtRQUg5Qix5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0tBSXpEO0lBRUQ7O09BRUc7SUFDSSxpQkFBaUIsQ0FBQyxXQUFvQixFQUFFLFdBQW1CLEVBQUUsTUFBc0M7UUFDeEcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN2QyxJQUFJLENB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QztTQUMvQjtRQUNELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUNuRTtJQUVELElBQVksVUFBVTtRQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztLQUN0QztDQUNGO0FBMWRELDhCQTBkQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmbkNvbmRpdGlvbiB9IGZyb20gJy4uL2Nmbi1jb25kaXRpb24nO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4uL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi4vY2ZuLWZuJztcbmltcG9ydCB7IENmbk1hcHBpbmcgfSBmcm9tICcuLi9jZm4tbWFwcGluZyc7XG5pbXBvcnQgeyBBd3MgfSBmcm9tICcuLi9jZm4tcHNldWRvJztcbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7XG4gIENmbkF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlLCBDZm5BdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGUsIENmbkF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uLCBDZm5Db2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGUsXG4gIENmbkNyZWF0aW9uUG9saWN5LCBDZm5EZWxldGlvblBvbGljeSwgQ2ZuUmVzb3VyY2VBdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5LCBDZm5SZXNvdXJjZVNpZ25hbCwgQ2ZuVXBkYXRlUG9saWN5LFxufSBmcm9tICcuLi9jZm4tcmVzb3VyY2UtcG9saWN5JztcbmltcG9ydCB7IENmblRhZyB9IGZyb20gJy4uL2Nmbi10YWcnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4uL2xhenknO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlLCBSZWZlcmVuY2VSZW5kZXJpbmcgfSBmcm9tICcuLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUgfSBmcm9tICcuLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFZhbGlkYXRvciB9IGZyb20gJy4uL3J1bnRpbWUnO1xuaW1wb3J0IHsgaXNSZXNvbHZhYmxlT2JqZWN0LCBUb2tlbiB9IGZyb20gJy4uL3Rva2VuJztcbmltcG9ydCB7IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkgfSBmcm9tICcuLi91dGlsJztcblxuLyoqXG4gKiBUaGUgY2xhc3MgdXNlZCBhcyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdCBmcm9tIHRoZSBnZW5lcmF0ZWQgTDEgbWV0aG9kc1xuICogdGhhdCBjb252ZXJ0IGZyb20gQ2xvdWRGb3JtYXRpb24ncyBVcHBlckNhc2UgdG8gQ0RLJ3MgbG93ZXJDYXNlIHByb3BlcnR5IG5hbWVzLlxuICogU2F2ZXMgYW55IGV4dHJhIHByb3BlcnRpZXMgdGhhdCB3ZXJlIHByZXNlbnQgaW4gdGhlIGFyZ3VtZW50IG9iamVjdCxcbiAqIGJ1dCB0aGF0IHdlcmUgbm90IGZvdW5kIGluIHRoZSBDRk4gc2NoZW1hLFxuICogc28gdGhhdCB0aGV5J3JlIG5vdCBsb3N0IGZyb20gdGhlIGZpbmFsIENESy1yZW5kZXJlZCB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxUPiB7XG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogVDtcbiAgcHVibGljIHJlYWRvbmx5IGV4dHJhUHJvcGVydGllczogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IodmFsdWU6IFQpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5leHRyYVByb3BlcnRpZXMgPSB7fTtcbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRFeHRyYVByb3BlcnRpZXMocHJlZml4OiBzdHJpbmcsIHByb3BlcnRpZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcyA/PyB7fSkpIHtcbiAgICAgIHRoaXMuZXh0cmFQcm9wZXJ0aWVzW2Ake3ByZWZpeH0uJHtrZXl9YF0gPSB2YWw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSBwcm9wZXJ0eSBvYmplY3Qgd2Ugd2lsbCBhY2N1bXVsYXRlIHByb3BlcnRpZXMgaW50b1xuICovXG5leHBvcnQgY2xhc3MgRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+IGV4dGVuZHMgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PFQ+IHtcbiAgcHJpdmF0ZSByZWFkb25seSByZWNvZ25pemVkUHJvcGVydGllcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7fSBhcyBhbnkpOyAvLyBXZSdyZSBzdGlsbCBhY2N1bXVsYXRpbmdcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBwYXJzZSByZXN1bHQgdW5kZXIgYSBnaXZlbiBrZXlcbiAgICovXG4gIHB1YmxpYyBhZGRQcm9wZXJ0eVJlc3VsdChjZGtQcm9wTmFtZToga2V5b2YgVCwgY2ZuUHJvcE5hbWU6IHN0cmluZywgcmVzdWx0PzogRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnJlY29nbml6ZWRQcm9wZXJ0aWVzLmFkZChjZm5Qcm9wTmFtZSk7XG4gICAgaWYgKCFyZXN1bHQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy52YWx1ZVtjZGtQcm9wTmFtZV0gPSByZXN1bHQudmFsdWU7XG4gICAgdGhpcy5hcHBlbmRFeHRyYVByb3BlcnRpZXMoY2ZuUHJvcE5hbWUsIHJlc3VsdC5leHRyYVByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHVibGljIGFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXM6IG9iamVjdCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xuICAgICAgaWYgKCF0aGlzLnJlY29nbml6ZWRQcm9wZXJ0aWVzLmhhcyhrZXkpKSB7XG4gICAgICAgIHRoaXMuZXh0cmFQcm9wZXJ0aWVzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjb250YWlucyBzdGF0aWMgbWV0aG9kcyBjYWxsZWQgd2hlbiBnb2luZyBmcm9tXG4gKiB0cmFuc2xhdGVkIHZhbHVlcyByZWNlaXZlZCBmcm9tIGBDZm5QYXJzZXIucGFyc2VWYWx1ZWBcbiAqIHRvIHRoZSBhY3R1YWwgTDEgcHJvcGVydGllcyAtXG4gKiB0aGluZ3MgbGlrZSBjaGFuZ2luZyBJUmVzb2x2YWJsZSB0byB0aGUgYXBwcm9wcmlhdGUgdHlwZVxuICogKHN0cmluZywgc3RyaW5nIGFycmF5LCBvciBudW1iZXIpLCBldGMuXG4gKlxuICogV2hpbGUgdGhpcyBmaWxlIG5vdCBleHBvcnRlZCBmcm9tIHRoZSBtb2R1bGVcbiAqICh0byBub3QgbWFrZSBpdCBwYXJ0IG9mIHRoZSBwdWJsaWMgQVBJKSxcbiAqIGl0IGlzIGRpcmVjdGx5IHJlZmVyZW5jZWQgaW4gdGhlIGdlbmVyYXRlZCBMMSBjb2RlLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEZyb21DbG91ZEZvcm1hdGlvbiB7XG4gIC8vIG5vdGhpbmcgdG8gZm9yIGFueSBidXQgcmV0dXJuIGl0XG4gIHB1YmxpYyBzdGF0aWMgZ2V0QW55KHZhbHVlOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRCb29sZWFuKHZhbHVlOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Ym9vbGVhbiB8IElSZXNvbHZhYmxlPiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIENsb3VkRm9ybWF0aW9uIGFsbG93cyBwYXNzaW5nIHN0cmluZ3MgYXMgYm9vbGVhblxuICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICd0cnVlJzogcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodHJ1ZSk7XG4gICAgICAgIGNhc2UgJ2ZhbHNlJzogcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQoZmFsc2UpO1xuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICd0cnVlJyBvciAnZmFsc2UnIGZvciBib29sZWFuIHZhbHVlLCBnb3Q6ICcke3ZhbHVlfSdgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbiBhbGwgb3RoZXIgY2FzZXMsIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZSxcbiAgICAvLyBhbmQgbGV0IGEgdmFsaWRhdG9yIGhhbmRsZSBpZiBpdCdzIG5vdCBhIGJvb2xlYW5cbiAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldERhdGUodmFsdWU6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxEYXRlIHwgSVJlc29sdmFibGU+IHtcbiAgICAvLyBpZiB0aGUgZGF0ZSBpcyBhIGRlcGxveS10aW1lIHZhbHVlLCBqdXN0IHJldHVybiBpdFxuICAgIGlmIChpc1Jlc29sdmFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRhdGUgaGFzIGJlZW4gZ2l2ZW4gYXMgYSBzdHJpbmcsIGNvbnZlcnQgaXRcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQobmV3IERhdGUodmFsdWUpKTtcbiAgICB9XG5cbiAgICAvLyBhbGwgb3RoZXIgY2FzZXMgLSBqdXN0IHJldHVybiB0aGUgdmFsdWUsXG4gICAgLy8gaWYgaXQncyBub3QgYSBEYXRlLCBhIHZhbGlkYXRvciBzaG91bGQgY2F0Y2ggaXRcbiAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICAvLyB3b24ndCBhbHdheXMgcmV0dXJuIGEgc3RyaW5nOyBpZiB0aGUgaW5wdXQgY2FuJ3QgYmUgcmVzb2x2ZWQgdG8gYSBzdHJpbmcsXG4gIC8vIHRoZSBpbnB1dCB3aWxsIGJlIHJldHVybmVkLlxuICBwdWJsaWMgc3RhdGljIGdldFN0cmluZyh2YWx1ZTogYW55KTogRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PHN0cmluZz4ge1xuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgYSBkZXBsb3ktdGltZSB2YWx1ZSwgc2VyaWFsaXplIGl0IHRvIGEgVG9rZW5cbiAgICBpZiAoaXNSZXNvbHZhYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gQ2xvdWRGb3JtYXRpb24gdHJlYXRzIG51bWJlcnMgYW5kIHN0cmluZ3MgaW50ZXJjaGFuZ2VhYmx5O1xuICAgIC8vIHNvLCBpZiB3ZSBnZXQgYSBudW1iZXIgaGVyZSwgY29udmVydCBpdCB0byBhIHN0cmluZ1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZS50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBDbG91ZEZvcm1hdGlvbiB0cmVhdHMgYm9vbGVhbnMgYW5kIHN0cmluZ3MgaW50ZXJjaGFuZ2VhYmx5O1xuICAgIC8vIHNvLCBpZiB3ZSBnZXQgYSBib29sZWFuIGhlcmUsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmdcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIGluIGFsbCBvdGhlciBjYXNlcywganVzdCByZXR1cm4gdGhlIGlucHV0LFxuICAgIC8vIGFuZCBsZXQgYSB2YWxpZGF0b3IgaGFuZGxlIGl0IGlmIGl0J3Mgbm90IGEgc3RyaW5nXG4gICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUpO1xuICB9XG5cbiAgLy8gd29uJ3QgYWx3YXlzIHJldHVybiBhIG51bWJlcjsgaWYgdGhlIGlucHV0IGNhbid0IGJlIHBhcnNlZCB0byBhIG51bWJlcixcbiAgLy8gdGhlIGlucHV0IHdpbGwgYmUgcmV0dXJuZWQuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0TnVtYmVyKHZhbHVlOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8bnVtYmVyPiB7XG4gICAgLy8gaWYgdGhlIHN0cmluZyBpcyBhIGRlcGxveS10aW1lIHZhbHVlLCBzZXJpYWxpemUgaXQgdG8gYSBUb2tlblxuICAgIGlmIChpc1Jlc29sdmFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChUb2tlbi5hc051bWJlcih2YWx1ZSkpO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBhIG51bWJlciwgaWYgdGhlIGlucHV0IGNhbiBiZSBwYXJzZWQgYXMgb25lXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzTmFOKHBhcnNlZFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwYXJzZWRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlIHJldHVybiB0aGUgaW5wdXQsXG4gICAgLy8gYW5kIGxldCBhIHZhbGlkYXRvciBoYW5kbGUgaXQgaWYgaXQncyBub3QgYSBudW1iZXJcbiAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldFN0cmluZ0FycmF5KHZhbHVlOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8c3RyaW5nW10+IHtcbiAgICAvLyBpZiB0aGUgYXJyYXkgaXMgYSBkZXBsb3ktdGltZSB2YWx1ZSwgc2VyaWFsaXplIGl0IHRvIGEgVG9rZW5cbiAgICBpZiAoaXNSZXNvbHZhYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQoVG9rZW4uYXNMaXN0KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLy8gaW4gYWxsIG90aGVyIGNhc2VzLCBkZWxlZ2F0ZSB0byB0aGUgc3RhbmRhcmQgbWFwcGluZyBsb2dpY1xuICAgIHJldHVybiB0aGlzLmdldEFycmF5KHRoaXMuZ2V0U3RyaW5nKSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEFycmF5PFQ+KG1hcHBlcjogKGFyZzogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8VD4pOiAoeDogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8VFtdPiB7XG4gICAgcmV0dXJuICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIC8vIGJyZWFrIHRoZSB0eXBlIHN5c3RlbSwgYW5kIGp1c3QgcmV0dXJuIHRoZSBnaXZlbiB2YWx1ZSxcbiAgICAgICAgLy8gd2hpY2ggaG9wZWZ1bGx5IHdpbGwgYmUgcmVwb3J0ZWQgYXMgaW52YWxpZCBieSB0aGUgdmFsaWRhdG9yXG4gICAgICAgIC8vIG9mIHRoZSBwcm9wZXJ0eSB3ZSdyZSB0cmFuc2Zvcm1pbmdcbiAgICAgICAgLy8gKHVubGVzcyBpdCdzIGEgZGVwbG95LXRpbWUgdmFsdWUsXG4gICAgICAgIC8vIHdoaWNoIHdlIGNhbid0IG1hcCBvdmVyIGF0IGJ1aWxkIHRpbWUgYW55d2F5KVxuICAgICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBBcnJheTxhbnk+KCk7XG4gICAgICBjb25zdCByZXQgPSBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1hcHBlcih2YWx1ZVtpXSk7XG4gICAgICAgIHZhbHVlcy5wdXNoKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgIHJldC5hcHBlbmRFeHRyYVByb3BlcnRpZXMoYCR7aX1gLCByZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0TWFwPFQ+KG1hcHBlcjogKGFyZzogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8VD4pOiAoeDogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8eyBba2V5OiBzdHJpbmddOiBUIH0+IHtcbiAgICByZXR1cm4gKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIGlmIHRoZSBpbnB1dCBpcyBub3QgYSBtYXAgKD0gb2JqZWN0IGluIEpTIGxhbmQpLFxuICAgICAgICAvLyBqdXN0IHJldHVybiBpdCwgYW5kIGxldCB0aGUgdmFsaWRhdG9yIG9mIHRoaXMgcHJvcGVydHkgaGFuZGxlIGl0XG4gICAgICAgIC8vICh1bmxlc3MgaXQncyBhIGRlcGxveS10aW1lIHZhbHVlLFxuICAgICAgICAvLyB3aGljaCB3ZSBjYW4ndCBtYXAgb3ZlciBhdCBidWlsZCB0aW1lIGFueXdheSlcbiAgICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2YWx1ZXM6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG4gICAgICBjb25zdCByZXQgPSBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlcyk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1hcHBlcih2YWwpO1xuICAgICAgICB2YWx1ZXNba2V5XSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgcmV0LmFwcGVuZEV4dHJhUHJvcGVydGllcyhrZXksIHJlc3VsdC5leHRyYVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRDZm5UYWcodGFnOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuVGFnPiB7XG4gICAgcmV0dXJuIHRhZyA9PSBudWxsXG4gICAgICA/IG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQoeyB9IGFzIGFueSkgLy8gYnJlYWsgdGhlIHR5cGUgc3lzdGVtIC0gdGhpcyBzaG91bGQgYmUgZGV0ZWN0ZWQgYXQgcnVudGltZSBieSBhIHRhZyB2YWxpZGF0b3JcbiAgICAgIDogbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh7XG4gICAgICAgIGtleTogdGFnLktleSxcbiAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZSxcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gYXBwbGllZCB0byBhIHZhbHVlLCB3aWxsIHJldHVybiB0aGUgZmlyc3QgdmFsaWRseSBkZXNlcmlhbGl6ZWQgb25lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldFR5cGVVbmlvbih2YWxpZGF0b3JzOiBWYWxpZGF0b3JbXSwgbWFwcGVyczogQXJyYXk8KHg6IGFueSkgPT4gRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PGFueT4+KTpcbiAgKHg6IGFueSkgPT4gRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PGFueT4ge1xuICAgIHJldHVybiAodmFsdWU6IGFueSkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IG1hcHBlcnNbaV0odmFsdWUpO1xuICAgICAgICBpZiAodmFsaWRhdG9yc1tpXShjYW5kaWRhdGUudmFsdWUpLmlzU3VjY2Vzcykge1xuICAgICAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgbm90aGluZyBtYXRjaGVzLCBqdXN0IHJldHVybiB0aGUgaW5wdXQgdW5jaGFuZ2VkLCBhbmQgbGV0IHZhbGlkYXRvcnMgY2F0Y2ggaXRcbiAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQW4gaW50ZXJmYWNlIHRoYXQgcmVwcmVzZW50cyBjYWxsYmFja3MgaW50byBhIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICogVXNlZCBieSB0aGUgZnJvbUNsb3VkRm9ybWF0aW9uIG1ldGhvZHMgaW4gdGhlIGdlbmVyYXRlZCBMMSBjbGFzc2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDZm5GaW5kZXIge1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBDb25kaXRpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZSBmcm9tIHRoZSB0ZW1wbGF0ZS5cbiAgICogSWYgdGhlcmUgaXMgbm8gQ29uZGl0aW9uIHdpdGggdGhhdCBuYW1lIGluIHRoZSB0ZW1wbGF0ZSxcbiAgICogcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuICBmaW5kQ29uZGl0aW9uKGNvbmRpdGlvbk5hbWU6IHN0cmluZyk6IENmbkNvbmRpdGlvbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBNYXBwaW5nIHdpdGggdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgdGVtcGxhdGUuXG4gICAqIElmIHRoZXJlIGlzIG5vIE1hcHBpbmcgd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHRlbXBsYXRlLFxuICAgKiByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG4gIGZpbmRNYXBwaW5nKG1hcHBpbmdOYW1lOiBzdHJpbmcpOiBDZm5NYXBwaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlbGVtZW50IHJlZmVyZW5jZWQgdXNpbmcgYSBSZWYgZXhwcmVzc2lvbiB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKiBJZiB0aGVyZSBpcyBubyBlbGVtZW50IHdpdGggdGhpcyBuYW1lIGluIHRoZSB0ZW1wbGF0ZSxcbiAgICogcmV0dXJuIHVuZGVmaW5lZC5cbiAgICovXG4gIGZpbmRSZWZUYXJnZXQoZWxlbWVudE5hbWU6IHN0cmluZyk6IENmbkVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIGxvZ2ljYWwgSUQgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBJZiBhIHJlc291cmNlIHdpdGggdGhhdCBsb2dpY2FsIElEIHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlLFxuICAgKiByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG4gIGZpbmRSZXNvdXJjZShsb2dpY2FsSWQ6IHN0cmluZyk6IENmblJlc291cmNlIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFRoZSBpbnRlcmZhY2UgdXNlZCBhcyB0aGUgbGFzdCBhcmd1bWVudCB0byB0aGUgZnJvbUNsb3VkRm9ybWF0aW9uXG4gKiBzdGF0aWMgbWV0aG9kIG9mIHRoZSBnZW5lcmF0ZWQgTDEgY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXJzZXIgdXNlZCB0byBjb252ZXJ0IENsb3VkRm9ybWF0aW9uIHRvIHZhbHVlcyB0aGUgQ0RLIHVuZGVyc3RhbmRzLlxuICAgKi9cbiAgcmVhZG9ubHkgcGFyc2VyOiBDZm5QYXJzZXI7XG59XG5cbi8qKlxuICogVGhlIGNvbnRleHQgaW4gd2hpY2ggdGhlIHBhcnNpbmcgaXMgdGFraW5nIHBsYWNlLlxuICpcbiAqIFNvbWUgZnJhZ21lbnRzIG9mIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlcyBiZWhhdmUgZGlmZmVyZW50bHkgdGhhbiBvdGhlcnNcbiAqIChmb3IgZXhhbXBsZSwgdGhlICdDb25kaXRpb25zJyBzZWN0aW9ucyB0cmVhdHMgeyBcIkNvbmRpdGlvblwiOiBcIk5hbWVPZkNvbmRcIiB9XG4gKiBkaWZmZXJlbnRseSB0aGFuIHRoZSAnUmVzb3VyY2VzJyBzZWN0aW9uKS5cbiAqIFRoaXMgZW51bSBjYW4gYmUgdXNlZCB0byBjaGFuZ2UgdGhlIGNyZWF0ZWQgYENmblBhcnNlcmAgYmVoYXZpb3IsXG4gKiBiYXNlZCBvbiB0aGUgdGVtcGxhdGUgY29udGV4dC5cbiAqL1xuZXhwb3J0IGVudW0gQ2ZuUGFyc2luZ0NvbnRleHQge1xuICAvKiogV2UncmUgY3VycmVudGx5IHBhcnNpbmcgdGhlICdDb25kaXRpb25zJyBzZWN0aW9uLiAqL1xuICBDT05ESVRJT05TLFxuXG4gIC8qKiBXZSdyZSBjdXJyZW50bHkgcGFyc2luZyB0aGUgJ1J1bGVzJyBzZWN0aW9uLiAqL1xuICBSVUxFUyxcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyBmb3IgYEZyb21DbG91ZEZvcm1hdGlvbi5wYXJzZVZhbHVlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZUNmbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGZpbmRlciBpbnRlcmZhY2UgdXNlZCB0byByZXNvbHZlIHJlZmVyZW5jZXMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgZmluZGVyOiBJQ2ZuRmluZGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCB3ZSdyZSBwYXJzaW5nIHRoZSB0ZW1wbGF0ZSBpbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgZGVmYXVsdCBjb250ZXh0IChubyBzcGVjaWFsIGJlaGF2aW9yKVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGV4dD86IENmblBhcnNpbmdDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBWYWx1ZXMgcHJvdmlkZWQgaGVyZSB3aWxsIHJlcGxhY2UgcmVmZXJlbmNlcyB0byBwYXJhbWV0ZXJzIGluIHRoZSBwYXJzZWQgdGVtcGxhdGUuXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzOiB7IFtwYXJhbWV0ZXJOYW1lOiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnRhaW5zIG1ldGhvZHMgZm9yIHRyYW5zbGF0aW5nIGZyb20gYSBwdXJlIENGTiB2YWx1ZVxuICogKGxpa2UgYSBKUyBvYmplY3QgeyBcIlJlZlwiOiBcIkJ1Y2tldFwiIH0pXG4gKiB0byBhIGZvcm0gQ0RLIHVuZGVyc3RhbmRzXG4gKiAobGlrZSBGbi5yZWYoJ0J1Y2tldCcpKS5cbiAqXG4gKiBXaGlsZSB0aGlzIGZpbGUgbm90IGV4cG9ydGVkIGZyb20gdGhlIG1vZHVsZVxuICogKHRvIG5vdCBtYWtlIGl0IHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkpLFxuICogaXQgaXMgZGlyZWN0bHkgcmVmZXJlbmNlZCBpbiB0aGUgZ2VuZXJhdGVkIEwxIGNvZGUsXG4gKiBzbyBhbnkgcmVuYW1lcyBvZiBpdCBuZWVkIHRvIGJlIHJlZmxlY3RlZCBpbiBjZm4ydHMvY29kZWdlbi50cyBhcyB3ZWxsLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENmblBhcnNlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogUGFyc2VDZm5PcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBhcnNlQ2ZuT3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQXR0cmlidXRlcyhyZXNvdXJjZTogQ2ZuUmVzb3VyY2UsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBsb2dpY2FsSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGNmbk9wdGlvbnMgPSByZXNvdXJjZS5jZm5PcHRpb25zO1xuXG4gICAgY2ZuT3B0aW9ucy5jcmVhdGlvblBvbGljeSA9IHRoaXMucGFyc2VDcmVhdGlvblBvbGljeShyZXNvdXJjZUF0dHJpYnV0ZXMuQ3JlYXRpb25Qb2xpY3kpO1xuICAgIGNmbk9wdGlvbnMudXBkYXRlUG9saWN5ID0gdGhpcy5wYXJzZVVwZGF0ZVBvbGljeShyZXNvdXJjZUF0dHJpYnV0ZXMuVXBkYXRlUG9saWN5KTtcbiAgICBjZm5PcHRpb25zLmRlbGV0aW9uUG9saWN5ID0gdGhpcy5wYXJzZURlbGV0aW9uUG9saWN5KHJlc291cmNlQXR0cmlidXRlcy5EZWxldGlvblBvbGljeSk7XG4gICAgY2ZuT3B0aW9ucy51cGRhdGVSZXBsYWNlUG9saWN5ID0gdGhpcy5wYXJzZURlbGV0aW9uUG9saWN5KHJlc291cmNlQXR0cmlidXRlcy5VcGRhdGVSZXBsYWNlUG9saWN5KTtcbiAgICBjZm5PcHRpb25zLnZlcnNpb24gPSB0aGlzLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlZlcnNpb24pO1xuICAgIGNmbk9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLkRlc2NyaXB0aW9uKTtcbiAgICBjZm5PcHRpb25zLm1ldGFkYXRhID0gdGhpcy5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5NZXRhZGF0YSk7XG5cbiAgICAvLyBoYW5kbGUgQ29uZGl0aW9uXG4gICAgaWYgKHJlc291cmNlQXR0cmlidXRlcy5Db25kaXRpb24pIHtcbiAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuZmluZGVyLmZpbmRDb25kaXRpb24ocmVzb3VyY2VBdHRyaWJ1dGVzLkNvbmRpdGlvbik7XG4gICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc291cmNlICcke2xvZ2ljYWxJZH0nIHVzZXMgQ29uZGl0aW9uICcke3Jlc291cmNlQXR0cmlidXRlcy5Db25kaXRpb259JyB0aGF0IGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgIH1cbiAgICAgIGNmbk9wdGlvbnMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSBEZXBlbmRzT25cbiAgICByZXNvdXJjZUF0dHJpYnV0ZXMuRGVwZW5kc09uID0gcmVzb3VyY2VBdHRyaWJ1dGVzLkRlcGVuZHNPbiA/PyBbXTtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gQXJyYXkuaXNBcnJheShyZXNvdXJjZUF0dHJpYnV0ZXMuRGVwZW5kc09uKSA/XG4gICAgICByZXNvdXJjZUF0dHJpYnV0ZXMuRGVwZW5kc09uIDogW3Jlc291cmNlQXR0cmlidXRlcy5EZXBlbmRzT25dO1xuICAgIGZvciAoY29uc3QgZGVwIG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgY29uc3QgZGVwUmVzb3VyY2UgPSB0aGlzLmZpbmRlci5maW5kUmVzb3VyY2UoZGVwKTtcbiAgICAgIGlmICghZGVwUmVzb3VyY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSAnJHtsb2dpY2FsSWR9JyBkZXBlbmRzIG9uICcke2RlcH0nIHRoYXQgZG9lc24ndCBleGlzdGApO1xuICAgICAgfVxuICAgICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGRlcFJlc291cmNlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQ3JlYXRpb25Qb2xpY3kocG9saWN5OiBhbnkpOiBDZm5DcmVhdGlvblBvbGljeSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHR5cGVvZiBwb2xpY3kgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgIC8vIGNoYW5nZSBzaW1wbGUgSlMgdmFsdWVzIHRvIHRoZWlyIENESyBlcXVpdmFsZW50c1xuICAgIHBvbGljeSA9IHRoaXMucGFyc2VWYWx1ZShwb2xpY3kpO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgYXV0b1NjYWxpbmdDcmVhdGlvblBvbGljeTogcGFyc2VBdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5KHBvbGljeS5BdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5KSxcbiAgICAgIHJlc291cmNlU2lnbmFsOiBwYXJzZVJlc291cmNlU2lnbmFsKHBvbGljeS5SZXNvdXJjZVNpZ25hbCksXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3kocDogYW55KTogQ2ZuUmVzb3VyY2VBdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5IHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHAuTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQpLnZhbHVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VSZXNvdXJjZVNpZ25hbChwOiBhbnkpOiBDZm5SZXNvdXJjZVNpZ25hbCB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBjb3VudDogRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwLkNvdW50KS52YWx1ZSxcbiAgICAgICAgdGltZW91dDogRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwLlRpbWVvdXQpLnZhbHVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVVwZGF0ZVBvbGljeShwb2xpY3k6IGFueSk6IENmblVwZGF0ZVBvbGljeSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHR5cGVvZiBwb2xpY3kgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgIC8vIGNoYW5nZSBzaW1wbGUgSlMgdmFsdWVzIHRvIHRoZWlyIENESyBlcXVpdmFsZW50c1xuICAgIHBvbGljeSA9IHRoaXMucGFyc2VWYWx1ZShwb2xpY3kpO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgYXV0b1NjYWxpbmdSZXBsYWNpbmdVcGRhdGU6IHBhcnNlQXV0b1NjYWxpbmdSZXBsYWNpbmdVcGRhdGUocG9saWN5LkF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlKSxcbiAgICAgIGF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZTogcGFyc2VBdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGUocG9saWN5LkF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZSksXG4gICAgICBhdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbjogcGFyc2VBdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbihwb2xpY3kuQXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb24pLFxuICAgICAgY29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlOiBwYXJzZUNvZGVEZXBsb3lMYW1iZGFBbGlhc1VwZGF0ZShwb2xpY3kuQ29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlKSxcbiAgICAgIGVuYWJsZVZlcnNpb25VcGdyYWRlOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Qm9vbGVhbihwb2xpY3kuRW5hYmxlVmVyc2lvblVwZ3JhZGUpLnZhbHVlLFxuICAgICAgdXNlT25saW5lUmVzaGFyZGluZzogRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocG9saWN5LlVzZU9ubGluZVJlc2hhcmRpbmcpLnZhbHVlLFxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VBdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZShwOiBhbnkpOiBDZm5BdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZSB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICB3aWxsUmVwbGFjZTogcC5XaWxsUmVwbGFjZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlKHA6IGFueSk6IENmbkF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZSB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBtYXhCYXRjaFNpemU6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXROdW1iZXIocC5NYXhCYXRjaFNpemUpLnZhbHVlLFxuICAgICAgICBtaW5JbnN0YW5jZXNJblNlcnZpY2U6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXROdW1iZXIocC5NaW5JbnN0YW5jZXNJblNlcnZpY2UpLnZhbHVlLFxuICAgICAgICBtaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudDogRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwLk1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50KS52YWx1ZSxcbiAgICAgICAgcGF1c2VUaW1lOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHAuUGF1c2VUaW1lKS52YWx1ZSxcbiAgICAgICAgc3VzcGVuZFByb2Nlc3NlczogRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHAuU3VzcGVuZFByb2Nlc3NlcykudmFsdWUsXG4gICAgICAgIHdhaXRPblJlc291cmNlU2lnbmFsczogRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocC5XYWl0T25SZXNvdXJjZVNpZ25hbHMpLnZhbHVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VDb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGUocDogYW55KTogQ2ZuQ29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBiZWZvcmVBbGxvd1RyYWZmaWNIb29rOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHAuQmVmb3JlQWxsb3dUcmFmZmljSG9vaykudmFsdWUsXG4gICAgICAgIGFmdGVyQWxsb3dUcmFmZmljSG9vazogRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwLkFmdGVyQWxsb3dUcmFmZmljSG9vaykudmFsdWUsXG4gICAgICAgIGFwcGxpY2F0aW9uTmFtZTogRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwLkFwcGxpY2F0aW9uTmFtZSkudmFsdWUsXG4gICAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocC5EZXBsb3ltZW50R3JvdXBOYW1lKS52YWx1ZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VBdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbihwOiBhbnkpOiBDZm5BdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICdvYmplY3QnKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBpZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllczogRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocC5JZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllcykudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRGVsZXRpb25Qb2xpY3kocG9saWN5OiBhbnkpOiBDZm5EZWxldGlvblBvbGljeSB8IHVuZGVmaW5lZCB7XG4gICAgc3dpdGNoIChwb2xpY3kpIHtcbiAgICAgIGNhc2UgbnVsbDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgY2FzZSAnRGVsZXRlJzogcmV0dXJuIENmbkRlbGV0aW9uUG9saWN5LkRFTEVURTtcbiAgICAgIGNhc2UgJ1JldGFpbic6IHJldHVybiBDZm5EZWxldGlvblBvbGljeS5SRVRBSU47XG4gICAgICBjYXNlICdTbmFwc2hvdCc6IHJldHVybiBDZm5EZWxldGlvblBvbGljeS5TTkFQU0hPVDtcbiAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIERlbGV0aW9uUG9saWN5ICcke3BvbGljeX0nYCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlVmFsdWUoY2ZuVmFsdWU6IGFueSk6IGFueSB7XG4gICAgLy8gPT0gbnVsbCBjYXB0dXJlcyB1bmRlZmluZWQgYXMgd2VsbFxuICAgIGlmIChjZm5WYWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBoYXZlIGFueSBsYXRlLWJvdW5kIHZhbHVlcyxcbiAgICAvLyBqdXN0IHJldHVybiB0aGVtXG4gICAgaWYgKGlzUmVzb2x2YWJsZU9iamVjdChjZm5WYWx1ZSkpIHtcbiAgICAgIHJldHVybiBjZm5WYWx1ZTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2ZuVmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2ZuVmFsdWUubWFwKGVsID0+IHRoaXMucGFyc2VWYWx1ZShlbCkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNmblZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gYW4gb2JqZWN0IGNhbiBiZSBlaXRoZXIgYSBDRk4gaW50cmluc2ljLCBvciBhbiBhY3R1YWwgb2JqZWN0XG4gICAgICBjb25zdCBjZm5JbnRyaW5zaWMgPSB0aGlzLnBhcnNlSWZDZm5JbnRyaW5zaWMoY2ZuVmFsdWUpO1xuICAgICAgaWYgKGNmbkludHJpbnNpYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBjZm5JbnRyaW5zaWM7XG4gICAgICB9XG4gICAgICBjb25zdCByZXQ6IGFueSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKGNmblZhbHVlKSkge1xuICAgICAgICByZXRba2V5XSA9IHRoaXMucGFyc2VWYWx1ZSh2YWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLy8gaW4gYWxsIG90aGVyIGNhc2VzLCBqdXN0IHJldHVybiB0aGUgaW5wdXRcbiAgICByZXR1cm4gY2ZuVmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGZpbmRlcigpOiBJQ2ZuRmluZGVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbmRlcjtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VJZkNmbkludHJpbnNpYyhvYmplY3Q6IGFueSk6IGFueSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5sb29rc0xpa2VDZm5JbnRyaW5zaWMob2JqZWN0KTtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBjYXNlICdSZWYnOiB7XG4gICAgICAgIGNvbnN0IHJlZlRhcmdldCA9IG9iamVjdFtrZXldO1xuICAgICAgICBjb25zdCBzcGVjaWFsUmVmID0gdGhpcy5zcGVjaWFsQ2FzZVJlZnMocmVmVGFyZ2V0KTtcbiAgICAgICAgaWYgKHNwZWNpYWxSZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBzcGVjaWFsUmVmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlZkVsZW1lbnQgPSB0aGlzLmZpbmRlci5maW5kUmVmVGFyZ2V0KHJlZlRhcmdldCk7XG4gICAgICAgICAgaWYgKCFyZWZFbGVtZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgdXNlZCBpbiBSZWYgZXhwcmVzc2lvbiB3aXRoIGxvZ2ljYWwgSUQ6ICcke3JlZlRhcmdldH0nIG5vdCBmb3VuZGApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gQ2ZuUmVmZXJlbmNlLmZvcihyZWZFbGVtZW50LCAnUmVmJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpHZXRBdHQnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgIGxldCBsb2dpY2FsSWQ6IHN0cmluZywgYXR0cmlidXRlTmFtZTogc3RyaW5nLCBzdHJpbmdGb3JtOiBib29sZWFuO1xuICAgICAgICAvLyBGbjo6R2V0QXR0IHRha2VzIGFzIGFyZ3VtZW50cyBlaXRoZXIgYSBzdHJpbmcuLi5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyAuLi5pbiB3aGljaCBjYXNlIHRoZSBsb2dpY2FsIElEIGFuZCB0aGUgYXR0cmlidXRlIG5hbWUgYXJlIHNlcGFyYXRlZCB3aXRoICcuJ1xuICAgICAgICAgIGNvbnN0IGRvdEluZGV4ID0gdmFsdWUuaW5kZXhPZignLicpO1xuICAgICAgICAgIGlmIChkb3RJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU2hvcnQtZm9ybSBGbjo6R2V0QXR0IG11c3QgY29udGFpbiBhICcuJyBpbiBpdHMgc3RyaW5nIGFyZ3VtZW50LCBnb3Q6ICcke3ZhbHVlfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9naWNhbElkID0gdmFsdWUuc2xpY2UoMCwgZG90SW5kZXgpO1xuICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSB2YWx1ZS5zbGljZShkb3RJbmRleCArIDEpOyAvLyB0aGUgKzEgaXMgdG8gc2tpcCB0aGUgYWN0dWFsICcuJ1xuICAgICAgICAgIHN0cmluZ0Zvcm0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIC4uLm9yIGEgMi1lbGVtZW50IGxpc3RcbiAgICAgICAgICBsb2dpY2FsSWQgPSB2YWx1ZVswXTtcbiAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gdmFsdWVbMV07XG4gICAgICAgICAgc3RyaW5nRm9ybSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZmluZGVyLmZpbmRSZXNvdXJjZShsb2dpY2FsSWQpO1xuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb3VyY2UgdXNlZCBpbiBHZXRBdHQgZXhwcmVzc2lvbiB3aXRoIGxvZ2ljYWwgSUQ6ICcke2xvZ2ljYWxJZH0nIG5vdCBmb3VuZGApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDZm5SZWZlcmVuY2UuZm9yKHRhcmdldCwgYXR0cmlidXRlTmFtZSwgc3RyaW5nRm9ybSA/IFJlZmVyZW5jZVJlbmRlcmluZy5HRVRfQVRUX1NUUklORyA6IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6Sm9pbic6IHtcbiAgICAgICAgLy8gRm46OkpvaW4gdGFrZXMgYSAyLWVsZW1lbnQgbGlzdCBhcyBpdHMgYXJndW1lbnQsXG4gICAgICAgIC8vIHdoZXJlIHRoZSBmaXJzdCBlbGVtZW50IGlzIHRoZSBkZWxpbWl0ZXIsXG4gICAgICAgIC8vIGFuZCB0aGUgc2Vjb25kIGlzIHRoZSBsaXN0IG9mIGVsZW1lbnRzIHRvIGpvaW5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICAvLyB3cmFwIHRoZSBhcnJheSBhcyBhIFRva2VuLFxuICAgICAgICAvLyBhcyBvdGhlcndpc2UgRm4uam9pbigpIHdpbGwgdHJ5IHRvIGNvbmNhdGVuYXRlXG4gICAgICAgIC8vIHRoZSBub24tdG9rZW4gcGFydHMsXG4gICAgICAgIC8vIGNhdXNpbmcgYSBkaWZmIHdpdGggdGhlIG9yaWdpbmFsIHRlbXBsYXRlXG4gICAgICAgIHJldHVybiBGbi5qb2luKHZhbHVlWzBdLCBMYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiB2YWx1ZVsxXSB9KSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6Q2lkcic6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uY2lkcih2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpGaW5kSW5NYXAnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgLy8gdGhlIGZpcnN0IGFyZ3VtZW50IHRvIEZpbmRJbk1hcCBpcyB0aGUgbWFwcGluZyBuYW1lXG4gICAgICAgIGxldCBtYXBwaW5nTmFtZTogc3RyaW5nO1xuICAgICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHZhbHVlWzBdKSkge1xuICAgICAgICAgIC8vIHRoZSBmaXJzdCBhcmd1bWVudCBjYW4gYmUgYSBkeW5hbWljIGV4cHJlc3Npb24gbGlrZSBSZWY6IFBhcmFtO1xuICAgICAgICAgIC8vIGlmIGl0IGlzLCB3ZSBjYW4ndCBmaW5kIHRoZSBtYXBwaW5nIGluIGFkdmFuY2VcbiAgICAgICAgICBtYXBwaW5nTmFtZSA9IHZhbHVlWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG1hcHBpbmcgPSB0aGlzLmZpbmRlci5maW5kTWFwcGluZyh2YWx1ZVswXSk7XG4gICAgICAgICAgaWYgKCFtYXBwaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcHBpbmcgdXNlZCBpbiBGaW5kSW5NYXAgZXhwcmVzc2lvbiB3aXRoIG5hbWUgJyR7dmFsdWVbMF19JyB3YXMgbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXBwaW5nTmFtZSA9IG1hcHBpbmcubG9naWNhbElkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGbi5fZmluZEluTWFwKG1hcHBpbmdOYW1lLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OlNlbGVjdCc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uc2VsZWN0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6R2V0QVpzJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5nZXRBenModmFsdWUpO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OkltcG9ydFZhbHVlJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5pbXBvcnRWYWx1ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6U3BsaXQnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLnNwbGl0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6VHJhbnNmb3JtJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi50cmFuc2Zvcm0odmFsdWUuTmFtZSwgdmFsdWUuUGFyYW1ldGVycyk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6QmFzZTY0Jzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5iYXNlNjQodmFsdWUpO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OklmJzoge1xuICAgICAgICAvLyBGbjo6SWYgdGFrZXMgYSAzLWVsZW1lbnQgbGlzdCBhcyBpdHMgYXJndW1lbnQsXG4gICAgICAgIC8vIHdoZXJlIHRoZSBmaXJzdCBlbGVtZW50IGlzIHRoZSBuYW1lIG9mIGEgQ29uZGl0aW9uXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5maW5kZXIuZmluZENvbmRpdGlvbih2YWx1ZVswXSk7XG4gICAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb25kaXRpb24gJyR7dmFsdWVbMF19JyB1c2VkIGluIGFuIEZuOjpJZiBleHByZXNzaW9uIGRvZXMgbm90IGV4aXN0IGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGbi5jb25kaXRpb25JZihjb25kaXRpb24ubG9naWNhbElkLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OkVxdWFscyc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uY29uZGl0aW9uRXF1YWxzKHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6QW5kJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5jb25kaXRpb25BbmQoLi4udmFsdWUpO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46Ok5vdCc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uY29uZGl0aW9uTm90KHZhbHVlWzBdKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpPcic6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uY29uZGl0aW9uT3IoLi4udmFsdWUpO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OlN1Yic6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICBsZXQgZm5TdWJTdHJpbmc6IHN0cmluZztcbiAgICAgICAgbGV0IG1hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBmblN1YlN0cmluZyA9IHZhbHVlO1xuICAgICAgICAgIG1hcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmblN1YlN0cmluZyA9IHZhbHVlWzBdO1xuICAgICAgICAgIG1hcCA9IHZhbHVlWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGblN1YlN0cmluZyhmblN1YlN0cmluZywgbWFwKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgLy8gYSByZWZlcmVuY2UgdG8gYSBDb25kaXRpb24gZnJvbSBhbm90aGVyIENvbmRpdGlvblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmZpbmRlci5maW5kQ29uZGl0aW9uKG9iamVjdFtrZXldKTtcbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlZmVyZW5jZWQgQ29uZGl0aW9uIHdpdGggbmFtZSAnJHtvYmplY3Rba2V5XX0nIHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgQ29uZGl0aW9uOiBjb25kaXRpb24ubG9naWNhbElkIH07XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRleHQgPT09IENmblBhcnNpbmdDb250ZXh0LlJVTEVTKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUnVsZXNJbnRyaW5zaWMoa2V5LCBvYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgQ2xvdWRGb3JtYXRpb24gZnVuY3Rpb24gJyR7a2V5fSdgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9va3NMaWtlQ2ZuSW50cmluc2ljKG9iamVjdDogb2JqZWN0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAvLyBhIENGTiBpbnRyaW5zaWMgaXMgYWx3YXlzIGFuIG9iamVjdCB3aXRoIGEgc2luZ2xlIGtleVxuICAgIGlmIChvYmplY3RLZXlzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBvYmplY3RLZXlzWzBdO1xuICAgIHJldHVybiBrZXkgPT09ICdSZWYnIHx8IGtleS5zdGFydHNXaXRoKCdGbjo6JykgfHxcbiAgICAgICAgLy8gc3BlY2lhbCBpbnRyaW5zaWMgb25seSBhdmFpbGFibGUgaW4gdGhlICdDb25kaXRpb25zJyBzZWN0aW9uXG4gICAgICAgICh0aGlzLm9wdGlvbnMuY29udGV4dCA9PT0gQ2ZuUGFyc2luZ0NvbnRleHQuQ09ORElUSU9OUyAmJiBrZXkgPT09ICdDb25kaXRpb24nKVxuICAgICAgPyBrZXlcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUZuU3ViU3RyaW5nKHRlbXBsYXRlU3RyaW5nOiBzdHJpbmcsIGV4cHJlc3Npb25NYXA6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgIGNvbnN0IG1hcCA9IGV4cHJlc3Npb25NYXAgPz8ge307XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIEZuLnN1Yihnbyh0ZW1wbGF0ZVN0cmluZyksIE9iamVjdC5rZXlzKG1hcCkubGVuZ3RoID09PSAwID8gZXhwcmVzc2lvbk1hcCA6IG1hcCk7XG5cbiAgICBmdW5jdGlvbiBnbyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGxlZnRCcmFjZSA9IHZhbHVlLmluZGV4T2YoJyR7Jyk7XG4gICAgICBpZiAobGVmdEJyYWNlID09PSAtMSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICAvLyBzZWFyY2ggZm9yIHRoZSBjbG9zaW5nIGJyYWNlIHRvIHRoZSByaWdodCBvZiB0aGUgb3BlbmluZyAnJHsnXG4gICAgICAvLyAoaW4gdGhlb3J5LCB0aGVyZSBjb3VsZCBiZSBvdGhlciBicmFjZXMgaW4gdGhlIHN0cmluZyxcbiAgICAgIC8vIGZvciBleGFtcGxlIGlmIGl0IHJlcHJlc2VudHMgYSBKU09OIG9iamVjdClcbiAgICAgIGNvbnN0IHJpZ2h0QnJhY2UgPSB2YWx1ZS5pbmRleE9mKCd9JywgbGVmdEJyYWNlKTtcbiAgICAgIGlmIChyaWdodEJyYWNlID09PSAtMSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxlZnRIYWxmID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlZnRCcmFjZSk7XG4gICAgICBjb25zdCByaWdodEhhbGYgPSB2YWx1ZS5zdWJzdHJpbmcocmlnaHRCcmFjZSArIDEpO1xuICAgICAgLy8gZG9uJ3QgaW5jbHVkZSBsZWZ0IGFuZCByaWdodCBicmFjZXMgd2hlbiBzZWFyY2hpbmcgZm9yIHRoZSB0YXJnZXQgb2YgdGhlIHJlZmVyZW5jZVxuICAgICAgY29uc3QgcmVmVGFyZ2V0ID0gdmFsdWUuc3Vic3RyaW5nKGxlZnRCcmFjZSArIDIsIHJpZ2h0QnJhY2UpLnRyaW0oKTtcbiAgICAgIGlmIChyZWZUYXJnZXRbMF0gPT09ICchJykge1xuICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKDAsIHJpZ2h0QnJhY2UgKyAxKSArIGdvKHJpZ2h0SGFsZik7XG4gICAgICB9XG5cbiAgICAgIC8vIGxvb2t1cCBpbiBtYXBcbiAgICAgIGlmIChyZWZUYXJnZXQgaW4gbWFwKSB7XG4gICAgICAgIHJldHVybiBsZWZ0SGFsZiArICckeycgKyByZWZUYXJnZXQgKyAnfScgKyBnbyhyaWdodEhhbGYpO1xuICAgICAgfVxuXG4gICAgICAvLyBzaW5jZSBpdCdzIG5vdCBpbiB0aGUgbWFwLCBjaGVjayBpZiBpdCdzIGEgcHNldWRvLXBhcmFtZXRlclxuICAgICAgLy8gKG9yIGEgdmFsdWUgdG8gYmUgc3Vic3RpdHV0ZWQgZm9yIGEgUGFyYW1ldGVyLCBwcm92aWRlZCBieSB0aGUgY3VzdG9tZXIpXG4gICAgICBjb25zdCBzcGVjaWFsUmVmID0gc2VsZi5zcGVjaWFsQ2FzZVN1YlJlZnMocmVmVGFyZ2V0KTtcbiAgICAgIGlmIChzcGVjaWFsUmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzcGVjaWFsUmVmKSkge1xuICAgICAgICAgIC8vIHNwZWNpYWxSZWYgY2FuIG9ubHkgYmUgYSBUb2tlbiBpZiB0aGUgdmFsdWUgcGFzc2VkIGJ5IHRoZSBjdXN0b21lclxuICAgICAgICAgIC8vIGZvciBzdWJzdGl0dXRpbmcgYSBQYXJhbWV0ZXIgd2FzIGEgVG9rZW4uXG4gICAgICAgICAgLy8gVGhpcyBpcyBhY3R1YWxseSBiYWQgaGVyZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBUb2tlbiBjYW4gcG90ZW50aWFsbHkgYmUgc29tZXRoaW5nIHRoYXQgZG9lc24ndCByZW5kZXJcbiAgICAgICAgICAvLyB3ZWxsIGluc2lkZSBhbiBGbjo6U3ViIHRlbXBsYXRlIHN0cmluZywgbGlrZSBhIHsgUmVmIH0gb2JqZWN0LlxuICAgICAgICAgIC8vIFRvIGhhbmRsZSB0aGlzIGNhc2UsXG4gICAgICAgICAgLy8gaW5zdGVhZCBvZiBzdWJzdGl0dXRpbmcgdGhlIFBhcmFtZXRlciBkaXJlY3RseSB3aXRoIHRoZSB0b2tlbiBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLFxuICAgICAgICAgIC8vIGFkZCBhIG5ldyBlbnRyeSB0byB0aGUgRm46OlN1YiBtYXAsXG4gICAgICAgICAgLy8gd2l0aCBrZXkgcmVmVGFyZ2V0LCBhbmQgdGhlIHRva2VuIGFzIHRoZSB2YWx1ZS5cbiAgICAgICAgICAvLyBUaGlzIGlzIHNhZmUsIGJlY2F1c2UgdGhpcyBzb3J0IG9mIHNoYWRvd2luZyBpcyBsZWdhbCBpbiBDbG91ZEZvcm1hdGlvbixcbiAgICAgICAgICAvLyBhbmQgYWxzbyBiZWNhdXNlIHdlJ3JlIGNlcnRhaW4gdGhlIEZuOjpTdWIgbWFwIGRvZXNuJ3QgY29udGFpbiBhbiBlbnRyeSBmb3IgcmVmVGFyZ2V0XG4gICAgICAgICAgLy8gKGFzIHdlIGNoZWNrIHRoYXQgY29uZGl0aW9uIGluIHRoZSBjb2RlIHJpZ2h0IGFib3ZlIHRoaXMpLlxuICAgICAgICAgIG1hcFtyZWZUYXJnZXRdID0gc3BlY2lhbFJlZjtcbiAgICAgICAgICByZXR1cm4gbGVmdEhhbGYgKyAnJHsnICsgcmVmVGFyZ2V0ICsgJ30nICsgZ28ocmlnaHRIYWxmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGVmdEhhbGYgKyBzcGVjaWFsUmVmICsgZ28ocmlnaHRIYWxmKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkb3RJbmRleCA9IHJlZlRhcmdldC5pbmRleE9mKCcuJyk7XG4gICAgICBjb25zdCBpc1JlZiA9IGRvdEluZGV4ID09PSAtMTtcbiAgICAgIGlmIChpc1JlZikge1xuICAgICAgICBjb25zdCByZWZFbGVtZW50ID0gc2VsZi5maW5kZXIuZmluZFJlZlRhcmdldChyZWZUYXJnZXQpO1xuICAgICAgICBpZiAoIXJlZkVsZW1lbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgcmVmZXJlbmNlZCBpbiBGbjo6U3ViIGV4cHJlc3Npb24gd2l0aCBsb2dpY2FsIElEOiAnJHtyZWZUYXJnZXR9JyB3YXMgbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZWZ0SGFsZiArIENmblJlZmVyZW5jZS5mb3IocmVmRWxlbWVudCwgJ1JlZicsIFJlZmVyZW5jZVJlbmRlcmluZy5GTl9TVUIpLnRvU3RyaW5nKCkgKyBnbyhyaWdodEhhbGYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSByZWZUYXJnZXQuc3Vic3RyaW5nKDAsIGRvdEluZGV4KTtcbiAgICAgICAgY29uc3QgcmVmUmVzb3VyY2UgPSBzZWxmLmZpbmRlci5maW5kUmVzb3VyY2UodGFyZ2V0SWQpO1xuICAgICAgICBpZiAoIXJlZlJlc291cmNlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSByZWZlcmVuY2VkIGluIEZuOjpTdWIgZXhwcmVzc2lvbiB3aXRoIGxvZ2ljYWwgSUQ6ICcke3RhcmdldElkfScgd2FzIG5vdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGVgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSByZWZUYXJnZXQuc3Vic3RyaW5nKGRvdEluZGV4ICsgMSk7XG4gICAgICAgIHJldHVybiBsZWZ0SGFsZiArIENmblJlZmVyZW5jZS5mb3IocmVmUmVzb3VyY2UsIGF0dHJpYnV0ZSwgUmVmZXJlbmNlUmVuZGVyaW5nLkZOX1NVQikudG9TdHJpbmcoKSArIGdvKHJpZ2h0SGFsZik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVSdWxlc0ludHJpbnNpYyhrZXk6IHN0cmluZywgb2JqZWN0OiBhbnkpOiBhbnkge1xuICAgIC8vIFJ1bGVzIGhhdmUgdGhlaXIgb3duIHNldCBvZiBpbnRyaW5zaWNzOlxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZXJ2aWNlY2F0YWxvZy9sYXRlc3QvYWRtaW5ndWlkZS9pbnRyaW5zaWMtZnVuY3Rpb24tcmVmZXJlbmNlLXJ1bGVzLmh0bWxcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAnRm46OlZhbHVlT2YnOiB7XG4gICAgICAgIC8vIFZhbHVlT2YgaXMgc3BlY2lhbCxcbiAgICAgICAgLy8gYXMgaXQgdGFrZXMgdGhlIG5hbWUgb2YgYSBQYXJhbWV0ZXIgYXMgaXRzIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyTmFtZSA9IHZhbHVlWzBdO1xuICAgICAgICBpZiAocGFyYW1ldGVyTmFtZSBpbiB0aGlzLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAvLyBzaW5jZSBWYWx1ZU9mIHJldHVybnMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWMgYXR0cmlidXRlLFxuICAgICAgICAgIC8vIGZhaWwgaGVyZSAtIHRoaXMgc3Vic3RpdHV0aW9uIGlzIG5vdCBhbGxvd2VkXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc3Vic3RpdHV0ZSBwYXJhbWV0ZXIgJyR7cGFyYW1ldGVyTmFtZX0nIHVzZWQgaW4gRm46OlZhbHVlT2YgZXhwcmVzc2lvbiB3aXRoIGF0dHJpYnV0ZSAnJHt2YWx1ZVsxXX0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmZpbmRlci5maW5kUmVmVGFyZ2V0KHBhcmFtZXRlck5hbWUpO1xuICAgICAgICBpZiAoIXBhcmFtKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSdWxlIHJlZmVyZW5jZXMgcGFyYW1ldGVyICcke3BhcmFtZXRlck5hbWV9JyB3aGljaCB3YXMgbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBleHBsaWNpdCBJUmVzb2x2YWJsZSxcbiAgICAgICAgLy8gYXMgRm4udmFsdWVPZigpIHJldHVybnMgYSBzdHJpbmcsXG4gICAgICAgIC8vIHdoaWNoIGlzIGluY29ycmVjdFxuICAgICAgICAvLyAoRm46OlZhbHVlT2YgY2FuIGFsc28gcmV0dXJuIGFuIGFycmF5KVxuICAgICAgICByZXR1cm4gTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiAoeyAnRm46OlZhbHVlT2YnOiBbcGFyYW0ubG9naWNhbElkLCB2YWx1ZVsxXV0gfSkgfSk7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBJIGRvbid0IHdhbnQgdG8gaGFyZC1jb2RlIHRoZSBsaXN0IG9mIHN1cHBvcnRlZCBSdWxlcy1zcGVjaWZpYyBpbnRyaW5zaWNzIGluIHRoaXMgZnVuY3Rpb247XG4gICAgICAgIC8vIHNvLCBqdXN0IHJldHVybiB1bmRlZmluZWQgaGVyZSxcbiAgICAgICAgLy8gYW5kIHRoZXkgd2lsbCBiZSB0cmVhdGVkIGFzIGEgcmVndWxhciBKU09OIG9iamVjdFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3BlY2lhbENhc2VSZWZzKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGlmICh2YWx1ZSBpbiB0aGlzLnBhcmFtZXRlcnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnNbdmFsdWVdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdBV1M6OkFjY291bnRJZCc6IHJldHVybiBBd3MuQUNDT1VOVF9JRDtcbiAgICAgIGNhc2UgJ0FXUzo6UmVnaW9uJzogcmV0dXJuIEF3cy5SRUdJT047XG4gICAgICBjYXNlICdBV1M6OlBhcnRpdGlvbic6IHJldHVybiBBd3MuUEFSVElUSU9OO1xuICAgICAgY2FzZSAnQVdTOjpVUkxTdWZmaXgnOiByZXR1cm4gQXdzLlVSTF9TVUZGSVg7XG4gICAgICBjYXNlICdBV1M6Ok5vdGlmaWNhdGlvbkFSTnMnOiByZXR1cm4gQXdzLk5PVElGSUNBVElPTl9BUk5TO1xuICAgICAgY2FzZSAnQVdTOjpTdGFja0lkJzogcmV0dXJuIEF3cy5TVEFDS19JRDtcbiAgICAgIGNhc2UgJ0FXUzo6U3RhY2tOYW1lJzogcmV0dXJuIEF3cy5TVEFDS19OQU1FO1xuICAgICAgY2FzZSAnQVdTOjpOb1ZhbHVlJzogcmV0dXJuIEF3cy5OT19WQUxVRTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzcGVjaWFsQ2FzZVN1YlJlZnModmFsdWU6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHZhbHVlIGluIHRoaXMucGFyYW1ldGVycykge1xuICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVyc1t2YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKCc6OicpID09PSAtMSA/IHVuZGVmaW5lZDogJyR7JyArIHZhbHVlICsgJ30nO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgcGFyYW1ldGVycygpOiB7IFtwYXJhbWV0ZXJOYW1lOiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wYXJhbWV0ZXJzIHx8IHt9O1xuICB9XG59XG4iXX0=