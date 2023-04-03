"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arn = exports.ArnFormat = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_fn_1 = require("./cfn-fn");
const token_1 = require("./token");
const util_1 = require("./util");
/**
 * An enum representing the various ARN formats that different services use.
 */
var ArnFormat;
(function (ArnFormat) {
    /**
     * This represents a format where there is no 'resourceName' part.
     * This format is used for S3 resources,
     * like 'arn:aws:s3:::bucket'.
     * Everything after the last colon is considered the 'resource',
     * even if it contains slashes,
     * like in 'arn:aws:s3:::bucket/object.zip'.
     */
    ArnFormat["NO_RESOURCE_NAME"] = "arn:aws:service:region:account:resource";
    /**
     * This represents a format where the 'resource' and 'resourceName'
     * parts are separated with a colon.
     * Like in: 'arn:aws:service:region:account:resource:resourceName'.
     * Everything after the last colon is considered the 'resourceName',
     * even if it contains slashes,
     * like in 'arn:aws:apigateway:region:account:resource:/test/mydemoresource/*'.
     */
    ArnFormat["COLON_RESOURCE_NAME"] = "arn:aws:service:region:account:resource:resourceName";
    /**
     * This represents a format where the 'resource' and 'resourceName'
     * parts are separated with a slash.
     * Like in: 'arn:aws:service:region:account:resource/resourceName'.
     * Everything after the separating slash is considered the 'resourceName',
     * even if it contains colons,
     * like in 'arn:aws:cognito-sync:region:account:identitypool/us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla'.
     */
    ArnFormat["SLASH_RESOURCE_NAME"] = "arn:aws:service:region:account:resource/resourceName";
    /**
     * This represents a format where the 'resource' and 'resourceName'
     * parts are seperated with a slash,
     * but there is also an additional slash after the colon separating 'account' from 'resource'.
     * Like in: 'arn:aws:service:region:account:/resource/resourceName'.
     * Note that the leading slash is _not_ included in the parsed 'resource' part.
     */
    ArnFormat["SLASH_RESOURCE_SLASH_RESOURCE_NAME"] = "arn:aws:service:region:account:/resource/resourceName";
})(ArnFormat = exports.ArnFormat || (exports.ArnFormat = {}));
class Arn {
    constructor() { }
    /**
     * Creates an ARN from components.
     *
     * If `partition`, `region` or `account` are not specified, the stack's
     * partition, region and account will be used.
     *
     * If any component is the empty string, an empty string will be inserted
     * into the generated ARN at the location that component corresponds to.
     *
     * The ARN will be formatted as follows:
     *
     *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}
     *
     * The required ARN pieces that are omitted will be taken from the stack that
     * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
     * can be 'undefined'.
     */
    static format(components, stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ArnComponents(components);
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.format);
            }
            throw error;
        }
        const partition = components.partition ?? stack?.partition;
        const region = components.region ?? stack?.region;
        const account = components.account ?? stack?.account;
        // Catch both 'null' and 'undefined'
        if (partition == null || region == null || account == null) {
            throw new Error(`Arn.format: partition (${partition}), region (${region}), and account (${account}) must all be passed if stack is not passed.`);
        }
        const sep = components.sep ?? (components.arnFormat === ArnFormat.COLON_RESOURCE_NAME ? ':' : '/');
        const values = [
            'arn', ':', partition, ':', components.service, ':', region, ':', account, ':',
            ...(components.arnFormat === ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME ? ['/'] : []),
            components.resource,
        ];
        if (sep !== '/' && sep !== ':' && sep !== '') {
            throw new Error('resourcePathSep may only be ":", "/" or an empty string');
        }
        if (components.resourceName != null) {
            values.push(sep);
            values.push(components.resourceName);
        }
        return values.join('');
    }
    /**
     * Given an ARN, parses it and returns components.
     *
     * IF THE ARN IS A CONCRETE STRING...
     *
     * ...it will be parsed and validated. The separator (`sep`) will be set to '/'
     * if the 6th component includes a '/', in which case, `resource` will be set
     * to the value before the '/' and `resourceName` will be the rest. In case
     * there is no '/', `resource` will be set to the 6th components and
     * `resourceName` will be set to the rest of the string.
     *
     * IF THE ARN IS A TOKEN...
     *
     * ...it cannot be validated, since we don't have the actual value yet at the
     * time of this function call. You will have to supply `sepIfToken` and
     * whether or not ARNs of the expected format usually have resource names
     * in order to parse it properly. The resulting `ArnComponents` object will
     * contain tokens for the subexpressions of the ARN, not string literals.
     *
     * If the resource name could possibly contain the separator char, the actual
     * resource name cannot be properly parsed. This only occurs if the separator
     * char is '/', and happens for example for S3 object ARNs, IAM Role ARNs,
     * IAM OIDC Provider ARNs, etc. To properly extract the resource name from a
     * Tokenized ARN, you must know the resource type and call
     * `Arn.extractResourceName`.
     *
     * @param arn The ARN to parse
     * @param sepIfToken The separator used to separate resource from resourceName
     * @param hasName Whether there is a name component in the ARN at all. For
     * example, SNS Topics ARNs have the 'resource' component contain the topic
     * name, and no 'resourceName' component.
     *
     * @returns an ArnComponents object which allows access to the various
     * components of the ARN.
     *
     * @returns an ArnComponents object which allows access to the various
     *      components of the ARN.
     *
     * @deprecated use split instead
     */
    static parse(arn, sepIfToken = '/', hasName = true) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Arn#parse", "use split instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.parse);
            }
            throw error;
        }
        let arnFormat;
        if (!hasName) {
            arnFormat = ArnFormat.NO_RESOURCE_NAME;
        }
        else {
            arnFormat = sepIfToken === '/' ? ArnFormat.SLASH_RESOURCE_NAME : ArnFormat.COLON_RESOURCE_NAME;
        }
        return this.split(arn, arnFormat);
    }
    /**
     * Splits the provided ARN into its components.
     * Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
     * and a Token representing a dynamic CloudFormation expression
     * (in which case the returned components will also be dynamic CloudFormation expressions,
     * encoded as Tokens).
     *
     * @param arn the ARN to split into its components
     * @param arnFormat the expected format of 'arn' - depends on what format the service 'arn' represents uses
     */
    static split(arn, arnFormat) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ArnFormat(arnFormat);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.split);
            }
            throw error;
        }
        const components = parseArnShape(arn);
        if (components === 'token') {
            return parseTokenArn(arn, arnFormat);
        }
        const [, partition, service, region, account, resourceTypeOrName, ...rest] = components;
        let resource;
        let resourceName;
        let sep;
        let resourcePartStartIndex = 0;
        let detectedArnFormat;
        let slashIndex = resourceTypeOrName.indexOf('/');
        if (slashIndex === 0) {
            // new-style ARNs are of the form 'arn:aws:s4:us-west-1:12345:/resource-type/resource-name'
            slashIndex = resourceTypeOrName.indexOf('/', 1);
            resourcePartStartIndex = 1;
            detectedArnFormat = ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME;
        }
        if (slashIndex !== -1) {
            // the slash is only a separator if ArnFormat is not NO_RESOURCE_NAME
            if (arnFormat === ArnFormat.NO_RESOURCE_NAME) {
                sep = undefined;
                slashIndex = -1;
                detectedArnFormat = ArnFormat.NO_RESOURCE_NAME;
            }
            else {
                sep = '/';
                detectedArnFormat = resourcePartStartIndex === 0
                    ? ArnFormat.SLASH_RESOURCE_NAME
                    // need to repeat this here, as otherwise the compiler thinks 'detectedArnFormat' is not initialized in all paths
                    : ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME;
            }
        }
        else if (rest.length > 0) {
            sep = ':';
            slashIndex = -1;
            detectedArnFormat = ArnFormat.COLON_RESOURCE_NAME;
        }
        else {
            sep = undefined;
            detectedArnFormat = ArnFormat.NO_RESOURCE_NAME;
        }
        if (slashIndex !== -1) {
            resource = resourceTypeOrName.substring(resourcePartStartIndex, slashIndex);
            resourceName = resourceTypeOrName.substring(slashIndex + 1);
        }
        else {
            resource = resourceTypeOrName;
        }
        if (rest.length > 0) {
            if (!resourceName) {
                resourceName = '';
            }
            else {
                resourceName += ':';
            }
            resourceName += rest.join(':');
        }
        // "|| undefined" will cause empty strings to be treated as "undefined".
        // Optional ARN attributes (e.g. region, account) should return as empty string
        // if they are provided as such.
        return util_1.filterUndefined({
            service: service || undefined,
            resource: resource || undefined,
            partition: partition || undefined,
            region,
            account,
            resourceName,
            sep,
            arnFormat: detectedArnFormat,
        });
    }
    /**
     * Extract the full resource name from an ARN
     *
     * Necessary for resource names (paths) that may contain the separator, like
     * `arn:aws:iam::111111111111:role/path/to/role/name`.
     *
     * Only works if we statically know the expected `resourceType` beforehand, since we're going
     * to use that to split the string on ':<resourceType>/' (and take the right-hand side).
     *
     * We can't extract the 'resourceType' from the ARN at hand, because CloudFormation Expressions
     * only allow literals in the 'separator' argument to `{ Fn::Split }`, and so it can't be
     * `{ Fn::Select: [5, { Fn::Split: [':', ARN] }}`.
     *
     * Only necessary for ARN formats for which the type-name separator is `/`.
     */
    static extractResourceName(arn, resourceType) {
        const components = parseArnShape(arn);
        if (components === 'token') {
            return cfn_fn_1.Fn.select(1, cfn_fn_1.Fn.split(`:${resourceType}/`, arn));
        }
        // Apparently we could just parse this right away. Validate that we got the right
        // resource type (to notify authors of incorrect assumptions right away).
        const parsed = Arn.split(arn, ArnFormat.SLASH_RESOURCE_NAME);
        if (!token_1.Token.isUnresolved(parsed.resource) && parsed.resource !== resourceType) {
            throw new Error(`Expected resource type '${resourceType}' in ARN, got '${parsed.resource}' in '${arn}'`);
        }
        if (!parsed.resourceName) {
            throw new Error(`Expected resource name in ARN, didn't find one: '${arn}'`);
        }
        return parsed.resourceName;
    }
}
exports.Arn = Arn;
_a = JSII_RTTI_SYMBOL_1;
Arn[_a] = { fqn: "@aws-cdk/core.Arn", version: "0.0.0" };
/**
 * Given a Token evaluating to ARN, parses it and returns components.
 *
 * The ARN cannot be validated, since we don't have the actual value yet
 * at the time of this function call. You will have to know the separator
 * and the type of ARN.
 *
 * The resulting `ArnComponents` object will contain tokens for the
 * subexpressions of the ARN, not string literals.
 *
 * WARNING: this function cannot properly parse the complete final
 * 'resourceName' part if it contains colons,
 * like 'arn:aws:cognito-sync:region:account:identitypool/us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla'.
 *
 * @param arnToken The input token that contains an ARN
 * @param arnFormat the expected format of 'arn' - depends on what format the service the ARN represents uses
 */
function parseTokenArn(arnToken, arnFormat) {
    // ARN looks like:
    // arn:partition:service:region:account:resource
    // arn:partition:service:region:account:resource:resourceName
    // arn:partition:service:region:account:resource/resourceName
    // arn:partition:service:region:account:/resource/resourceName
    const components = cfn_fn_1.Fn.split(':', arnToken);
    const partition = cfn_fn_1.Fn.select(1, components).toString();
    const service = cfn_fn_1.Fn.select(2, components).toString();
    const region = cfn_fn_1.Fn.select(3, components).toString();
    const account = cfn_fn_1.Fn.select(4, components).toString();
    let resource;
    let resourceName;
    let sep;
    if (arnFormat === ArnFormat.NO_RESOURCE_NAME || arnFormat === ArnFormat.COLON_RESOURCE_NAME) {
        // we know that the 'resource' part will always be the 6th segment in this case
        resource = cfn_fn_1.Fn.select(5, components);
        if (arnFormat === ArnFormat.COLON_RESOURCE_NAME) {
            resourceName = cfn_fn_1.Fn.select(6, components);
            sep = ':';
        }
        else {
            resourceName = undefined;
            sep = undefined;
        }
    }
    else {
        // we know that the 'resource' and 'resourceName' parts are separated by slash here,
        // so we split the 6th segment from the colon-separated ones with a slash
        const lastComponents = cfn_fn_1.Fn.split('/', cfn_fn_1.Fn.select(5, components));
        if (arnFormat === ArnFormat.SLASH_RESOURCE_NAME) {
            resource = cfn_fn_1.Fn.select(0, lastComponents);
            resourceName = cfn_fn_1.Fn.select(1, lastComponents);
        }
        else {
            // arnFormat is ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
            // which means there's an extra slash there at the beginning that we need to skip
            resource = cfn_fn_1.Fn.select(1, lastComponents);
            resourceName = cfn_fn_1.Fn.select(2, lastComponents);
        }
        sep = '/';
    }
    return { partition, service, region, account, resource, resourceName, sep, arnFormat };
}
/**
 * Validate that a string is either unparseable or looks mostly like an ARN
 */
function parseArnShape(arn) {
    // assume anything that starts with 'arn:' is an ARN,
    // so we can report better errors
    const looksLikeArn = arn.startsWith('arn:');
    if (!looksLikeArn) {
        if (token_1.Token.isUnresolved(arn)) {
            return 'token';
        }
        else {
            throw new Error(`ARNs must start with "arn:" and have at least 6 components: ${arn}`);
        }
    }
    // If the ARN merely contains Tokens, but otherwise *looks* mostly like an ARN,
    // it's a string of the form 'arn:${partition}:service:${region}:${account}:resource/xyz'.
    // Parse fields out to the best of our ability.
    // Tokens won't contain ":", so this won't break them.
    const components = arn.split(':');
    const partition = components.length > 1 ? components[1] : undefined;
    if (!partition) {
        throw new Error('The `partition` component (2nd component) of an ARN is required: ' + arn);
    }
    const service = components.length > 2 ? components[2] : undefined;
    if (!service) {
        throw new Error('The `service` component (3rd component) of an ARN is required: ' + arn);
    }
    const resource = components.length > 5 ? components[5] : undefined;
    if (!resource) {
        throw new Error('The `resource` component (6th component) of an ARN is required: ' + arn);
    }
    // Region can be missing in global ARNs (such as used by IAM)
    // Account can be missing in some ARN types (such as used for S3 buckets)
    return components;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUE4QjtBQUU5QixtQ0FBZ0M7QUFDaEMsaUNBQXlDO0FBRXpDOztHQUVHO0FBQ0gsSUFBWSxTQXVDWDtBQXZDRCxXQUFZLFNBQVM7SUFDbkI7Ozs7Ozs7T0FPRztJQUNILHlFQUE0RCxDQUFBO0lBRTVEOzs7Ozs7O09BT0c7SUFDSCx5RkFBNEUsQ0FBQTtJQUU1RTs7Ozs7OztPQU9HO0lBQ0gseUZBQTRFLENBQUE7SUFFNUU7Ozs7OztPQU1HO0lBQ0gseUdBQTRGLENBQUE7QUFDOUYsQ0FBQyxFQXZDVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXVDcEI7QUFtRUQsTUFBYSxHQUFHO0lBd05kLGlCQUF5QjtJQXZOekI7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQXlCLEVBQUUsS0FBYTs7Ozs7Ozs7Ozs7UUFDM0QsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsSUFBSSxLQUFLLEVBQUUsU0FBUyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUM7UUFFckQsb0NBQW9DO1FBQ3BDLElBQUksU0FBUyxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDMUQsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsU0FBUyxjQUFjLE1BQU0sbUJBQW1CLE9BQU8sOENBQThDLENBQUMsQ0FBQztTQUNsSjtRQUVELE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxtQkFB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QUErRTtJQUMvRSwwRkFBMEY7SUFDMUYsK0NBQStDO0lBQy9DLHNEQUFzRDtJQUN0RCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWxDLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwRSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBbUUsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUM1RjtJQUVELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNsRSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxpRUFBaUUsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUMxRjtJQUVELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNuRSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUMzRjtJQUVELDZEQUE2RDtJQUU3RCx5RUFBeUU7SUFFekUsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZuIH0gZnJvbSAnLi9jZm4tZm4nO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgeyBmaWx0ZXJVbmRlZmluZWQgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEFuIGVudW0gcmVwcmVzZW50aW5nIHRoZSB2YXJpb3VzIEFSTiBmb3JtYXRzIHRoYXQgZGlmZmVyZW50IHNlcnZpY2VzIHVzZS5cbiAqL1xuZXhwb3J0IGVudW0gQXJuRm9ybWF0IHtcbiAgLyoqXG4gICAqIFRoaXMgcmVwcmVzZW50cyBhIGZvcm1hdCB3aGVyZSB0aGVyZSBpcyBubyAncmVzb3VyY2VOYW1lJyBwYXJ0LlxuICAgKiBUaGlzIGZvcm1hdCBpcyB1c2VkIGZvciBTMyByZXNvdXJjZXMsXG4gICAqIGxpa2UgJ2Fybjphd3M6czM6OjpidWNrZXQnLlxuICAgKiBFdmVyeXRoaW5nIGFmdGVyIHRoZSBsYXN0IGNvbG9uIGlzIGNvbnNpZGVyZWQgdGhlICdyZXNvdXJjZScsXG4gICAqIGV2ZW4gaWYgaXQgY29udGFpbnMgc2xhc2hlcyxcbiAgICogbGlrZSBpbiAnYXJuOmF3czpzMzo6OmJ1Y2tldC9vYmplY3QuemlwJy5cbiAgICovXG4gIE5PX1JFU09VUkNFX05BTUUgPSAnYXJuOmF3czpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlc291cmNlJyxcblxuICAvKipcbiAgICogVGhpcyByZXByZXNlbnRzIGEgZm9ybWF0IHdoZXJlIHRoZSAncmVzb3VyY2UnIGFuZCAncmVzb3VyY2VOYW1lJ1xuICAgKiBwYXJ0cyBhcmUgc2VwYXJhdGVkIHdpdGggYSBjb2xvbi5cbiAgICogTGlrZSBpbjogJ2Fybjphd3M6c2VydmljZTpyZWdpb246YWNjb3VudDpyZXNvdXJjZTpyZXNvdXJjZU5hbWUnLlxuICAgKiBFdmVyeXRoaW5nIGFmdGVyIHRoZSBsYXN0IGNvbG9uIGlzIGNvbnNpZGVyZWQgdGhlICdyZXNvdXJjZU5hbWUnLFxuICAgKiBldmVuIGlmIGl0IGNvbnRhaW5zIHNsYXNoZXMsXG4gICAqIGxpa2UgaW4gJ2Fybjphd3M6YXBpZ2F0ZXdheTpyZWdpb246YWNjb3VudDpyZXNvdXJjZTovdGVzdC9teWRlbW9yZXNvdXJjZS8qJy5cbiAgICovXG4gIENPTE9OX1JFU09VUkNFX05BTUUgPSAnYXJuOmF3czpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlc291cmNlOnJlc291cmNlTmFtZScsXG5cbiAgLyoqXG4gICAqIFRoaXMgcmVwcmVzZW50cyBhIGZvcm1hdCB3aGVyZSB0aGUgJ3Jlc291cmNlJyBhbmQgJ3Jlc291cmNlTmFtZSdcbiAgICogcGFydHMgYXJlIHNlcGFyYXRlZCB3aXRoIGEgc2xhc2guXG4gICAqIExpa2UgaW46ICdhcm46YXdzOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2UvcmVzb3VyY2VOYW1lJy5cbiAgICogRXZlcnl0aGluZyBhZnRlciB0aGUgc2VwYXJhdGluZyBzbGFzaCBpcyBjb25zaWRlcmVkIHRoZSAncmVzb3VyY2VOYW1lJyxcbiAgICogZXZlbiBpZiBpdCBjb250YWlucyBjb2xvbnMsXG4gICAqIGxpa2UgaW4gJ2Fybjphd3M6Y29nbml0by1zeW5jOnJlZ2lvbjphY2NvdW50OmlkZW50aXR5cG9vbC91cy1lYXN0LTE6MWExYTFhMWEtZmZmZi0xMTExLTk5OTktMTIzNDU2Nzg6YmxhJy5cbiAgICovXG4gIFNMQVNIX1JFU09VUkNFX05BTUUgPSAnYXJuOmF3czpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlc291cmNlL3Jlc291cmNlTmFtZScsXG5cbiAgLyoqXG4gICAqIFRoaXMgcmVwcmVzZW50cyBhIGZvcm1hdCB3aGVyZSB0aGUgJ3Jlc291cmNlJyBhbmQgJ3Jlc291cmNlTmFtZSdcbiAgICogcGFydHMgYXJlIHNlcGVyYXRlZCB3aXRoIGEgc2xhc2gsXG4gICAqIGJ1dCB0aGVyZSBpcyBhbHNvIGFuIGFkZGl0aW9uYWwgc2xhc2ggYWZ0ZXIgdGhlIGNvbG9uIHNlcGFyYXRpbmcgJ2FjY291bnQnIGZyb20gJ3Jlc291cmNlJy5cbiAgICogTGlrZSBpbjogJ2Fybjphd3M6c2VydmljZTpyZWdpb246YWNjb3VudDovcmVzb3VyY2UvcmVzb3VyY2VOYW1lJy5cbiAgICogTm90ZSB0aGF0IHRoZSBsZWFkaW5nIHNsYXNoIGlzIF9ub3RfIGluY2x1ZGVkIGluIHRoZSBwYXJzZWQgJ3Jlc291cmNlJyBwYXJ0LlxuICAgKi9cbiAgU0xBU0hfUkVTT1VSQ0VfU0xBU0hfUkVTT1VSQ0VfTkFNRSA9ICdhcm46YXdzOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6L3Jlc291cmNlL3Jlc291cmNlTmFtZScsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJuQ29tcG9uZW50cyB7XG4gIC8qKlxuICAgKiBUaGUgcGFydGl0aW9uIHRoYXQgdGhlIHJlc291cmNlIGlzIGluLiBGb3Igc3RhbmRhcmQgQVdTIHJlZ2lvbnMsIHRoZVxuICAgKiBwYXJ0aXRpb24gaXMgYXdzLiBJZiB5b3UgaGF2ZSByZXNvdXJjZXMgaW4gb3RoZXIgcGFydGl0aW9ucywgdGhlXG4gICAqIHBhcnRpdGlvbiBpcyBhd3MtcGFydGl0aW9ubmFtZS4gRm9yIGV4YW1wbGUsIHRoZSBwYXJ0aXRpb24gZm9yIHJlc291cmNlc1xuICAgKiBpbiB0aGUgQ2hpbmEgKEJlaWppbmcpIHJlZ2lvbiBpcyBhd3MtY24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSBBV1MgcGFydGl0aW9uIHRoZSBzdGFjayBpcyBkZXBsb3llZCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHBhcnRpdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2UgbmFtZXNwYWNlIHRoYXQgaWRlbnRpZmllcyB0aGUgQVdTIHByb2R1Y3QgKGZvciBleGFtcGxlLFxuICAgKiAnczMnLCAnaWFtJywgJ2NvZGVwaXBsaW5lJykuXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpb24gdGhlIHJlc291cmNlIHJlc2lkZXMgaW4uIE5vdGUgdGhhdCB0aGUgQVJOcyBmb3Igc29tZSByZXNvdXJjZXNcbiAgICogZG8gbm90IHJlcXVpcmUgYSByZWdpb24sIHNvIHRoaXMgY29tcG9uZW50IG1pZ2h0IGJlIG9taXR0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSByZWdpb24gdGhlIHN0YWNrIGlzIGRlcGxveWVkIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIEFXUyBhY2NvdW50IHRoYXQgb3ducyB0aGUgcmVzb3VyY2UsIHdpdGhvdXQgdGhlIGh5cGhlbnMuXG4gICAqIEZvciBleGFtcGxlLCAxMjM0NTY3ODkwMTIuIE5vdGUgdGhhdCB0aGUgQVJOcyBmb3Igc29tZSByZXNvdXJjZXMgZG9uJ3RcbiAgICogcmVxdWlyZSBhbiBhY2NvdW50IG51bWJlciwgc28gdGhpcyBjb21wb25lbnQgbWlnaHQgYmUgb21pdHRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIGFjY291bnQgdGhlIHN0YWNrIGlzIGRlcGxveWVkIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogUmVzb3VyY2UgdHlwZSAoZS5nLiBcInRhYmxlXCIsIFwiYXV0b1NjYWxpbmdHcm91cFwiLCBcImNlcnRpZmljYXRlXCIpLlxuICAgKiBGb3Igc29tZSByZXNvdXJjZSB0eXBlcywgZS5nLiBTMyBidWNrZXRzLCB0aGlzIGZpZWxkIGRlZmluZXMgdGhlIGJ1Y2tldCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2U6IHN0cmluZztcblxuICAvKipcbiAgICogU2VwYXJhdG9yIGJldHdlZW4gcmVzb3VyY2UgdHlwZSBhbmQgdGhlIHJlc291cmNlLlxuICAgKlxuICAgKiBDYW4gYmUgZWl0aGVyICcvJywgJzonIG9yIGFuIGVtcHR5IHN0cmluZy4gV2lsbCBvbmx5IGJlIHVzZWQgaWYgcmVzb3VyY2VOYW1lIGlzIGRlZmluZWQuXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYXJuRm9ybWF0IGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHNlcD86IHN0cmluZztcblxuICAvKipcbiAgICogUmVzb3VyY2UgbmFtZSBvciBwYXRoIHdpdGhpbiB0aGUgcmVzb3VyY2UgKGkuZS4gUzMgYnVja2V0IG9iamVjdCBrZXkpIG9yXG4gICAqIGEgd2lsZGNhcmQgc3VjaCBhcyBgYFwiKlwiYGAuIFRoaXMgaXMgc2VydmljZS1kZXBlbmRlbnQuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzcGVjaWZpYyBBUk4gZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyBBUk4gdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdXNlcyB2YWx1ZSBvZiBgc2VwYCBhcyB0aGUgc2VwYXJhdG9yIGZvciBmb3JtYXR0aW5nLFxuICAgKiAgIGBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRWAgaWYgdGhhdCBwcm9wZXJ0eSB3YXMgYWxzbyBub3QgcHJvdmlkZWRcbiAgICovXG4gIHJlYWRvbmx5IGFybkZvcm1hdD86IEFybkZvcm1hdDtcbn1cblxuZXhwb3J0IGNsYXNzIEFybiB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIEFSTiBmcm9tIGNvbXBvbmVudHMuXG4gICAqXG4gICAqIElmIGBwYXJ0aXRpb25gLCBgcmVnaW9uYCBvciBgYWNjb3VudGAgYXJlIG5vdCBzcGVjaWZpZWQsIHRoZSBzdGFjaydzXG4gICAqIHBhcnRpdGlvbiwgcmVnaW9uIGFuZCBhY2NvdW50IHdpbGwgYmUgdXNlZC5cbiAgICpcbiAgICogSWYgYW55IGNvbXBvbmVudCBpcyB0aGUgZW1wdHkgc3RyaW5nLCBhbiBlbXB0eSBzdHJpbmcgd2lsbCBiZSBpbnNlcnRlZFxuICAgKiBpbnRvIHRoZSBnZW5lcmF0ZWQgQVJOIGF0IHRoZSBsb2NhdGlvbiB0aGF0IGNvbXBvbmVudCBjb3JyZXNwb25kcyB0by5cbiAgICpcbiAgICogVGhlIEFSTiB3aWxsIGJlIGZvcm1hdHRlZCBhcyBmb2xsb3dzOlxuICAgKlxuICAgKiAgIGFybjp7cGFydGl0aW9ufTp7c2VydmljZX06e3JlZ2lvbn06e2FjY291bnR9OntyZXNvdXJjZX17c2VwfXtyZXNvdXJjZS1uYW1lfVxuICAgKlxuICAgKiBUaGUgcmVxdWlyZWQgQVJOIHBpZWNlcyB0aGF0IGFyZSBvbWl0dGVkIHdpbGwgYmUgdGFrZW4gZnJvbSB0aGUgc3RhY2sgdGhhdFxuICAgKiB0aGUgJ3Njb3BlJyBpcyBhdHRhY2hlZCB0by4gSWYgYWxsIEFSTiBwaWVjZXMgYXJlIHN1cHBsaWVkLCB0aGUgc3VwcGxpZWQgc2NvcGVcbiAgICogY2FuIGJlICd1bmRlZmluZWQnLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JtYXQoY29tcG9uZW50czogQXJuQ29tcG9uZW50cywgc3RhY2s/OiBTdGFjayk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFydGl0aW9uID0gY29tcG9uZW50cy5wYXJ0aXRpb24gPz8gc3RhY2s/LnBhcnRpdGlvbjtcbiAgICBjb25zdCByZWdpb24gPSBjb21wb25lbnRzLnJlZ2lvbiA/PyBzdGFjaz8ucmVnaW9uO1xuICAgIGNvbnN0IGFjY291bnQgPSBjb21wb25lbnRzLmFjY291bnQgPz8gc3RhY2s/LmFjY291bnQ7XG5cbiAgICAvLyBDYXRjaCBib3RoICdudWxsJyBhbmQgJ3VuZGVmaW5lZCdcbiAgICBpZiAocGFydGl0aW9uID09IG51bGwgfHwgcmVnaW9uID09IG51bGwgfHwgYWNjb3VudCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFybi5mb3JtYXQ6IHBhcnRpdGlvbiAoJHtwYXJ0aXRpb259KSwgcmVnaW9uICgke3JlZ2lvbn0pLCBhbmQgYWNjb3VudCAoJHthY2NvdW50fSkgbXVzdCBhbGwgYmUgcGFzc2VkIGlmIHN0YWNrIGlzIG5vdCBwYXNzZWQuYCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwID0gY29tcG9uZW50cy5zZXAgPz8gKGNvbXBvbmVudHMuYXJuRm9ybWF0ID09PSBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSA/ICc6JyA6ICcvJyk7XG5cbiAgICBjb25zdCB2YWx1ZXMgPSBbXG4gICAgICAnYXJuJywgJzonLCBwYXJ0aXRpb24sICc6JywgY29tcG9uZW50cy5zZXJ2aWNlLCAnOicsIHJlZ2lvbiwgJzonLCBhY2NvdW50LCAnOicsXG4gICAgICAuLi4oY29tcG9uZW50cy5hcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FID8gWycvJ10gOiBbXSksXG4gICAgICBjb21wb25lbnRzLnJlc291cmNlLFxuICAgIF07XG5cbiAgICBpZiAoc2VwICE9PSAnLycgJiYgc2VwICE9PSAnOicgJiYgc2VwICE9PSAnJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXNvdXJjZVBhdGhTZXAgbWF5IG9ubHkgYmUgXCI6XCIsIFwiL1wiIG9yIGFuIGVtcHR5IHN0cmluZycpO1xuICAgIH1cblxuICAgIGlmIChjb21wb25lbnRzLnJlc291cmNlTmFtZSAhPSBudWxsKSB7XG4gICAgICB2YWx1ZXMucHVzaChzZXApO1xuICAgICAgdmFsdWVzLnB1c2goY29tcG9uZW50cy5yZXNvdXJjZU5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXMuam9pbignJyk7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYW4gQVJOLCBwYXJzZXMgaXQgYW5kIHJldHVybnMgY29tcG9uZW50cy5cbiAgICpcbiAgICogSUYgVEhFIEFSTiBJUyBBIENPTkNSRVRFIFNUUklORy4uLlxuICAgKlxuICAgKiAuLi5pdCB3aWxsIGJlIHBhcnNlZCBhbmQgdmFsaWRhdGVkLiBUaGUgc2VwYXJhdG9yIChgc2VwYCkgd2lsbCBiZSBzZXQgdG8gJy8nXG4gICAqIGlmIHRoZSA2dGggY29tcG9uZW50IGluY2x1ZGVzIGEgJy8nLCBpbiB3aGljaCBjYXNlLCBgcmVzb3VyY2VgIHdpbGwgYmUgc2V0XG4gICAqIHRvIHRoZSB2YWx1ZSBiZWZvcmUgdGhlICcvJyBhbmQgYHJlc291cmNlTmFtZWAgd2lsbCBiZSB0aGUgcmVzdC4gSW4gY2FzZVxuICAgKiB0aGVyZSBpcyBubyAnLycsIGByZXNvdXJjZWAgd2lsbCBiZSBzZXQgdG8gdGhlIDZ0aCBjb21wb25lbnRzIGFuZFxuICAgKiBgcmVzb3VyY2VOYW1lYCB3aWxsIGJlIHNldCB0byB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nLlxuICAgKlxuICAgKiBJRiBUSEUgQVJOIElTIEEgVE9LRU4uLi5cbiAgICpcbiAgICogLi4uaXQgY2Fubm90IGJlIHZhbGlkYXRlZCwgc2luY2Ugd2UgZG9uJ3QgaGF2ZSB0aGUgYWN0dWFsIHZhbHVlIHlldCBhdCB0aGVcbiAgICogdGltZSBvZiB0aGlzIGZ1bmN0aW9uIGNhbGwuIFlvdSB3aWxsIGhhdmUgdG8gc3VwcGx5IGBzZXBJZlRva2VuYCBhbmRcbiAgICogd2hldGhlciBvciBub3QgQVJOcyBvZiB0aGUgZXhwZWN0ZWQgZm9ybWF0IHVzdWFsbHkgaGF2ZSByZXNvdXJjZSBuYW1lc1xuICAgKiBpbiBvcmRlciB0byBwYXJzZSBpdCBwcm9wZXJseS4gVGhlIHJlc3VsdGluZyBgQXJuQ29tcG9uZW50c2Agb2JqZWN0IHdpbGxcbiAgICogY29udGFpbiB0b2tlbnMgZm9yIHRoZSBzdWJleHByZXNzaW9ucyBvZiB0aGUgQVJOLCBub3Qgc3RyaW5nIGxpdGVyYWxzLlxuICAgKlxuICAgKiBJZiB0aGUgcmVzb3VyY2UgbmFtZSBjb3VsZCBwb3NzaWJseSBjb250YWluIHRoZSBzZXBhcmF0b3IgY2hhciwgdGhlIGFjdHVhbFxuICAgKiByZXNvdXJjZSBuYW1lIGNhbm5vdCBiZSBwcm9wZXJseSBwYXJzZWQuIFRoaXMgb25seSBvY2N1cnMgaWYgdGhlIHNlcGFyYXRvclxuICAgKiBjaGFyIGlzICcvJywgYW5kIGhhcHBlbnMgZm9yIGV4YW1wbGUgZm9yIFMzIG9iamVjdCBBUk5zLCBJQU0gUm9sZSBBUk5zLFxuICAgKiBJQU0gT0lEQyBQcm92aWRlciBBUk5zLCBldGMuIFRvIHByb3Blcmx5IGV4dHJhY3QgdGhlIHJlc291cmNlIG5hbWUgZnJvbSBhXG4gICAqIFRva2VuaXplZCBBUk4sIHlvdSBtdXN0IGtub3cgdGhlIHJlc291cmNlIHR5cGUgYW5kIGNhbGxcbiAgICogYEFybi5leHRyYWN0UmVzb3VyY2VOYW1lYC5cbiAgICpcbiAgICogQHBhcmFtIGFybiBUaGUgQVJOIHRvIHBhcnNlXG4gICAqIEBwYXJhbSBzZXBJZlRva2VuIFRoZSBzZXBhcmF0b3IgdXNlZCB0byBzZXBhcmF0ZSByZXNvdXJjZSBmcm9tIHJlc291cmNlTmFtZVxuICAgKiBAcGFyYW0gaGFzTmFtZSBXaGV0aGVyIHRoZXJlIGlzIGEgbmFtZSBjb21wb25lbnQgaW4gdGhlIEFSTiBhdCBhbGwuIEZvclxuICAgKiBleGFtcGxlLCBTTlMgVG9waWNzIEFSTnMgaGF2ZSB0aGUgJ3Jlc291cmNlJyBjb21wb25lbnQgY29udGFpbiB0aGUgdG9waWNcbiAgICogbmFtZSwgYW5kIG5vICdyZXNvdXJjZU5hbWUnIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHJldHVybnMgYW4gQXJuQ29tcG9uZW50cyBvYmplY3Qgd2hpY2ggYWxsb3dzIGFjY2VzcyB0byB0aGUgdmFyaW91c1xuICAgKiBjb21wb25lbnRzIG9mIHRoZSBBUk4uXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIEFybkNvbXBvbmVudHMgb2JqZWN0IHdoaWNoIGFsbG93cyBhY2Nlc3MgdG8gdGhlIHZhcmlvdXNcbiAgICogICAgICBjb21wb25lbnRzIG9mIHRoZSBBUk4uXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBzcGxpdCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGFybjogc3RyaW5nLCBzZXBJZlRva2VuOiBzdHJpbmcgPSAnLycsIGhhc05hbWU6IGJvb2xlYW4gPSB0cnVlKTogQXJuQ29tcG9uZW50cyB7XG4gICAgbGV0IGFybkZvcm1hdDogQXJuRm9ybWF0O1xuICAgIGlmICghaGFzTmFtZSkge1xuICAgICAgYXJuRm9ybWF0ID0gQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFybkZvcm1hdCA9IHNlcElmVG9rZW4gPT09ICcvJyA/IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FIDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNwbGl0KGFybiwgYXJuRm9ybWF0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdHMgdGhlIHByb3ZpZGVkIEFSTiBpbnRvIGl0cyBjb21wb25lbnRzLlxuICAgKiBXb3JrcyBib3RoIGlmICdhcm4nIGlzIGEgc3RyaW5nIGxpa2UgJ2Fybjphd3M6czM6OjpidWNrZXQnLFxuICAgKiBhbmQgYSBUb2tlbiByZXByZXNlbnRpbmcgYSBkeW5hbWljIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb25cbiAgICogKGluIHdoaWNoIGNhc2UgdGhlIHJldHVybmVkIGNvbXBvbmVudHMgd2lsbCBhbHNvIGJlIGR5bmFtaWMgQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbnMsXG4gICAqIGVuY29kZWQgYXMgVG9rZW5zKS5cbiAgICpcbiAgICogQHBhcmFtIGFybiB0aGUgQVJOIHRvIHNwbGl0IGludG8gaXRzIGNvbXBvbmVudHNcbiAgICogQHBhcmFtIGFybkZvcm1hdCB0aGUgZXhwZWN0ZWQgZm9ybWF0IG9mICdhcm4nIC0gZGVwZW5kcyBvbiB3aGF0IGZvcm1hdCB0aGUgc2VydmljZSAnYXJuJyByZXByZXNlbnRzIHVzZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3BsaXQoYXJuOiBzdHJpbmcsIGFybkZvcm1hdDogQXJuRm9ybWF0KTogQXJuQ29tcG9uZW50cyB7XG4gICAgY29uc3QgY29tcG9uZW50cyA9IHBhcnNlQXJuU2hhcGUoYXJuKTtcbiAgICBpZiAoY29tcG9uZW50cyA9PT0gJ3Rva2VuJykge1xuICAgICAgcmV0dXJuIHBhcnNlVG9rZW5Bcm4oYXJuLCBhcm5Gb3JtYXQpO1xuICAgIH1cblxuICAgIGNvbnN0IFssIHBhcnRpdGlvbiwgc2VydmljZSwgcmVnaW9uLCBhY2NvdW50LCByZXNvdXJjZVR5cGVPck5hbWUsIC4uLnJlc3RdID0gY29tcG9uZW50cztcblxuICAgIGxldCByZXNvdXJjZTogc3RyaW5nO1xuICAgIGxldCByZXNvdXJjZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgc2VwOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgbGV0IHJlc291cmNlUGFydFN0YXJ0SW5kZXggPSAwO1xuICAgIGxldCBkZXRlY3RlZEFybkZvcm1hdDogQXJuRm9ybWF0O1xuXG4gICAgbGV0IHNsYXNoSW5kZXggPSByZXNvdXJjZVR5cGVPck5hbWUuaW5kZXhPZignLycpO1xuICAgIGlmIChzbGFzaEluZGV4ID09PSAwKSB7XG4gICAgICAvLyBuZXctc3R5bGUgQVJOcyBhcmUgb2YgdGhlIGZvcm0gJ2Fybjphd3M6czQ6dXMtd2VzdC0xOjEyMzQ1Oi9yZXNvdXJjZS10eXBlL3Jlc291cmNlLW5hbWUnXG4gICAgICBzbGFzaEluZGV4ID0gcmVzb3VyY2VUeXBlT3JOYW1lLmluZGV4T2YoJy8nLCAxKTtcbiAgICAgIHJlc291cmNlUGFydFN0YXJ0SW5kZXggPSAxO1xuICAgICAgZGV0ZWN0ZWRBcm5Gb3JtYXQgPSBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfU0xBU0hfUkVTT1VSQ0VfTkFNRTtcbiAgICB9XG4gICAgaWYgKHNsYXNoSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyB0aGUgc2xhc2ggaXMgb25seSBhIHNlcGFyYXRvciBpZiBBcm5Gb3JtYXQgaXMgbm90IE5PX1JFU09VUkNFX05BTUVcbiAgICAgIGlmIChhcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FKSB7XG4gICAgICAgIHNlcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgc2xhc2hJbmRleCA9IC0xO1xuICAgICAgICBkZXRlY3RlZEFybkZvcm1hdCA9IEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VwID0gJy8nO1xuICAgICAgICBkZXRlY3RlZEFybkZvcm1hdCA9IHJlc291cmNlUGFydFN0YXJ0SW5kZXggPT09IDBcbiAgICAgICAgICA/IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FXG4gICAgICAgICAgLy8gbmVlZCB0byByZXBlYXQgdGhpcyBoZXJlLCBhcyBvdGhlcndpc2UgdGhlIGNvbXBpbGVyIHRoaW5rcyAnZGV0ZWN0ZWRBcm5Gb3JtYXQnIGlzIG5vdCBpbml0aWFsaXplZCBpbiBhbGwgcGF0aHNcbiAgICAgICAgICA6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzdC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXAgPSAnOic7XG4gICAgICBzbGFzaEluZGV4ID0gLTE7XG4gICAgICBkZXRlY3RlZEFybkZvcm1hdCA9IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXAgPSB1bmRlZmluZWQ7XG4gICAgICBkZXRlY3RlZEFybkZvcm1hdCA9IEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FO1xuICAgIH1cblxuICAgIGlmIChzbGFzaEluZGV4ICE9PSAtMSkge1xuICAgICAgcmVzb3VyY2UgPSByZXNvdXJjZVR5cGVPck5hbWUuc3Vic3RyaW5nKHJlc291cmNlUGFydFN0YXJ0SW5kZXgsIHNsYXNoSW5kZXgpO1xuICAgICAgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VUeXBlT3JOYW1lLnN1YnN0cmluZyhzbGFzaEluZGV4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc291cmNlID0gcmVzb3VyY2VUeXBlT3JOYW1lO1xuICAgIH1cblxuICAgIGlmIChyZXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghcmVzb3VyY2VOYW1lKSB7XG4gICAgICAgIHJlc291cmNlTmFtZSA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb3VyY2VOYW1lICs9ICc6JztcbiAgICAgIH1cblxuICAgICAgcmVzb3VyY2VOYW1lICs9IHJlc3Quam9pbignOicpO1xuICAgIH1cblxuICAgIC8vIFwifHwgdW5kZWZpbmVkXCIgd2lsbCBjYXVzZSBlbXB0eSBzdHJpbmdzIHRvIGJlIHRyZWF0ZWQgYXMgXCJ1bmRlZmluZWRcIi5cbiAgICAvLyBPcHRpb25hbCBBUk4gYXR0cmlidXRlcyAoZS5nLiByZWdpb24sIGFjY291bnQpIHNob3VsZCByZXR1cm4gYXMgZW1wdHkgc3RyaW5nXG4gICAgLy8gaWYgdGhleSBhcmUgcHJvdmlkZWQgYXMgc3VjaC5cbiAgICByZXR1cm4gZmlsdGVyVW5kZWZpbmVkKHtcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2UgfHwgdW5kZWZpbmVkLFxuICAgICAgcmVzb3VyY2U6IHJlc291cmNlIHx8IHVuZGVmaW5lZCxcbiAgICAgIHBhcnRpdGlvbjogcGFydGl0aW9uIHx8IHVuZGVmaW5lZCxcbiAgICAgIHJlZ2lvbixcbiAgICAgIGFjY291bnQsXG4gICAgICByZXNvdXJjZU5hbWUsXG4gICAgICBzZXAsXG4gICAgICBhcm5Gb3JtYXQ6IGRldGVjdGVkQXJuRm9ybWF0LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIGZ1bGwgcmVzb3VyY2UgbmFtZSBmcm9tIGFuIEFSTlxuICAgKlxuICAgKiBOZWNlc3NhcnkgZm9yIHJlc291cmNlIG5hbWVzIChwYXRocykgdGhhdCBtYXkgY29udGFpbiB0aGUgc2VwYXJhdG9yLCBsaWtlXG4gICAqIGBhcm46YXdzOmlhbTo6MTExMTExMTExMTExOnJvbGUvcGF0aC90by9yb2xlL25hbWVgLlxuICAgKlxuICAgKiBPbmx5IHdvcmtzIGlmIHdlIHN0YXRpY2FsbHkga25vdyB0aGUgZXhwZWN0ZWQgYHJlc291cmNlVHlwZWAgYmVmb3JlaGFuZCwgc2luY2Ugd2UncmUgZ29pbmdcbiAgICogdG8gdXNlIHRoYXQgdG8gc3BsaXQgdGhlIHN0cmluZyBvbiAnOjxyZXNvdXJjZVR5cGU+LycgKGFuZCB0YWtlIHRoZSByaWdodC1oYW5kIHNpZGUpLlxuICAgKlxuICAgKiBXZSBjYW4ndCBleHRyYWN0IHRoZSAncmVzb3VyY2VUeXBlJyBmcm9tIHRoZSBBUk4gYXQgaGFuZCwgYmVjYXVzZSBDbG91ZEZvcm1hdGlvbiBFeHByZXNzaW9uc1xuICAgKiBvbmx5IGFsbG93IGxpdGVyYWxzIGluIHRoZSAnc2VwYXJhdG9yJyBhcmd1bWVudCB0byBgeyBGbjo6U3BsaXQgfWAsIGFuZCBzbyBpdCBjYW4ndCBiZVxuICAgKiBgeyBGbjo6U2VsZWN0OiBbNSwgeyBGbjo6U3BsaXQ6IFsnOicsIEFSTl0gfX1gLlxuICAgKlxuICAgKiBPbmx5IG5lY2Vzc2FyeSBmb3IgQVJOIGZvcm1hdHMgZm9yIHdoaWNoIHRoZSB0eXBlLW5hbWUgc2VwYXJhdG9yIGlzIGAvYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXh0cmFjdFJlc291cmNlTmFtZShhcm46IHN0cmluZywgcmVzb3VyY2VUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBwYXJzZUFyblNoYXBlKGFybik7XG4gICAgaWYgKGNvbXBvbmVudHMgPT09ICd0b2tlbicpIHtcbiAgICAgIHJldHVybiBGbi5zZWxlY3QoMSwgRm4uc3BsaXQoYDoke3Jlc291cmNlVHlwZX0vYCwgYXJuKSk7XG4gICAgfVxuXG4gICAgLy8gQXBwYXJlbnRseSB3ZSBjb3VsZCBqdXN0IHBhcnNlIHRoaXMgcmlnaHQgYXdheS4gVmFsaWRhdGUgdGhhdCB3ZSBnb3QgdGhlIHJpZ2h0XG4gICAgLy8gcmVzb3VyY2UgdHlwZSAodG8gbm90aWZ5IGF1dGhvcnMgb2YgaW5jb3JyZWN0IGFzc3VtcHRpb25zIHJpZ2h0IGF3YXkpLlxuICAgIGNvbnN0IHBhcnNlZCA9IEFybi5zcGxpdChhcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChwYXJzZWQucmVzb3VyY2UpICYmIHBhcnNlZC5yZXNvdXJjZSAhPT0gcmVzb3VyY2VUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlc291cmNlIHR5cGUgJyR7cmVzb3VyY2VUeXBlfScgaW4gQVJOLCBnb3QgJyR7cGFyc2VkLnJlc291cmNlfScgaW4gJyR7YXJufSdgKTtcbiAgICB9XG4gICAgaWYgKCFwYXJzZWQucmVzb3VyY2VOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlc291cmNlIG5hbWUgaW4gQVJOLCBkaWRuJ3QgZmluZCBvbmU6ICcke2Fybn0nYCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQucmVzb3VyY2VOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgVG9rZW4gZXZhbHVhdGluZyB0byBBUk4sIHBhcnNlcyBpdCBhbmQgcmV0dXJucyBjb21wb25lbnRzLlxuICpcbiAqIFRoZSBBUk4gY2Fubm90IGJlIHZhbGlkYXRlZCwgc2luY2Ugd2UgZG9uJ3QgaGF2ZSB0aGUgYWN0dWFsIHZhbHVlIHlldFxuICogYXQgdGhlIHRpbWUgb2YgdGhpcyBmdW5jdGlvbiBjYWxsLiBZb3Ugd2lsbCBoYXZlIHRvIGtub3cgdGhlIHNlcGFyYXRvclxuICogYW5kIHRoZSB0eXBlIG9mIEFSTi5cbiAqXG4gKiBUaGUgcmVzdWx0aW5nIGBBcm5Db21wb25lbnRzYCBvYmplY3Qgd2lsbCBjb250YWluIHRva2VucyBmb3IgdGhlXG4gKiBzdWJleHByZXNzaW9ucyBvZiB0aGUgQVJOLCBub3Qgc3RyaW5nIGxpdGVyYWxzLlxuICpcbiAqIFdBUk5JTkc6IHRoaXMgZnVuY3Rpb24gY2Fubm90IHByb3Blcmx5IHBhcnNlIHRoZSBjb21wbGV0ZSBmaW5hbFxuICogJ3Jlc291cmNlTmFtZScgcGFydCBpZiBpdCBjb250YWlucyBjb2xvbnMsXG4gKiBsaWtlICdhcm46YXdzOmNvZ25pdG8tc3luYzpyZWdpb246YWNjb3VudDppZGVudGl0eXBvb2wvdXMtZWFzdC0xOjFhMWExYTFhLWZmZmYtMTExMS05OTk5LTEyMzQ1Njc4OmJsYScuXG4gKlxuICogQHBhcmFtIGFyblRva2VuIFRoZSBpbnB1dCB0b2tlbiB0aGF0IGNvbnRhaW5zIGFuIEFSTlxuICogQHBhcmFtIGFybkZvcm1hdCB0aGUgZXhwZWN0ZWQgZm9ybWF0IG9mICdhcm4nIC0gZGVwZW5kcyBvbiB3aGF0IGZvcm1hdCB0aGUgc2VydmljZSB0aGUgQVJOIHJlcHJlc2VudHMgdXNlc1xuICovXG5mdW5jdGlvbiBwYXJzZVRva2VuQXJuKGFyblRva2VuOiBzdHJpbmcsIGFybkZvcm1hdDogQXJuRm9ybWF0KTogQXJuQ29tcG9uZW50cyB7XG4gIC8vIEFSTiBsb29rcyBsaWtlOlxuICAvLyBhcm46cGFydGl0aW9uOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2VcbiAgLy8gYXJuOnBhcnRpdGlvbjpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlc291cmNlOnJlc291cmNlTmFtZVxuICAvLyBhcm46cGFydGl0aW9uOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2UvcmVzb3VyY2VOYW1lXG4gIC8vIGFybjpwYXJ0aXRpb246c2VydmljZTpyZWdpb246YWNjb3VudDovcmVzb3VyY2UvcmVzb3VyY2VOYW1lXG5cbiAgY29uc3QgY29tcG9uZW50cyA9IEZuLnNwbGl0KCc6JywgYXJuVG9rZW4pO1xuXG4gIGNvbnN0IHBhcnRpdGlvbiA9IEZuLnNlbGVjdCgxLCBjb21wb25lbnRzKS50b1N0cmluZygpO1xuICBjb25zdCBzZXJ2aWNlID0gRm4uc2VsZWN0KDIsIGNvbXBvbmVudHMpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHJlZ2lvbiA9IEZuLnNlbGVjdCgzLCBjb21wb25lbnRzKS50b1N0cmluZygpO1xuICBjb25zdCBhY2NvdW50ID0gRm4uc2VsZWN0KDQsIGNvbXBvbmVudHMpLnRvU3RyaW5nKCk7XG4gIGxldCByZXNvdXJjZTogc3RyaW5nO1xuICBsZXQgcmVzb3VyY2VOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGxldCBzZXA6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBpZiAoYXJuRm9ybWF0ID09PSBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSB8fCBhcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKSB7XG4gICAgLy8gd2Uga25vdyB0aGF0IHRoZSAncmVzb3VyY2UnIHBhcnQgd2lsbCBhbHdheXMgYmUgdGhlIDZ0aCBzZWdtZW50IGluIHRoaXMgY2FzZVxuICAgIHJlc291cmNlID0gRm4uc2VsZWN0KDUsIGNvbXBvbmVudHMpO1xuICAgIGlmIChhcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKSB7XG4gICAgICByZXNvdXJjZU5hbWUgPSBGbi5zZWxlY3QoNiwgY29tcG9uZW50cyk7XG4gICAgICBzZXAgPSAnOic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc291cmNlTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgIHNlcCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gd2Uga25vdyB0aGF0IHRoZSAncmVzb3VyY2UnIGFuZCAncmVzb3VyY2VOYW1lJyBwYXJ0cyBhcmUgc2VwYXJhdGVkIGJ5IHNsYXNoIGhlcmUsXG4gICAgLy8gc28gd2Ugc3BsaXQgdGhlIDZ0aCBzZWdtZW50IGZyb20gdGhlIGNvbG9uLXNlcGFyYXRlZCBvbmVzIHdpdGggYSBzbGFzaFxuICAgIGNvbnN0IGxhc3RDb21wb25lbnRzID0gRm4uc3BsaXQoJy8nLCBGbi5zZWxlY3QoNSwgY29tcG9uZW50cykpO1xuXG4gICAgaWYgKGFybkZvcm1hdCA9PT0gQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpIHtcbiAgICAgIHJlc291cmNlID0gRm4uc2VsZWN0KDAsIGxhc3RDb21wb25lbnRzKTtcbiAgICAgIHJlc291cmNlTmFtZSA9IEZuLnNlbGVjdCgxLCBsYXN0Q29tcG9uZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGFybkZvcm1hdCBpcyBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfU0xBU0hfUkVTT1VSQ0VfTkFNRSxcbiAgICAgIC8vIHdoaWNoIG1lYW5zIHRoZXJlJ3MgYW4gZXh0cmEgc2xhc2ggdGhlcmUgYXQgdGhlIGJlZ2lubmluZyB0aGF0IHdlIG5lZWQgdG8gc2tpcFxuICAgICAgcmVzb3VyY2UgPSBGbi5zZWxlY3QoMSwgbGFzdENvbXBvbmVudHMpO1xuICAgICAgcmVzb3VyY2VOYW1lID0gRm4uc2VsZWN0KDIsIGxhc3RDb21wb25lbnRzKTtcbiAgICB9XG4gICAgc2VwID0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIHsgcGFydGl0aW9uLCBzZXJ2aWNlLCByZWdpb24sIGFjY291bnQsIHJlc291cmNlLCByZXNvdXJjZU5hbWUsIHNlcCwgYXJuRm9ybWF0IH07XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhhdCBhIHN0cmluZyBpcyBlaXRoZXIgdW5wYXJzZWFibGUgb3IgbG9va3MgbW9zdGx5IGxpa2UgYW4gQVJOXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXJuU2hhcGUoYXJuOiBzdHJpbmcpOiAndG9rZW4nIHwgc3RyaW5nW10ge1xuICAvLyBhc3N1bWUgYW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCAnYXJuOicgaXMgYW4gQVJOLFxuICAvLyBzbyB3ZSBjYW4gcmVwb3J0IGJldHRlciBlcnJvcnNcbiAgY29uc3QgbG9va3NMaWtlQXJuID0gYXJuLnN0YXJ0c1dpdGgoJ2FybjonKTtcblxuICBpZiAoIWxvb2tzTGlrZUFybikge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoYXJuKSkge1xuICAgICAgcmV0dXJuICd0b2tlbic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQVJOcyBtdXN0IHN0YXJ0IHdpdGggXCJhcm46XCIgYW5kIGhhdmUgYXQgbGVhc3QgNiBjb21wb25lbnRzOiAke2Fybn1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgQVJOIG1lcmVseSBjb250YWlucyBUb2tlbnMsIGJ1dCBvdGhlcndpc2UgKmxvb2tzKiBtb3N0bHkgbGlrZSBhbiBBUk4sXG4gIC8vIGl0J3MgYSBzdHJpbmcgb2YgdGhlIGZvcm0gJ2Fybjoke3BhcnRpdGlvbn06c2VydmljZToke3JlZ2lvbn06JHthY2NvdW50fTpyZXNvdXJjZS94eXonLlxuICAvLyBQYXJzZSBmaWVsZHMgb3V0IHRvIHRoZSBiZXN0IG9mIG91ciBhYmlsaXR5LlxuICAvLyBUb2tlbnMgd29uJ3QgY29udGFpbiBcIjpcIiwgc28gdGhpcyB3b24ndCBicmVhayB0aGVtLlxuICBjb25zdCBjb21wb25lbnRzID0gYXJuLnNwbGl0KCc6Jyk7XG5cbiAgY29uc3QgcGFydGl0aW9uID0gY29tcG9uZW50cy5sZW5ndGggPiAxID8gY29tcG9uZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgaWYgKCFwYXJ0aXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgcGFydGl0aW9uYCBjb21wb25lbnQgKDJuZCBjb21wb25lbnQpIG9mIGFuIEFSTiBpcyByZXF1aXJlZDogJyArIGFybik7XG4gIH1cblxuICBjb25zdCBzZXJ2aWNlID0gY29tcG9uZW50cy5sZW5ndGggPiAyID8gY29tcG9uZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHNlcnZpY2VgIGNvbXBvbmVudCAoM3JkIGNvbXBvbmVudCkgb2YgYW4gQVJOIGlzIHJlcXVpcmVkOiAnICsgYXJuKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlID0gY29tcG9uZW50cy5sZW5ndGggPiA1ID8gY29tcG9uZW50c1s1XSA6IHVuZGVmaW5lZDtcbiAgaWYgKCFyZXNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGByZXNvdXJjZWAgY29tcG9uZW50ICg2dGggY29tcG9uZW50KSBvZiBhbiBBUk4gaXMgcmVxdWlyZWQ6ICcgKyBhcm4pO1xuICB9XG5cbiAgLy8gUmVnaW9uIGNhbiBiZSBtaXNzaW5nIGluIGdsb2JhbCBBUk5zIChzdWNoIGFzIHVzZWQgYnkgSUFNKVxuXG4gIC8vIEFjY291bnQgY2FuIGJlIG1pc3NpbmcgaW4gc29tZSBBUk4gdHlwZXMgKHN1Y2ggYXMgdXNlZCBmb3IgUzMgYnVja2V0cylcblxuICByZXR1cm4gY29tcG9uZW50cztcbn1cbiJdfQ==