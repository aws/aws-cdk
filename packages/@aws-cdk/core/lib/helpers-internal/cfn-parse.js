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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXBhcnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNDQUErQjtBQUUvQiw4Q0FBb0M7QUFFcEMsZ0VBR2dDO0FBRWhDLGtDQUErQjtBQUMvQiw0REFBNEU7QUFHNUUsb0NBQXFEO0FBQ3JELGtDQUF1RDtBQUV2RDs7Ozs7O0dBTUc7QUFDSCxNQUFhLHdCQUF3QjtJQUluQyxZQUFtQixLQUFRO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTSxxQkFBcUIsQ0FBQyxNQUFjLEVBQUUsVUFBOEM7UUFDekYsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ3pELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDaEQ7SUFDSCxDQUFDO0NBQ0Y7QUFkRCw0REFjQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxnQ0FBZ0UsU0FBUSx3QkFBMkI7SUFHOUc7UUFDRSxLQUFLLENBQUMsRUFBUyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7UUFIOUIseUJBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUkxRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQkFBaUIsQ0FBQyxXQUFvQixFQUFFLFdBQW1CLEVBQUUsTUFBc0M7UUFDeEcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FB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QU8sU0FBUyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVPLGtCQUFrQixDQUFDLEtBQWE7UUFDdEMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7UUFDRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQSxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDcEUsQ0FBQztJQUVELElBQVksVUFBVTtRQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUExZEQsOEJBMGRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuQ29uZGl0aW9uIH0gZnJvbSAnLi4vY2ZuLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBDZm5FbGVtZW50IH0gZnJvbSAnLi4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgRm4gfSBmcm9tICcuLi9jZm4tZm4nO1xuaW1wb3J0IHsgQ2ZuTWFwcGluZyB9IGZyb20gJy4uL2Nmbi1tYXBwaW5nJztcbmltcG9ydCB7IEF3cyB9IGZyb20gJy4uL2Nmbi1wc2V1ZG8nO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHtcbiAgQ2ZuQXV0b1NjYWxpbmdSZXBsYWNpbmdVcGRhdGUsIENmbkF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZSwgQ2ZuQXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb24sIENmbkNvZGVEZXBsb3lMYW1iZGFBbGlhc1VwZGF0ZSxcbiAgQ2ZuQ3JlYXRpb25Qb2xpY3ksIENmbkRlbGV0aW9uUG9saWN5LCBDZm5SZXNvdXJjZUF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3ksIENmblJlc291cmNlU2lnbmFsLCBDZm5VcGRhdGVQb2xpY3ksXG59IGZyb20gJy4uL2Nmbi1yZXNvdXJjZS1wb2xpY3knO1xuaW1wb3J0IHsgQ2ZuVGFnIH0gZnJvbSAnLi4vY2ZuLXRhZyc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vbGF6eSc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UsIFJlZmVyZW5jZVJlbmRlcmluZyB9IGZyb20gJy4uL3ByaXZhdGUvY2ZuLXJlZmVyZW5jZSc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSB9IGZyb20gJy4uL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yIH0gZnJvbSAnLi4vcnVudGltZSc7XG5pbXBvcnQgeyBpc1Jlc29sdmFibGVPYmplY3QsIFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuaW1wb3J0IHsgdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSB9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIFRoZSBjbGFzcyB1c2VkIGFzIHRoZSBpbnRlcm1lZGlhdGUgcmVzdWx0IGZyb20gdGhlIGdlbmVyYXRlZCBMMSBtZXRob2RzXG4gKiB0aGF0IGNvbnZlcnQgZnJvbSBDbG91ZEZvcm1hdGlvbidzIFVwcGVyQ2FzZSB0byBDREsncyBsb3dlckNhc2UgcHJvcGVydHkgbmFtZXMuXG4gKiBTYXZlcyBhbnkgZXh0cmEgcHJvcGVydGllcyB0aGF0IHdlcmUgcHJlc2VudCBpbiB0aGUgYXJndW1lbnQgb2JqZWN0LFxuICogYnV0IHRoYXQgd2VyZSBub3QgZm91bmQgaW4gdGhlIENGTiBzY2hlbWEsXG4gKiBzbyB0aGF0IHRoZXkncmUgbm90IGxvc3QgZnJvbSB0aGUgZmluYWwgQ0RLLXJlbmRlcmVkIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PFQ+IHtcbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlOiBUO1xuICBwdWJsaWMgcmVhZG9ubHkgZXh0cmFQcm9wZXJ0aWVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcih2YWx1ZTogVCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmV4dHJhUHJvcGVydGllcyA9IHt9O1xuICB9XG5cbiAgcHVibGljIGFwcGVuZEV4dHJhUHJvcGVydGllcyhwcmVmaXg6IHN0cmluZywgcHJvcGVydGllczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzID8/IHt9KSkge1xuICAgICAgdGhpcy5leHRyYVByb3BlcnRpZXNbYCR7cHJlZml4fS4ke2tleX1gXSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBIHByb3BlcnR5IG9iamVjdCB3ZSB3aWxsIGFjY3VtdWxhdGUgcHJvcGVydGllcyBpbnRvXG4gKi9cbmV4cG9ydCBjbGFzcyBGcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4gZXh0ZW5kcyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8VD4ge1xuICBwcml2YXRlIHJlYWRvbmx5IHJlY29nbml6ZWRQcm9wZXJ0aWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHt9IGFzIGFueSk7IC8vIFdlJ3JlIHN0aWxsIGFjY3VtdWxhdGluZ1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBhcnNlIHJlc3VsdCB1bmRlciBhIGdpdmVuIGtleVxuICAgKi9cbiAgcHVibGljIGFkZFByb3BlcnR5UmVzdWx0KGNka1Byb3BOYW1lOiBrZXlvZiBULCBjZm5Qcm9wTmFtZTogc3RyaW5nLCByZXN1bHQ/OiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8YW55Pik6IHZvaWQge1xuICAgIHRoaXMucmVjb2duaXplZFByb3BlcnRpZXMuYWRkKGNmblByb3BOYW1lKTtcbiAgICBpZiAoIXJlc3VsdCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnZhbHVlW2Nka1Byb3BOYW1lXSA9IHJlc3VsdC52YWx1ZTtcbiAgICB0aGlzLmFwcGVuZEV4dHJhUHJvcGVydGllcyhjZm5Qcm9wTmFtZSwgcmVzdWx0LmV4dHJhUHJvcGVydGllcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllczogb2JqZWN0KTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XG4gICAgICBpZiAoIXRoaXMucmVjb2duaXplZFByb3BlcnRpZXMuaGFzKGtleSkpIHtcbiAgICAgICAgdGhpcy5leHRyYVByb3BlcnRpZXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnRhaW5zIHN0YXRpYyBtZXRob2RzIGNhbGxlZCB3aGVuIGdvaW5nIGZyb21cbiAqIHRyYW5zbGF0ZWQgdmFsdWVzIHJlY2VpdmVkIGZyb20gYENmblBhcnNlci5wYXJzZVZhbHVlYFxuICogdG8gdGhlIGFjdHVhbCBMMSBwcm9wZXJ0aWVzIC1cbiAqIHRoaW5ncyBsaWtlIGNoYW5naW5nIElSZXNvbHZhYmxlIHRvIHRoZSBhcHByb3ByaWF0ZSB0eXBlXG4gKiAoc3RyaW5nLCBzdHJpbmcgYXJyYXksIG9yIG51bWJlciksIGV0Yy5cbiAqXG4gKiBXaGlsZSB0aGlzIGZpbGUgbm90IGV4cG9ydGVkIGZyb20gdGhlIG1vZHVsZVxuICogKHRvIG5vdCBtYWtlIGl0IHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkpLFxuICogaXQgaXMgZGlyZWN0bHkgcmVmZXJlbmNlZCBpbiB0aGUgZ2VuZXJhdGVkIEwxIGNvZGUuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgRnJvbUNsb3VkRm9ybWF0aW9uIHtcbiAgLy8gbm90aGluZyB0byBmb3IgYW55IGJ1dCByZXR1cm4gaXRcbiAgcHVibGljIHN0YXRpYyBnZXRBbnkodmFsdWU6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxhbnk+IHtcbiAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEJvb2xlYW4odmFsdWU6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxib29sZWFuIHwgSVJlc29sdmFibGU+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gQ2xvdWRGb3JtYXRpb24gYWxsb3dzIHBhc3Npbmcgc3RyaW5ncyBhcyBib29sZWFuXG4gICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3RydWUnOiByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh0cnVlKTtcbiAgICAgICAgY2FzZSAnZmFsc2UnOiByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChmYWxzZSk7XG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJ3RydWUnIG9yICdmYWxzZScgZm9yIGJvb2xlYW4gdmFsdWUsIGdvdDogJyR7dmFsdWV9J2ApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGluIGFsbCBvdGhlciBjYXNlcywganVzdCByZXR1cm4gdGhlIHZhbHVlLFxuICAgIC8vIGFuZCBsZXQgYSB2YWxpZGF0b3IgaGFuZGxlIGlmIGl0J3Mgbm90IGEgYm9vbGVhblxuICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RGF0ZSh2YWx1ZTogYW55KTogRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PERhdGUgfCBJUmVzb2x2YWJsZT4ge1xuICAgIC8vIGlmIHRoZSBkYXRlIGlzIGEgZGVwbG95LXRpbWUgdmFsdWUsIGp1c3QgcmV0dXJuIGl0XG4gICAgaWYgKGlzUmVzb2x2YWJsZU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgZGF0ZSBoYXMgYmVlbiBnaXZlbiBhcyBhIHN0cmluZywgY29udmVydCBpdFxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChuZXcgRGF0ZSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIC8vIGFsbCBvdGhlciBjYXNlcyAtIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZSxcbiAgICAvLyBpZiBpdCdzIG5vdCBhIERhdGUsIGEgdmFsaWRhdG9yIHNob3VsZCBjYXRjaCBpdFxuICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgfVxuXG4gIC8vIHdvbid0IGFsd2F5cyByZXR1cm4gYSBzdHJpbmc7IGlmIHRoZSBpbnB1dCBjYW4ndCBiZSByZXNvbHZlZCB0byBhIHN0cmluZyxcbiAgLy8gdGhlIGlucHV0IHdpbGwgYmUgcmV0dXJuZWQuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0U3RyaW5nKHZhbHVlOiBhbnkpOiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8c3RyaW5nPiB7XG4gICAgLy8gaWYgdGhlIHN0cmluZyBpcyBhIGRlcGxveS10aW1lIHZhbHVlLCBzZXJpYWxpemUgaXQgdG8gYSBUb2tlblxuICAgIGlmIChpc1Jlc29sdmFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZS50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICAvLyBDbG91ZEZvcm1hdGlvbiB0cmVhdHMgbnVtYmVycyBhbmQgc3RyaW5ncyBpbnRlcmNoYW5nZWFibHk7XG4gICAgLy8gc28sIGlmIHdlIGdldCBhIG51bWJlciBoZXJlLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIC8vIENsb3VkRm9ybWF0aW9uIHRyZWF0cyBib29sZWFucyBhbmQgc3RyaW5ncyBpbnRlcmNoYW5nZWFibHk7XG4gICAgLy8gc28sIGlmIHdlIGdldCBhIGJvb2xlYW4gaGVyZSwgY29udmVydCBpdCB0byBhIHN0cmluZ1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgLy8gaW4gYWxsIG90aGVyIGNhc2VzLCBqdXN0IHJldHVybiB0aGUgaW5wdXQsXG4gICAgLy8gYW5kIGxldCBhIHZhbGlkYXRvciBoYW5kbGUgaXQgaWYgaXQncyBub3QgYSBzdHJpbmdcbiAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICAvLyB3b24ndCBhbHdheXMgcmV0dXJuIGEgbnVtYmVyOyBpZiB0aGUgaW5wdXQgY2FuJ3QgYmUgcGFyc2VkIHRvIGEgbnVtYmVyLFxuICAvLyB0aGUgaW5wdXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgcHVibGljIHN0YXRpYyBnZXROdW1iZXIodmFsdWU6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxudW1iZXI+IHtcbiAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIGEgZGVwbG95LXRpbWUgdmFsdWUsIHNlcmlhbGl6ZSBpdCB0byBhIFRva2VuXG4gICAgaWYgKGlzUmVzb2x2YWJsZU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KFRva2VuLmFzTnVtYmVyKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIGEgbnVtYmVyLCBpZiB0aGUgaW5wdXQgY2FuIGJlIHBhcnNlZCBhcyBvbmVcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VkVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHBhcnNlZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UgcmV0dXJuIHRoZSBpbnB1dCxcbiAgICAvLyBhbmQgbGV0IGEgdmFsaWRhdG9yIGhhbmRsZSBpdCBpZiBpdCdzIG5vdCBhIG51bWJlclxuICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0U3RyaW5nQXJyYXkodmFsdWU6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxzdHJpbmdbXT4ge1xuICAgIC8vIGlmIHRoZSBhcnJheSBpcyBhIGRlcGxveS10aW1lIHZhbHVlLCBzZXJpYWxpemUgaXQgdG8gYSBUb2tlblxuICAgIGlmIChpc1Jlc29sdmFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChUb2tlbi5hc0xpc3QodmFsdWUpKTtcbiAgICB9XG5cbiAgICAvLyBpbiBhbGwgb3RoZXIgY2FzZXMsIGRlbGVnYXRlIHRvIHRoZSBzdGFuZGFyZCBtYXBwaW5nIGxvZ2ljXG4gICAgcmV0dXJuIHRoaXMuZ2V0QXJyYXkodGhpcy5nZXRTdHJpbmcpKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0QXJyYXk8VD4obWFwcGVyOiAoYXJnOiBhbnkpID0+IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxUPik6ICh4OiBhbnkpID0+IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxUW10+IHtcbiAgICByZXR1cm4gKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgLy8gYnJlYWsgdGhlIHR5cGUgc3lzdGVtLCBhbmQganVzdCByZXR1cm4gdGhlIGdpdmVuIHZhbHVlLFxuICAgICAgICAvLyB3aGljaCBob3BlZnVsbHkgd2lsbCBiZSByZXBvcnRlZCBhcyBpbnZhbGlkIGJ5IHRoZSB2YWxpZGF0b3JcbiAgICAgICAgLy8gb2YgdGhlIHByb3BlcnR5IHdlJ3JlIHRyYW5zZm9ybWluZ1xuICAgICAgICAvLyAodW5sZXNzIGl0J3MgYSBkZXBsb3ktdGltZSB2YWx1ZSxcbiAgICAgICAgLy8gd2hpY2ggd2UgY2FuJ3QgbWFwIG92ZXIgYXQgYnVpbGQgdGltZSBhbnl3YXkpXG4gICAgICAgIHJldHVybiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsdWVzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICAgIGNvbnN0IHJldCA9IG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWVzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWFwcGVyKHZhbHVlW2ldKTtcbiAgICAgICAgdmFsdWVzLnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgcmV0LmFwcGVuZEV4dHJhUHJvcGVydGllcyhgJHtpfWAsIHJlc3VsdC5leHRyYVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRNYXA8VD4obWFwcGVyOiAoYXJnOiBhbnkpID0+IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxUPik6ICh4OiBhbnkpID0+IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDx7IFtrZXk6IHN0cmluZ106IFQgfT4ge1xuICAgIHJldHVybiAodmFsdWU6IGFueSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gaWYgdGhlIGlucHV0IGlzIG5vdCBhIG1hcCAoPSBvYmplY3QgaW4gSlMgbGFuZCksXG4gICAgICAgIC8vIGp1c3QgcmV0dXJuIGl0LCBhbmQgbGV0IHRoZSB2YWxpZGF0b3Igb2YgdGhpcyBwcm9wZXJ0eSBoYW5kbGUgaXRcbiAgICAgICAgLy8gKHVubGVzcyBpdCdzIGEgZGVwbG95LXRpbWUgdmFsdWUsXG4gICAgICAgIC8vIHdoaWNoIHdlIGNhbid0IG1hcCBvdmVyIGF0IGJ1aWxkIHRpbWUgYW55d2F5KVxuICAgICAgICByZXR1cm4gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbHVlczogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcbiAgICAgIGNvbnN0IHJldCA9IG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWVzKTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWFwcGVyKHZhbCk7XG4gICAgICAgIHZhbHVlc1trZXldID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICByZXQuYXBwZW5kRXh0cmFQcm9wZXJ0aWVzKGtleSwgcmVzdWx0LmV4dHJhUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldENmblRhZyh0YWc6IGFueSk6IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5UYWc+IHtcbiAgICByZXR1cm4gdGFnID09IG51bGxcbiAgICAgID8gbmV3IEZyb21DbG91ZEZvcm1hdGlvblJlc3VsdCh7IH0gYXMgYW55KSAvLyBicmVhayB0aGUgdHlwZSBzeXN0ZW0gLSB0aGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhdCBydW50aW1lIGJ5IGEgdGFnIHZhbGlkYXRvclxuICAgICAgOiBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHtcbiAgICAgICAga2V5OiB0YWcuS2V5LFxuICAgICAgICB2YWx1ZTogdGFnLlZhbHVlLFxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBhcHBsaWVkIHRvIGEgdmFsdWUsIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCB2YWxpZGx5IGRlc2VyaWFsaXplZCBvbmVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZVVuaW9uKHZhbGlkYXRvcnM6IFZhbGlkYXRvcltdLCBtYXBwZXJzOiBBcnJheTwoeDogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8YW55Pj4pOlxuICAoeDogYW55KSA9PiBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8YW55PiB7XG4gICAgcmV0dXJuICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlID0gbWFwcGVyc1tpXSh2YWx1ZSk7XG4gICAgICAgIGlmICh2YWxpZGF0b3JzW2ldKGNhbmRpZGF0ZS52YWx1ZSkuaXNTdWNjZXNzKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBub3RoaW5nIG1hdGNoZXMsIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCB1bmNoYW5nZWQsIGFuZCBsZXQgdmFsaWRhdG9ycyBjYXRjaCBpdFxuICAgICAgcmV0dXJuIG5ldyBGcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQodmFsdWUpO1xuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgdGhhdCByZXByZXNlbnRzIGNhbGxiYWNrcyBpbnRvIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gKiBVc2VkIGJ5IHRoZSBmcm9tQ2xvdWRGb3JtYXRpb24gbWV0aG9kcyBpbiB0aGUgZ2VuZXJhdGVkIEwxIGNsYXNzZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNmbkZpbmRlciB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIENvbmRpdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lIGZyb20gdGhlIHRlbXBsYXRlLlxuICAgKiBJZiB0aGVyZSBpcyBubyBDb25kaXRpb24gd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHRlbXBsYXRlLFxuICAgKiByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG4gIGZpbmRDb25kaXRpb24oY29uZGl0aW9uTmFtZTogc3RyaW5nKTogQ2ZuQ29uZGl0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIE1hcHBpbmcgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBmcm9tIHRoZSB0ZW1wbGF0ZS5cbiAgICogSWYgdGhlcmUgaXMgbm8gTWFwcGluZyB3aXRoIHRoYXQgbmFtZSBpbiB0aGUgdGVtcGxhdGUsXG4gICAqIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cbiAgZmluZE1hcHBpbmcobWFwcGluZ05hbWU6IHN0cmluZyk6IENmbk1hcHBpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVsZW1lbnQgcmVmZXJlbmNlZCB1c2luZyBhIFJlZiBleHByZXNzaW9uIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqIElmIHRoZXJlIGlzIG5vIGVsZW1lbnQgd2l0aCB0aGlzIG5hbWUgaW4gdGhlIHRlbXBsYXRlLFxuICAgKiByZXR1cm4gdW5kZWZpbmVkLlxuICAgKi9cbiAgZmluZFJlZlRhcmdldChlbGVtZW50TmFtZTogc3RyaW5nKTogQ2ZuRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gbG9naWNhbCBJRCBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIElmIGEgcmVzb3VyY2Ugd2l0aCB0aGF0IGxvZ2ljYWwgSUQgd2FzIG5vdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGUsXG4gICAqIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cbiAgZmluZFJlc291cmNlKGxvZ2ljYWxJZDogc3RyaW5nKTogQ2ZuUmVzb3VyY2UgfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSB1c2VkIGFzIHRoZSBsYXN0IGFyZ3VtZW50IHRvIHRoZSBmcm9tQ2xvdWRGb3JtYXRpb25cbiAqIHN0YXRpYyBtZXRob2Qgb2YgdGhlIGdlbmVyYXRlZCBMMSBjbGFzc2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhcnNlciB1c2VkIHRvIGNvbnZlcnQgQ2xvdWRGb3JtYXRpb24gdG8gdmFsdWVzIHRoZSBDREsgdW5kZXJzdGFuZHMuXG4gICAqL1xuICByZWFkb25seSBwYXJzZXI6IENmblBhcnNlcjtcbn1cblxuLyoqXG4gKiBUaGUgY29udGV4dCBpbiB3aGljaCB0aGUgcGFyc2luZyBpcyB0YWtpbmcgcGxhY2UuXG4gKlxuICogU29tZSBmcmFnbWVudHMgb2YgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVzIGJlaGF2ZSBkaWZmZXJlbnRseSB0aGFuIG90aGVyc1xuICogKGZvciBleGFtcGxlLCB0aGUgJ0NvbmRpdGlvbnMnIHNlY3Rpb25zIHRyZWF0cyB7IFwiQ29uZGl0aW9uXCI6IFwiTmFtZU9mQ29uZFwiIH1cbiAqIGRpZmZlcmVudGx5IHRoYW4gdGhlICdSZXNvdXJjZXMnIHNlY3Rpb24pLlxuICogVGhpcyBlbnVtIGNhbiBiZSB1c2VkIHRvIGNoYW5nZSB0aGUgY3JlYXRlZCBgQ2ZuUGFyc2VyYCBiZWhhdmlvcixcbiAqIGJhc2VkIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZXh0LlxuICovXG5leHBvcnQgZW51bSBDZm5QYXJzaW5nQ29udGV4dCB7XG4gIC8qKiBXZSdyZSBjdXJyZW50bHkgcGFyc2luZyB0aGUgJ0NvbmRpdGlvbnMnIHNlY3Rpb24uICovXG4gIENPTkRJVElPTlMsXG5cbiAgLyoqIFdlJ3JlIGN1cnJlbnRseSBwYXJzaW5nIHRoZSAnUnVsZXMnIHNlY3Rpb24uICovXG4gIFJVTEVTLFxufVxuXG4vKipcbiAqIFRoZSBvcHRpb25zIGZvciBgRnJvbUNsb3VkRm9ybWF0aW9uLnBhcnNlVmFsdWVgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlQ2ZuT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZmluZGVyIGludGVyZmFjZSB1c2VkIHRvIHJlc29sdmUgcmVmZXJlbmNlcyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICByZWFkb25seSBmaW5kZXI6IElDZm5GaW5kZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBjb250ZXh0IHdlJ3JlIHBhcnNpbmcgdGhlIHRlbXBsYXRlIGluLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBkZWZhdWx0IGNvbnRleHQgKG5vIHNwZWNpYWwgYmVoYXZpb3IpXG4gICAqL1xuICByZWFkb25seSBjb250ZXh0PzogQ2ZuUGFyc2luZ0NvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFZhbHVlcyBwcm92aWRlZCBoZXJlIHdpbGwgcmVwbGFjZSByZWZlcmVuY2VzIHRvIHBhcmFtZXRlcnMgaW4gdGhlIHBhcnNlZCB0ZW1wbGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM6IHsgW3BhcmFtZXRlck5hbWU6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIFRoaXMgY2xhc3MgY29udGFpbnMgbWV0aG9kcyBmb3IgdHJhbnNsYXRpbmcgZnJvbSBhIHB1cmUgQ0ZOIHZhbHVlXG4gKiAobGlrZSBhIEpTIG9iamVjdCB7IFwiUmVmXCI6IFwiQnVja2V0XCIgfSlcbiAqIHRvIGEgZm9ybSBDREsgdW5kZXJzdGFuZHNcbiAqIChsaWtlIEZuLnJlZignQnVja2V0JykpLlxuICpcbiAqIFdoaWxlIHRoaXMgZmlsZSBub3QgZXhwb3J0ZWQgZnJvbSB0aGUgbW9kdWxlXG4gKiAodG8gbm90IG1ha2UgaXQgcGFydCBvZiB0aGUgcHVibGljIEFQSSksXG4gKiBpdCBpcyBkaXJlY3RseSByZWZlcmVuY2VkIGluIHRoZSBnZW5lcmF0ZWQgTDEgY29kZSxcbiAqIHNvIGFueSByZW5hbWVzIG9mIGl0IG5lZWQgdG8gYmUgcmVmbGVjdGVkIGluIGNmbjJ0cy9jb2RlZ2VuLnRzIGFzIHdlbGwuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUGFyc2VyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBQYXJzZUNmbk9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogUGFyc2VDZm5PcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBdHRyaWJ1dGVzKHJlc291cmNlOiBDZm5SZXNvdXJjZSwgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIGxvZ2ljYWxJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgY2ZuT3B0aW9ucyA9IHJlc291cmNlLmNmbk9wdGlvbnM7XG5cbiAgICBjZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0gdGhpcy5wYXJzZUNyZWF0aW9uUG9saWN5KHJlc291cmNlQXR0cmlidXRlcy5DcmVhdGlvblBvbGljeSk7XG4gICAgY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB0aGlzLnBhcnNlVXBkYXRlUG9saWN5KHJlc291cmNlQXR0cmlidXRlcy5VcGRhdGVQb2xpY3kpO1xuICAgIGNmbk9wdGlvbnMuZGVsZXRpb25Qb2xpY3kgPSB0aGlzLnBhcnNlRGVsZXRpb25Qb2xpY3kocmVzb3VyY2VBdHRyaWJ1dGVzLkRlbGV0aW9uUG9saWN5KTtcbiAgICBjZm5PcHRpb25zLnVwZGF0ZVJlcGxhY2VQb2xpY3kgPSB0aGlzLnBhcnNlRGVsZXRpb25Qb2xpY3kocmVzb3VyY2VBdHRyaWJ1dGVzLlVwZGF0ZVJlcGxhY2VQb2xpY3kpO1xuICAgIGNmbk9wdGlvbnMudmVyc2lvbiA9IHRoaXMucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuVmVyc2lvbik7XG4gICAgY2ZuT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuRGVzY3JpcHRpb24pO1xuICAgIGNmbk9wdGlvbnMubWV0YWRhdGEgPSB0aGlzLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLk1ldGFkYXRhKTtcblxuICAgIC8vIGhhbmRsZSBDb25kaXRpb25cbiAgICBpZiAocmVzb3VyY2VBdHRyaWJ1dGVzLkNvbmRpdGlvbikge1xuICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5maW5kZXIuZmluZENvbmRpdGlvbihyZXNvdXJjZUF0dHJpYnV0ZXMuQ29uZGl0aW9uKTtcbiAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb3VyY2UgJyR7bG9naWNhbElkfScgdXNlcyBDb25kaXRpb24gJyR7cmVzb3VyY2VBdHRyaWJ1dGVzLkNvbmRpdGlvbn0nIHRoYXQgZG9lc24ndCBleGlzdGApO1xuICAgICAgfVxuICAgICAgY2ZuT3B0aW9ucy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIERlcGVuZHNPblxuICAgIHJlc291cmNlQXR0cmlidXRlcy5EZXBlbmRzT24gPSByZXNvdXJjZUF0dHJpYnV0ZXMuRGVwZW5kc09uID8/IFtdO1xuICAgIGNvbnN0IGRlcGVuZGVuY2llczogc3RyaW5nW10gPSBBcnJheS5pc0FycmF5KHJlc291cmNlQXR0cmlidXRlcy5EZXBlbmRzT24pID9cbiAgICAgIHJlc291cmNlQXR0cmlidXRlcy5EZXBlbmRzT24gOiBbcmVzb3VyY2VBdHRyaWJ1dGVzLkRlcGVuZHNPbl07XG4gICAgZm9yIChjb25zdCBkZXAgb2YgZGVwZW5kZW5jaWVzKSB7XG4gICAgICBjb25zdCBkZXBSZXNvdXJjZSA9IHRoaXMuZmluZGVyLmZpbmRSZXNvdXJjZShkZXApO1xuICAgICAgaWYgKCFkZXBSZXNvdXJjZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc291cmNlICcke2xvZ2ljYWxJZH0nIGRlcGVuZHMgb24gJyR7ZGVwfScgdGhhdCBkb2Vzbid0IGV4aXN0YCk7XG4gICAgICB9XG4gICAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koZGVwUmVzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VDcmVhdGlvblBvbGljeShwb2xpY3k6IGFueSk6IENmbkNyZWF0aW9uUG9saWN5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodHlwZW9mIHBvbGljeSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgLy8gY2hhbmdlIHNpbXBsZSBKUyB2YWx1ZXMgdG8gdGhlaXIgQ0RLIGVxdWl2YWxlbnRzXG4gICAgcG9saWN5ID0gdGhpcy5wYXJzZVZhbHVlKHBvbGljeSk7XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICBhdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5OiBwYXJzZUF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3kocG9saWN5LkF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3kpLFxuICAgICAgcmVzb3VyY2VTaWduYWw6IHBhcnNlUmVzb3VyY2VTaWduYWwocG9saWN5LlJlc291cmNlU2lnbmFsKSxcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlQXV0b1NjYWxpbmdDcmVhdGlvblBvbGljeShwOiBhbnkpOiBDZm5SZXNvdXJjZUF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3kgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHR5cGVvZiBwICE9PSAnb2JqZWN0JykgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgbWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQ6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXROdW1iZXIocC5NaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCkudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVJlc291cmNlU2lnbmFsKHA6IGFueSk6IENmblJlc291cmNlU2lnbmFsIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIGNvdW50OiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHAuQ291bnQpLnZhbHVlLFxuICAgICAgICB0aW1lb3V0OiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHAuVGltZW91dCkudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVXBkYXRlUG9saWN5KHBvbGljeTogYW55KTogQ2ZuVXBkYXRlUG9saWN5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodHlwZW9mIHBvbGljeSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgLy8gY2hhbmdlIHNpbXBsZSBKUyB2YWx1ZXMgdG8gdGhlaXIgQ0RLIGVxdWl2YWxlbnRzXG4gICAgcG9saWN5ID0gdGhpcy5wYXJzZVZhbHVlKHBvbGljeSk7XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICBhdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZTogcGFyc2VBdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZShwb2xpY3kuQXV0b1NjYWxpbmdSZXBsYWNpbmdVcGRhdGUpLFxuICAgICAgYXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlOiBwYXJzZUF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZShwb2xpY3kuQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlKSxcbiAgICAgIGF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uOiBwYXJzZUF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uKHBvbGljeS5BdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbiksXG4gICAgICBjb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHBhcnNlQ29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlKHBvbGljeS5Db2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGUpLFxuICAgICAgZW5hYmxlVmVyc2lvblVwZ3JhZGU6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXRCb29sZWFuKHBvbGljeS5FbmFibGVWZXJzaW9uVXBncmFkZSkudmFsdWUsXG4gICAgICB1c2VPbmxpbmVSZXNoYXJkaW5nOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Qm9vbGVhbihwb2xpY3kuVXNlT25saW5lUmVzaGFyZGluZykudmFsdWUsXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlKHA6IGFueSk6IENmbkF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIHdpbGxSZXBsYWNlOiBwLldpbGxSZXBsYWNlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VBdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGUocDogYW55KTogQ2ZuQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIG1heEJhdGNoU2l6ZTogRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwLk1heEJhdGNoU2l6ZSkudmFsdWUsXG4gICAgICAgIG1pbkluc3RhbmNlc0luU2VydmljZTogRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwLk1pbkluc3RhbmNlc0luU2VydmljZSkudmFsdWUsXG4gICAgICAgIG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHAuTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQpLnZhbHVlLFxuICAgICAgICBwYXVzZVRpbWU6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocC5QYXVzZVRpbWUpLnZhbHVlLFxuICAgICAgICBzdXNwZW5kUHJvY2Vzc2VzOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocC5TdXNwZW5kUHJvY2Vzc2VzKS52YWx1ZSxcbiAgICAgICAgd2FpdE9uUmVzb3VyY2VTaWduYWxzOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Qm9vbGVhbihwLldhaXRPblJlc291cmNlU2lnbmFscykudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUNvZGVEZXBsb3lMYW1iZGFBbGlhc1VwZGF0ZShwOiBhbnkpOiBDZm5Db2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGUgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHR5cGVvZiBwICE9PSAnb2JqZWN0JykgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJlZm9yZUFsbG93VHJhZmZpY0hvb2s6IEZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocC5CZWZvcmVBbGxvd1RyYWZmaWNIb29rKS52YWx1ZSxcbiAgICAgICAgYWZ0ZXJBbGxvd1RyYWZmaWNIb29rOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHAuQWZ0ZXJBbGxvd1RyYWZmaWNIb29rKS52YWx1ZSxcbiAgICAgICAgYXBwbGljYXRpb25OYW1lOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHAuQXBwbGljYXRpb25OYW1lKS52YWx1ZSxcbiAgICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwLkRlcGxveW1lbnRHcm91cE5hbWUpLnZhbHVlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uKHA6IGFueSk6IENmbkF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIGlnbm9yZVVubW9kaWZpZWRHcm91cFNpemVQcm9wZXJ0aWVzOiBGcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Qm9vbGVhbihwLklnbm9yZVVubW9kaWZpZWRHcm91cFNpemVQcm9wZXJ0aWVzKS52YWx1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VEZWxldGlvblBvbGljeShwb2xpY3k6IGFueSk6IENmbkRlbGV0aW9uUG9saWN5IHwgdW5kZWZpbmVkIHtcbiAgICBzd2l0Y2ggKHBvbGljeSkge1xuICAgICAgY2FzZSBudWxsOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgY2FzZSB1bmRlZmluZWQ6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBjYXNlICdEZWxldGUnOiByZXR1cm4gQ2ZuRGVsZXRpb25Qb2xpY3kuREVMRVRFO1xuICAgICAgY2FzZSAnUmV0YWluJzogcmV0dXJuIENmbkRlbGV0aW9uUG9saWN5LlJFVEFJTjtcbiAgICAgIGNhc2UgJ1NuYXBzaG90JzogcmV0dXJuIENmbkRlbGV0aW9uUG9saWN5LlNOQVBTSE9UO1xuICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgRGVsZXRpb25Qb2xpY3kgJyR7cG9saWN5fSdgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2VWYWx1ZShjZm5WYWx1ZTogYW55KTogYW55IHtcbiAgICAvLyA9PSBudWxsIGNhcHR1cmVzIHVuZGVmaW5lZCBhcyB3ZWxsXG4gICAgaWYgKGNmblZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGlmIHdlIGhhdmUgYW55IGxhdGUtYm91bmQgdmFsdWVzLFxuICAgIC8vIGp1c3QgcmV0dXJuIHRoZW1cbiAgICBpZiAoaXNSZXNvbHZhYmxlT2JqZWN0KGNmblZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNmblZhbHVlO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjZm5WYWx1ZSkpIHtcbiAgICAgIHJldHVybiBjZm5WYWx1ZS5tYXAoZWwgPT4gdGhpcy5wYXJzZVZhbHVlKGVsKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2ZuVmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBhbiBvYmplY3QgY2FuIGJlIGVpdGhlciBhIENGTiBpbnRyaW5zaWMsIG9yIGFuIGFjdHVhbCBvYmplY3RcbiAgICAgIGNvbnN0IGNmbkludHJpbnNpYyA9IHRoaXMucGFyc2VJZkNmbkludHJpbnNpYyhjZm5WYWx1ZSk7XG4gICAgICBpZiAoY2ZuSW50cmluc2ljICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGNmbkludHJpbnNpYztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJldDogYW55ID0ge307XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgT2JqZWN0LmVudHJpZXMoY2ZuVmFsdWUpKSB7XG4gICAgICAgIHJldFtrZXldID0gdGhpcy5wYXJzZVZhbHVlKHZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICAvLyBpbiBhbGwgb3RoZXIgY2FzZXMsIGp1c3QgcmV0dXJuIHRoZSBpbnB1dFxuICAgIHJldHVybiBjZm5WYWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZmluZGVyKCk6IElDZm5GaW5kZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUlmQ2ZuSW50cmluc2ljKG9iamVjdDogYW55KTogYW55IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmxvb2tzTGlrZUNmbkludHJpbnNpYyhvYmplY3QpO1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGNhc2UgJ1JlZic6IHtcbiAgICAgICAgY29uc3QgcmVmVGFyZ2V0ID0gb2JqZWN0W2tleV07XG4gICAgICAgIGNvbnN0IHNwZWNpYWxSZWYgPSB0aGlzLnNwZWNpYWxDYXNlUmVmcyhyZWZUYXJnZXQpO1xuICAgICAgICBpZiAoc3BlY2lhbFJlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHNwZWNpYWxSZWY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcmVmRWxlbWVudCA9IHRoaXMuZmluZGVyLmZpbmRSZWZUYXJnZXQocmVmVGFyZ2V0KTtcbiAgICAgICAgICBpZiAoIXJlZkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCB1c2VkIGluIFJlZiBleHByZXNzaW9uIHdpdGggbG9naWNhbCBJRDogJyR7cmVmVGFyZ2V0fScgbm90IGZvdW5kYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBDZm5SZWZlcmVuY2UuZm9yKHJlZkVsZW1lbnQsICdSZWYnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FzZSAnRm46OkdldEF0dCc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgbGV0IGxvZ2ljYWxJZDogc3RyaW5nLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHN0cmluZ0Zvcm06IGJvb2xlYW47XG4gICAgICAgIC8vIEZuOjpHZXRBdHQgdGFrZXMgYXMgYXJndW1lbnRzIGVpdGhlciBhIHN0cmluZy4uLlxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIC4uLmluIHdoaWNoIGNhc2UgdGhlIGxvZ2ljYWwgSUQgYW5kIHRoZSBhdHRyaWJ1dGUgbmFtZSBhcmUgc2VwYXJhdGVkIHdpdGggJy4nXG4gICAgICAgICAgY29uc3QgZG90SW5kZXggPSB2YWx1ZS5pbmRleE9mKCcuJyk7XG4gICAgICAgICAgaWYgKGRvdEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaG9ydC1mb3JtIEZuOjpHZXRBdHQgbXVzdCBjb250YWluIGEgJy4nIGluIGl0cyBzdHJpbmcgYXJndW1lbnQsIGdvdDogJyR7dmFsdWV9J2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsb2dpY2FsSWQgPSB2YWx1ZS5zbGljZSgwLCBkb3RJbmRleCk7XG4gICAgICAgICAgYXR0cmlidXRlTmFtZSA9IHZhbHVlLnNsaWNlKGRvdEluZGV4ICsgMSk7IC8vIHRoZSArMSBpcyB0byBza2lwIHRoZSBhY3R1YWwgJy4nXG4gICAgICAgICAgc3RyaW5nRm9ybSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gLi4ub3IgYSAyLWVsZW1lbnQgbGlzdFxuICAgICAgICAgIGxvZ2ljYWxJZCA9IHZhbHVlWzBdO1xuICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSB2YWx1ZVsxXTtcbiAgICAgICAgICBzdHJpbmdGb3JtID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5maW5kZXIuZmluZFJlc291cmNlKGxvZ2ljYWxJZCk7XG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSB1c2VkIGluIEdldEF0dCBleHByZXNzaW9uIHdpdGggbG9naWNhbCBJRDogJyR7bG9naWNhbElkfScgbm90IGZvdW5kYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENmblJlZmVyZW5jZS5mb3IodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lLCBzdHJpbmdGb3JtID8gUmVmZXJlbmNlUmVuZGVyaW5nLkdFVF9BVFRfU1RSSU5HIDogdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpKb2luJzoge1xuICAgICAgICAvLyBGbjo6Sm9pbiB0YWtlcyBhIDItZWxlbWVudCBsaXN0IGFzIGl0cyBhcmd1bWVudCxcbiAgICAgICAgLy8gd2hlcmUgdGhlIGZpcnN0IGVsZW1lbnQgaXMgdGhlIGRlbGltaXRlcixcbiAgICAgICAgLy8gYW5kIHRoZSBzZWNvbmQgaXMgdGhlIGxpc3Qgb2YgZWxlbWVudHMgdG8gam9pblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIC8vIHdyYXAgdGhlIGFycmF5IGFzIGEgVG9rZW4sXG4gICAgICAgIC8vIGFzIG90aGVyd2lzZSBGbi5qb2luKCkgd2lsbCB0cnkgdG8gY29uY2F0ZW5hdGVcbiAgICAgICAgLy8gdGhlIG5vbi10b2tlbiBwYXJ0cyxcbiAgICAgICAgLy8gY2F1c2luZyBhIGRpZmYgd2l0aCB0aGUgb3JpZ2luYWwgdGVtcGxhdGVcbiAgICAgICAgcmV0dXJuIEZuLmpvaW4odmFsdWVbMF0sIExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHZhbHVlWzFdIH0pKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpDaWRyJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5jaWRyKHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46OkZpbmRJbk1hcCc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICAvLyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gRmluZEluTWFwIGlzIHRoZSBtYXBwaW5nIG5hbWVcbiAgICAgICAgbGV0IG1hcHBpbmdOYW1lOiBzdHJpbmc7XG4gICAgICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQodmFsdWVbMF0pKSB7XG4gICAgICAgICAgLy8gdGhlIGZpcnN0IGFyZ3VtZW50IGNhbiBiZSBhIGR5bmFtaWMgZXhwcmVzc2lvbiBsaWtlIFJlZjogUGFyYW07XG4gICAgICAgICAgLy8gaWYgaXQgaXMsIHdlIGNhbid0IGZpbmQgdGhlIG1hcHBpbmcgaW4gYWR2YW5jZVxuICAgICAgICAgIG1hcHBpbmdOYW1lID0gdmFsdWVbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgbWFwcGluZyA9IHRoaXMuZmluZGVyLmZpbmRNYXBwaW5nKHZhbHVlWzBdKTtcbiAgICAgICAgICBpZiAoIW1hcHBpbmcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwcGluZyB1c2VkIGluIEZpbmRJbk1hcCBleHByZXNzaW9uIHdpdGggbmFtZSAnJHt2YWx1ZVswXX0nIHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hcHBpbmdOYW1lID0gbWFwcGluZy5sb2dpY2FsSWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZuLl9maW5kSW5NYXAobWFwcGluZ05hbWUsIHZhbHVlWzFdLCB2YWx1ZVsyXSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6U2VsZWN0Jzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5zZWxlY3QodmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpHZXRBWnMnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLmdldEF6cyh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6SW1wb3J0VmFsdWUnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLmltcG9ydFZhbHVlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpTcGxpdCc6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICByZXR1cm4gRm4uc3BsaXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpUcmFuc2Zvcm0nOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLnRyYW5zZm9ybSh2YWx1ZS5OYW1lLCB2YWx1ZS5QYXJhbWV0ZXJzKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLmJhc2U2NCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6SWYnOiB7XG4gICAgICAgIC8vIEZuOjpJZiB0YWtlcyBhIDMtZWxlbWVudCBsaXN0IGFzIGl0cyBhcmd1bWVudCxcbiAgICAgICAgLy8gd2hlcmUgdGhlIGZpcnN0IGVsZW1lbnQgaXMgdGhlIG5hbWUgb2YgYSBDb25kaXRpb25cbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmZpbmRlci5maW5kQ29uZGl0aW9uKHZhbHVlWzBdKTtcbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbmRpdGlvbiAnJHt2YWx1ZVswXX0nIHVzZWQgaW4gYW4gRm46OklmIGV4cHJlc3Npb24gZG9lcyBub3QgZXhpc3QgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZuLmNvbmRpdGlvbklmKGNvbmRpdGlvbi5sb2dpY2FsSWQsIHZhbHVlWzFdLCB2YWx1ZVsyXSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6RXF1YWxzJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5jb25kaXRpb25FcXVhbHModmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0ZuOjpBbmQnOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKG9iamVjdFtrZXldKTtcbiAgICAgICAgcmV0dXJuIEZuLmNvbmRpdGlvbkFuZCguLi52YWx1ZSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6Tm90Jzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5jb25kaXRpb25Ob3QodmFsdWVbMF0pO1xuICAgICAgfVxuICAgICAgY2FzZSAnRm46Ok9yJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIHJldHVybiBGbi5jb25kaXRpb25PciguLi52YWx1ZSk7XG4gICAgICB9XG4gICAgICBjYXNlICdGbjo6U3ViJzoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgICAgIGxldCBmblN1YlN0cmluZzogc3RyaW5nO1xuICAgICAgICBsZXQgbWFwOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGZuU3ViU3RyaW5nID0gdmFsdWU7XG4gICAgICAgICAgbWFwID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZuU3ViU3RyaW5nID0gdmFsdWVbMF07XG4gICAgICAgICAgbWFwID0gdmFsdWVbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZuU3ViU3RyaW5nKGZuU3ViU3RyaW5nLCBtYXApO1xuICAgICAgfVxuICAgICAgY2FzZSAnQ29uZGl0aW9uJzoge1xuICAgICAgICAvLyBhIHJlZmVyZW5jZSB0byBhIENvbmRpdGlvbiBmcm9tIGFub3RoZXIgQ29uZGl0aW9uXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuZmluZGVyLmZpbmRDb25kaXRpb24ob2JqZWN0W2tleV0pO1xuICAgICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVmZXJlbmNlZCBDb25kaXRpb24gd2l0aCBuYW1lICcke29iamVjdFtrZXldfScgd2FzIG5vdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGVgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBDb25kaXRpb246IGNvbmRpdGlvbi5sb2dpY2FsSWQgfTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGV4dCA9PT0gQ2ZuUGFyc2luZ0NvbnRleHQuUlVMRVMpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSdWxlc0ludHJpbnNpYyhrZXksIG9iamVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbiAnJHtrZXl9J2ApO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb29rc0xpa2VDZm5JbnRyaW5zaWMob2JqZWN0OiBvYmplY3QpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIC8vIGEgQ0ZOIGludHJpbnNpYyBpcyBhbHdheXMgYW4gb2JqZWN0IHdpdGggYSBzaW5nbGUga2V5XG4gICAgaWYgKG9iamVjdEtleXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGtleSA9IG9iamVjdEtleXNbMF07XG4gICAgcmV0dXJuIGtleSA9PT0gJ1JlZicgfHwga2V5LnN0YXJ0c1dpdGgoJ0ZuOjonKSB8fFxuICAgICAgICAvLyBzcGVjaWFsIGludHJpbnNpYyBvbmx5IGF2YWlsYWJsZSBpbiB0aGUgJ0NvbmRpdGlvbnMnIHNlY3Rpb25cbiAgICAgICAgKHRoaXMub3B0aW9ucy5jb250ZXh0ID09PSBDZm5QYXJzaW5nQ29udGV4dC5DT05ESVRJT05TICYmIGtleSA9PT0gJ0NvbmRpdGlvbicpXG4gICAgICA/IGtleVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRm5TdWJTdHJpbmcodGVtcGxhdGVTdHJpbmc6IHN0cmluZywgZXhwcmVzc2lvbk1hcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgY29uc3QgbWFwID0gZXhwcmVzc2lvbk1hcCA/PyB7fTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gRm4uc3ViKGdvKHRlbXBsYXRlU3RyaW5nKSwgT2JqZWN0LmtleXMobWFwKS5sZW5ndGggPT09IDAgPyBleHByZXNzaW9uTWFwIDogbWFwKTtcblxuICAgIGZ1bmN0aW9uIGdvKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgY29uc3QgbGVmdEJyYWNlID0gdmFsdWUuaW5kZXhPZignJHsnKTtcbiAgICAgIGlmIChsZWZ0QnJhY2UgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIC8vIHNlYXJjaCBmb3IgdGhlIGNsb3NpbmcgYnJhY2UgdG8gdGhlIHJpZ2h0IG9mIHRoZSBvcGVuaW5nICckeydcbiAgICAgIC8vIChpbiB0aGVvcnksIHRoZXJlIGNvdWxkIGJlIG90aGVyIGJyYWNlcyBpbiB0aGUgc3RyaW5nLFxuICAgICAgLy8gZm9yIGV4YW1wbGUgaWYgaXQgcmVwcmVzZW50cyBhIEpTT04gb2JqZWN0KVxuICAgICAgY29uc3QgcmlnaHRCcmFjZSA9IHZhbHVlLmluZGV4T2YoJ30nLCBsZWZ0QnJhY2UpO1xuICAgICAgaWYgKHJpZ2h0QnJhY2UgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGVmdEhhbGYgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVmdEJyYWNlKTtcbiAgICAgIGNvbnN0IHJpZ2h0SGFsZiA9IHZhbHVlLnN1YnN0cmluZyhyaWdodEJyYWNlICsgMSk7XG4gICAgICAvLyBkb24ndCBpbmNsdWRlIGxlZnQgYW5kIHJpZ2h0IGJyYWNlcyB3aGVuIHNlYXJjaGluZyBmb3IgdGhlIHRhcmdldCBvZiB0aGUgcmVmZXJlbmNlXG4gICAgICBjb25zdCByZWZUYXJnZXQgPSB2YWx1ZS5zdWJzdHJpbmcobGVmdEJyYWNlICsgMiwgcmlnaHRCcmFjZSkudHJpbSgpO1xuICAgICAgaWYgKHJlZlRhcmdldFswXSA9PT0gJyEnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHJpbmcoMCwgcmlnaHRCcmFjZSArIDEpICsgZ28ocmlnaHRIYWxmKTtcbiAgICAgIH1cblxuICAgICAgLy8gbG9va3VwIGluIG1hcFxuICAgICAgaWYgKHJlZlRhcmdldCBpbiBtYXApIHtcbiAgICAgICAgcmV0dXJuIGxlZnRIYWxmICsgJyR7JyArIHJlZlRhcmdldCArICd9JyArIGdvKHJpZ2h0SGFsZik7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbmNlIGl0J3Mgbm90IGluIHRoZSBtYXAsIGNoZWNrIGlmIGl0J3MgYSBwc2V1ZG8tcGFyYW1ldGVyXG4gICAgICAvLyAob3IgYSB2YWx1ZSB0byBiZSBzdWJzdGl0dXRlZCBmb3IgYSBQYXJhbWV0ZXIsIHByb3ZpZGVkIGJ5IHRoZSBjdXN0b21lcilcbiAgICAgIGNvbnN0IHNwZWNpYWxSZWYgPSBzZWxmLnNwZWNpYWxDYXNlU3ViUmVmcyhyZWZUYXJnZXQpO1xuICAgICAgaWYgKHNwZWNpYWxSZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHNwZWNpYWxSZWYpKSB7XG4gICAgICAgICAgLy8gc3BlY2lhbFJlZiBjYW4gb25seSBiZSBhIFRva2VuIGlmIHRoZSB2YWx1ZSBwYXNzZWQgYnkgdGhlIGN1c3RvbWVyXG4gICAgICAgICAgLy8gZm9yIHN1YnN0aXR1dGluZyBhIFBhcmFtZXRlciB3YXMgYSBUb2tlbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIGFjdHVhbGx5IGJhZCBoZXJlLFxuICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIFRva2VuIGNhbiBwb3RlbnRpYWxseSBiZSBzb21ldGhpbmcgdGhhdCBkb2Vzbid0IHJlbmRlclxuICAgICAgICAgIC8vIHdlbGwgaW5zaWRlIGFuIEZuOjpTdWIgdGVtcGxhdGUgc3RyaW5nLCBsaWtlIGEgeyBSZWYgfSBvYmplY3QuXG4gICAgICAgICAgLy8gVG8gaGFuZGxlIHRoaXMgY2FzZSxcbiAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHN1YnN0aXR1dGluZyB0aGUgUGFyYW1ldGVyIGRpcmVjdGx5IHdpdGggdGhlIHRva2VuIGluIHRoZSB0ZW1wbGF0ZSBzdHJpbmcsXG4gICAgICAgICAgLy8gYWRkIGEgbmV3IGVudHJ5IHRvIHRoZSBGbjo6U3ViIG1hcCxcbiAgICAgICAgICAvLyB3aXRoIGtleSByZWZUYXJnZXQsIGFuZCB0aGUgdG9rZW4gYXMgdGhlIHZhbHVlLlxuICAgICAgICAgIC8vIFRoaXMgaXMgc2FmZSwgYmVjYXVzZSB0aGlzIHNvcnQgb2Ygc2hhZG93aW5nIGlzIGxlZ2FsIGluIENsb3VkRm9ybWF0aW9uLFxuICAgICAgICAgIC8vIGFuZCBhbHNvIGJlY2F1c2Ugd2UncmUgY2VydGFpbiB0aGUgRm46OlN1YiBtYXAgZG9lc24ndCBjb250YWluIGFuIGVudHJ5IGZvciByZWZUYXJnZXRcbiAgICAgICAgICAvLyAoYXMgd2UgY2hlY2sgdGhhdCBjb25kaXRpb24gaW4gdGhlIGNvZGUgcmlnaHQgYWJvdmUgdGhpcykuXG4gICAgICAgICAgbWFwW3JlZlRhcmdldF0gPSBzcGVjaWFsUmVmO1xuICAgICAgICAgIHJldHVybiBsZWZ0SGFsZiArICckeycgKyByZWZUYXJnZXQgKyAnfScgKyBnbyhyaWdodEhhbGYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBsZWZ0SGFsZiArIHNwZWNpYWxSZWYgKyBnbyhyaWdodEhhbGYpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRvdEluZGV4ID0gcmVmVGFyZ2V0LmluZGV4T2YoJy4nKTtcbiAgICAgIGNvbnN0IGlzUmVmID0gZG90SW5kZXggPT09IC0xO1xuICAgICAgaWYgKGlzUmVmKSB7XG4gICAgICAgIGNvbnN0IHJlZkVsZW1lbnQgPSBzZWxmLmZpbmRlci5maW5kUmVmVGFyZ2V0KHJlZlRhcmdldCk7XG4gICAgICAgIGlmICghcmVmRWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCByZWZlcmVuY2VkIGluIEZuOjpTdWIgZXhwcmVzc2lvbiB3aXRoIGxvZ2ljYWwgSUQ6ICcke3JlZlRhcmdldH0nIHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlZnRIYWxmICsgQ2ZuUmVmZXJlbmNlLmZvcihyZWZFbGVtZW50LCAnUmVmJywgUmVmZXJlbmNlUmVuZGVyaW5nLkZOX1NVQikudG9TdHJpbmcoKSArIGdvKHJpZ2h0SGFsZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0YXJnZXRJZCA9IHJlZlRhcmdldC5zdWJzdHJpbmcoMCwgZG90SW5kZXgpO1xuICAgICAgICBjb25zdCByZWZSZXNvdXJjZSA9IHNlbGYuZmluZGVyLmZpbmRSZXNvdXJjZSh0YXJnZXRJZCk7XG4gICAgICAgIGlmICghcmVmUmVzb3VyY2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc291cmNlIHJlZmVyZW5jZWQgaW4gRm46OlN1YiBleHByZXNzaW9uIHdpdGggbG9naWNhbCBJRDogJyR7dGFyZ2V0SWR9JyB3YXMgbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IHJlZlRhcmdldC5zdWJzdHJpbmcoZG90SW5kZXggKyAxKTtcbiAgICAgICAgcmV0dXJuIGxlZnRIYWxmICsgQ2ZuUmVmZXJlbmNlLmZvcihyZWZSZXNvdXJjZSwgYXR0cmlidXRlLCBSZWZlcmVuY2VSZW5kZXJpbmcuRk5fU1VCKS50b1N0cmluZygpICsgZ28ocmlnaHRIYWxmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVJ1bGVzSW50cmluc2ljKGtleTogc3RyaW5nLCBvYmplY3Q6IGFueSk6IGFueSB7XG4gICAgLy8gUnVsZXMgaGF2ZSB0aGVpciBvd24gc2V0IG9mIGludHJpbnNpY3M6XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3NlcnZpY2VjYXRhbG9nL2xhdGVzdC9hZG1pbmd1aWRlL2ludHJpbnNpYy1mdW5jdGlvbi1yZWZlcmVuY2UtcnVsZXMuaHRtbFxuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlICdGbjo6VmFsdWVPZic6IHtcbiAgICAgICAgLy8gVmFsdWVPZiBpcyBzcGVjaWFsLFxuICAgICAgICAvLyBhcyBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIFBhcmFtZXRlciBhcyBpdHMgZmlyc3QgYXJndW1lbnRcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUob2JqZWN0W2tleV0pO1xuICAgICAgICBjb25zdCBwYXJhbWV0ZXJOYW1lID0gdmFsdWVbMF07XG4gICAgICAgIGlmIChwYXJhbWV0ZXJOYW1lIGluIHRoaXMucGFyYW1ldGVycykge1xuICAgICAgICAgIC8vIHNpbmNlIFZhbHVlT2YgcmV0dXJucyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpYyBhdHRyaWJ1dGUsXG4gICAgICAgICAgLy8gZmFpbCBoZXJlIC0gdGhpcyBzdWJzdGl0dXRpb24gaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzdWJzdGl0dXRlIHBhcmFtZXRlciAnJHtwYXJhbWV0ZXJOYW1lfScgdXNlZCBpbiBGbjo6VmFsdWVPZiBleHByZXNzaW9uIHdpdGggYXR0cmlidXRlICcke3ZhbHVlWzFdfSdgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJhbSA9IHRoaXMuZmluZGVyLmZpbmRSZWZUYXJnZXQocGFyYW1ldGVyTmFtZSk7XG4gICAgICAgIGlmICghcGFyYW0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bGUgcmVmZXJlbmNlcyBwYXJhbWV0ZXIgJyR7cGFyYW1ldGVyTmFtZX0nIHdoaWNoIHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY3JlYXRlIGFuIGV4cGxpY2l0IElSZXNvbHZhYmxlLFxuICAgICAgICAvLyBhcyBGbi52YWx1ZU9mKCkgcmV0dXJucyBhIHN0cmluZyxcbiAgICAgICAgLy8gd2hpY2ggaXMgaW5jb3JyZWN0XG4gICAgICAgIC8vIChGbjo6VmFsdWVPZiBjYW4gYWxzbyByZXR1cm4gYW4gYXJyYXkpXG4gICAgICAgIHJldHVybiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+ICh7ICdGbjo6VmFsdWVPZic6IFtwYXJhbS5sb2dpY2FsSWQsIHZhbHVlWzFdXSB9KSB9KTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEkgZG9uJ3Qgd2FudCB0byBoYXJkLWNvZGUgdGhlIGxpc3Qgb2Ygc3VwcG9ydGVkIFJ1bGVzLXNwZWNpZmljIGludHJpbnNpY3MgaW4gdGhpcyBmdW5jdGlvbjtcbiAgICAgICAgLy8gc28sIGp1c3QgcmV0dXJuIHVuZGVmaW5lZCBoZXJlLFxuICAgICAgICAvLyBhbmQgdGhleSB3aWxsIGJlIHRyZWF0ZWQgYXMgYSByZWd1bGFyIEpTT04gb2JqZWN0XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzcGVjaWFsQ2FzZVJlZnModmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKHZhbHVlIGluIHRoaXMucGFyYW1ldGVycykge1xuICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVyc1t2YWx1ZV07XG4gICAgfVxuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ0FXUzo6QWNjb3VudElkJzogcmV0dXJuIEF3cy5BQ0NPVU5UX0lEO1xuICAgICAgY2FzZSAnQVdTOjpSZWdpb24nOiByZXR1cm4gQXdzLlJFR0lPTjtcbiAgICAgIGNhc2UgJ0FXUzo6UGFydGl0aW9uJzogcmV0dXJuIEF3cy5QQVJUSVRJT047XG4gICAgICBjYXNlICdBV1M6OlVSTFN1ZmZpeCc6IHJldHVybiBBd3MuVVJMX1NVRkZJWDtcbiAgICAgIGNhc2UgJ0FXUzo6Tm90aWZpY2F0aW9uQVJOcyc6IHJldHVybiBBd3MuTk9USUZJQ0FUSU9OX0FSTlM7XG4gICAgICBjYXNlICdBV1M6OlN0YWNrSWQnOiByZXR1cm4gQXdzLlNUQUNLX0lEO1xuICAgICAgY2FzZSAnQVdTOjpTdGFja05hbWUnOiByZXR1cm4gQXdzLlNUQUNLX05BTUU7XG4gICAgICBjYXNlICdBV1M6Ok5vVmFsdWUnOiByZXR1cm4gQXdzLk5PX1ZBTFVFO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNwZWNpYWxDYXNlU3ViUmVmcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodmFsdWUgaW4gdGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXJzW3ZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLmluZGV4T2YoJzo6JykgPT09IC0xID8gdW5kZWZpbmVkOiAnJHsnICsgdmFsdWUgKyAnfSc7XG4gIH1cblxuICBwcml2YXRlIGdldCBwYXJhbWV0ZXJzKCk6IHsgW3BhcmFtZXRlck5hbWU6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhcmFtZXRlcnMgfHwge307XG4gIH1cbn1cbiJdfQ==