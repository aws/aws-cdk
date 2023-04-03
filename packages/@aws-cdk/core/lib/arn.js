"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arn = exports.ArnFormat = void 0;
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
        return (0, util_1.filterUndefined)({
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
    constructor() { }
}
exports.Arn = Arn;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUE4QjtBQUU5QixtQ0FBZ0M7QUFDaEMsaUNBQXlDO0FBRXpDOztHQUVHO0FBQ0gsSUFBWSxTQXVDWDtBQXZDRCxXQUFZLFNBQVM7SUFDbkI7Ozs7Ozs7T0FPRztJQUNILHlFQUE0RCxDQUFBO0lBRTVEOzs7Ozs7O09BT0c7SUFDSCx5RkFBNEUsQ0FBQTtJQUU1RTs7Ozs7OztPQU9HO0lBQ0gseUZBQTRFLENBQUE7SUFFNUU7Ozs7OztPQU1HO0lBQ0gseUdBQTRGLENBQUE7QUFDOUYsQ0FBQyxFQXZDVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXVDcEI7QUFtRUQsTUFBYSxHQUFHO0lBQ2Q7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQXlCLEVBQUUsS0FBYTtRQUMzRCxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRSxTQUFTLENBQUM7UUFDM0QsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsTUFBTSxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLElBQUksS0FBSyxFQUFFLE9BQU8sQ0FBQztRQUVyRCxvQ0FBb0M7UUFDcEMsSUFBSSxTQUFTLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixTQUFTLGNBQWMsTUFBTSxtQkFBbUIsT0FBTyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2xKO1FBRUQsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMs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QStFO0lBQy9FLDBGQUEwRjtJQUMxRiwrQ0FBK0M7SUFDL0Msc0RBQXNEO0lBQ3RELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbEMsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BFLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQzVGO0lBRUQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2xFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQzFGO0lBRUQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ25FLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQzNGO0lBRUQsNkRBQTZEO0lBRTdELHlFQUF5RTtJQUV6RSxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm4gfSBmcm9tICcuL2Nmbi1mbic7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcbmltcG9ydCB7IGZpbHRlclVuZGVmaW5lZCB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQW4gZW51bSByZXByZXNlbnRpbmcgdGhlIHZhcmlvdXMgQVJOIGZvcm1hdHMgdGhhdCBkaWZmZXJlbnQgc2VydmljZXMgdXNlLlxuICovXG5leHBvcnQgZW51bSBBcm5Gb3JtYXQge1xuICAvKipcbiAgICogVGhpcyByZXByZXNlbnRzIGEgZm9ybWF0IHdoZXJlIHRoZXJlIGlzIG5vICdyZXNvdXJjZU5hbWUnIHBhcnQuXG4gICAqIFRoaXMgZm9ybWF0IGlzIHVzZWQgZm9yIFMzIHJlc291cmNlcyxcbiAgICogbGlrZSAnYXJuOmF3czpzMzo6OmJ1Y2tldCcuXG4gICAqIEV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGxhc3QgY29sb24gaXMgY29uc2lkZXJlZCB0aGUgJ3Jlc291cmNlJyxcbiAgICogZXZlbiBpZiBpdCBjb250YWlucyBzbGFzaGVzLFxuICAgKiBsaWtlIGluICdhcm46YXdzOnMzOjo6YnVja2V0L29iamVjdC56aXAnLlxuICAgKi9cbiAgTk9fUkVTT1VSQ0VfTkFNRSA9ICdhcm46YXdzOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2UnLFxuXG4gIC8qKlxuICAgKiBUaGlzIHJlcHJlc2VudHMgYSBmb3JtYXQgd2hlcmUgdGhlICdyZXNvdXJjZScgYW5kICdyZXNvdXJjZU5hbWUnXG4gICAqIHBhcnRzIGFyZSBzZXBhcmF0ZWQgd2l0aCBhIGNvbG9uLlxuICAgKiBMaWtlIGluOiAnYXJuOmF3czpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlc291cmNlOnJlc291cmNlTmFtZScuXG4gICAqIEV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGxhc3QgY29sb24gaXMgY29uc2lkZXJlZCB0aGUgJ3Jlc291cmNlTmFtZScsXG4gICAqIGV2ZW4gaWYgaXQgY29udGFpbnMgc2xhc2hlcyxcbiAgICogbGlrZSBpbiAnYXJuOmF3czphcGlnYXRld2F5OnJlZ2lvbjphY2NvdW50OnJlc291cmNlOi90ZXN0L215ZGVtb3Jlc291cmNlLyonLlxuICAgKi9cbiAgQ09MT05fUkVTT1VSQ0VfTkFNRSA9ICdhcm46YXdzOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2U6cmVzb3VyY2VOYW1lJyxcblxuICAvKipcbiAgICogVGhpcyByZXByZXNlbnRzIGEgZm9ybWF0IHdoZXJlIHRoZSAncmVzb3VyY2UnIGFuZCAncmVzb3VyY2VOYW1lJ1xuICAgKiBwYXJ0cyBhcmUgc2VwYXJhdGVkIHdpdGggYSBzbGFzaC5cbiAgICogTGlrZSBpbjogJ2Fybjphd3M6c2VydmljZTpyZWdpb246YWNjb3VudDpyZXNvdXJjZS9yZXNvdXJjZU5hbWUnLlxuICAgKiBFdmVyeXRoaW5nIGFmdGVyIHRoZSBzZXBhcmF0aW5nIHNsYXNoIGlzIGNvbnNpZGVyZWQgdGhlICdyZXNvdXJjZU5hbWUnLFxuICAgKiBldmVuIGlmIGl0IGNvbnRhaW5zIGNvbG9ucyxcbiAgICogbGlrZSBpbiAnYXJuOmF3czpjb2duaXRvLXN5bmM6cmVnaW9uOmFjY291bnQ6aWRlbnRpdHlwb29sL3VzLWVhc3QtMToxYTFhMWExYS1mZmZmLTExMTEtOTk5OS0xMjM0NTY3ODpibGEnLlxuICAgKi9cbiAgU0xBU0hfUkVTT1VSQ0VfTkFNRSA9ICdhcm46YXdzOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2UvcmVzb3VyY2VOYW1lJyxcblxuICAvKipcbiAgICogVGhpcyByZXByZXNlbnRzIGEgZm9ybWF0IHdoZXJlIHRoZSAncmVzb3VyY2UnIGFuZCAncmVzb3VyY2VOYW1lJ1xuICAgKiBwYXJ0cyBhcmUgc2VwZXJhdGVkIHdpdGggYSBzbGFzaCxcbiAgICogYnV0IHRoZXJlIGlzIGFsc28gYW4gYWRkaXRpb25hbCBzbGFzaCBhZnRlciB0aGUgY29sb24gc2VwYXJhdGluZyAnYWNjb3VudCcgZnJvbSAncmVzb3VyY2UnLlxuICAgKiBMaWtlIGluOiAnYXJuOmF3czpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50Oi9yZXNvdXJjZS9yZXNvdXJjZU5hbWUnLlxuICAgKiBOb3RlIHRoYXQgdGhlIGxlYWRpbmcgc2xhc2ggaXMgX25vdF8gaW5jbHVkZWQgaW4gdGhlIHBhcnNlZCAncmVzb3VyY2UnIHBhcnQuXG4gICAqL1xuICBTTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FID0gJ2Fybjphd3M6c2VydmljZTpyZWdpb246YWNjb3VudDovcmVzb3VyY2UvcmVzb3VyY2VOYW1lJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcm5Db21wb25lbnRzIHtcbiAgLyoqXG4gICAqIFRoZSBwYXJ0aXRpb24gdGhhdCB0aGUgcmVzb3VyY2UgaXMgaW4uIEZvciBzdGFuZGFyZCBBV1MgcmVnaW9ucywgdGhlXG4gICAqIHBhcnRpdGlvbiBpcyBhd3MuIElmIHlvdSBoYXZlIHJlc291cmNlcyBpbiBvdGhlciBwYXJ0aXRpb25zLCB0aGVcbiAgICogcGFydGl0aW9uIGlzIGF3cy1wYXJ0aXRpb25uYW1lLiBGb3IgZXhhbXBsZSwgdGhlIHBhcnRpdGlvbiBmb3IgcmVzb3VyY2VzXG4gICAqIGluIHRoZSBDaGluYSAoQmVpamluZykgcmVnaW9uIGlzIGF3cy1jbi5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIEFXUyBwYXJ0aXRpb24gdGhlIHN0YWNrIGlzIGRlcGxveWVkIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgcGFydGl0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VydmljZSBuYW1lc3BhY2UgdGhhdCBpZGVudGlmaWVzIHRoZSBBV1MgcHJvZHVjdCAoZm9yIGV4YW1wbGUsXG4gICAqICdzMycsICdpYW0nLCAnY29kZXBpcGxpbmUnKS5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiB0aGUgcmVzb3VyY2UgcmVzaWRlcyBpbi4gTm90ZSB0aGF0IHRoZSBBUk5zIGZvciBzb21lIHJlc291cmNlc1xuICAgKiBkbyBub3QgcmVxdWlyZSBhIHJlZ2lvbiwgc28gdGhpcyBjb21wb25lbnQgbWlnaHQgYmUgb21pdHRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIHJlZ2lvbiB0aGUgc3RhY2sgaXMgZGVwbG95ZWQgdG8uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgQVdTIGFjY291bnQgdGhhdCBvd25zIHRoZSByZXNvdXJjZSwgd2l0aG91dCB0aGUgaHlwaGVucy5cbiAgICogRm9yIGV4YW1wbGUsIDEyMzQ1Njc4OTAxMi4gTm90ZSB0aGF0IHRoZSBBUk5zIGZvciBzb21lIHJlc291cmNlcyBkb24ndFxuICAgKiByZXF1aXJlIGFuIGFjY291bnQgbnVtYmVyLCBzbyB0aGlzIGNvbXBvbmVudCBtaWdodCBiZSBvbWl0dGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgYWNjb3VudCB0aGUgc3RhY2sgaXMgZGVwbG95ZWQgdG8uXG4gICAqL1xuICByZWFkb25seSBhY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXNvdXJjZSB0eXBlIChlLmcuIFwidGFibGVcIiwgXCJhdXRvU2NhbGluZ0dyb3VwXCIsIFwiY2VydGlmaWNhdGVcIikuXG4gICAqIEZvciBzb21lIHJlc291cmNlIHR5cGVzLCBlLmcuIFMzIGJ1Y2tldHMsIHRoaXMgZmllbGQgZGVmaW5lcyB0aGUgYnVja2V0IG5hbWUuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXBhcmF0b3IgYmV0d2VlbiByZXNvdXJjZSB0eXBlIGFuZCB0aGUgcmVzb3VyY2UuXG4gICAqXG4gICAqIENhbiBiZSBlaXRoZXIgJy8nLCAnOicgb3IgYW4gZW1wdHkgc3RyaW5nLiBXaWxsIG9ubHkgYmUgdXNlZCBpZiByZXNvdXJjZU5hbWUgaXMgZGVmaW5lZC5cbiAgICogQGRlZmF1bHQgJy8nXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBhcm5Gb3JtYXQgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgc2VwPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXNvdXJjZSBuYW1lIG9yIHBhdGggd2l0aGluIHRoZSByZXNvdXJjZSAoaS5lLiBTMyBidWNrZXQgb2JqZWN0IGtleSkgb3JcbiAgICogYSB3aWxkY2FyZCBzdWNoIGFzIGBgXCIqXCJgYC4gVGhpcyBpcyBzZXJ2aWNlLWRlcGVuZGVudC5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNwZWNpZmljIEFSTiBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIEFSTiB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1c2VzIHZhbHVlIG9mIGBzZXBgIGFzIHRoZSBzZXBhcmF0b3IgZm9yIGZvcm1hdHRpbmcsXG4gICAqICAgYEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FYCBpZiB0aGF0IHByb3BlcnR5IHdhcyBhbHNvIG5vdCBwcm92aWRlZFxuICAgKi9cbiAgcmVhZG9ubHkgYXJuRm9ybWF0PzogQXJuRm9ybWF0O1xufVxuXG5leHBvcnQgY2xhc3MgQXJuIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gQVJOIGZyb20gY29tcG9uZW50cy5cbiAgICpcbiAgICogSWYgYHBhcnRpdGlvbmAsIGByZWdpb25gIG9yIGBhY2NvdW50YCBhcmUgbm90IHNwZWNpZmllZCwgdGhlIHN0YWNrJ3NcbiAgICogcGFydGl0aW9uLCByZWdpb24gYW5kIGFjY291bnQgd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBJZiBhbnkgY29tcG9uZW50IGlzIHRoZSBlbXB0eSBzdHJpbmcsIGFuIGVtcHR5IHN0cmluZyB3aWxsIGJlIGluc2VydGVkXG4gICAqIGludG8gdGhlIGdlbmVyYXRlZCBBUk4gYXQgdGhlIGxvY2F0aW9uIHRoYXQgY29tcG9uZW50IGNvcnJlc3BvbmRzIHRvLlxuICAgKlxuICAgKiBUaGUgQVJOIHdpbGwgYmUgZm9ybWF0dGVkIGFzIGZvbGxvd3M6XG4gICAqXG4gICAqICAgYXJuOntwYXJ0aXRpb259OntzZXJ2aWNlfTp7cmVnaW9ufTp7YWNjb3VudH06e3Jlc291cmNlfXtzZXB9e3Jlc291cmNlLW5hbWV9XG4gICAqXG4gICAqIFRoZSByZXF1aXJlZCBBUk4gcGllY2VzIHRoYXQgYXJlIG9taXR0ZWQgd2lsbCBiZSB0YWtlbiBmcm9tIHRoZSBzdGFjayB0aGF0XG4gICAqIHRoZSAnc2NvcGUnIGlzIGF0dGFjaGVkIHRvLiBJZiBhbGwgQVJOIHBpZWNlcyBhcmUgc3VwcGxpZWQsIHRoZSBzdXBwbGllZCBzY29wZVxuICAgKiBjYW4gYmUgJ3VuZGVmaW5lZCcuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvcm1hdChjb21wb25lbnRzOiBBcm5Db21wb25lbnRzLCBzdGFjaz86IFN0YWNrKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJ0aXRpb24gPSBjb21wb25lbnRzLnBhcnRpdGlvbiA/PyBzdGFjaz8ucGFydGl0aW9uO1xuICAgIGNvbnN0IHJlZ2lvbiA9IGNvbXBvbmVudHMucmVnaW9uID8/IHN0YWNrPy5yZWdpb247XG4gICAgY29uc3QgYWNjb3VudCA9IGNvbXBvbmVudHMuYWNjb3VudCA/PyBzdGFjaz8uYWNjb3VudDtcblxuICAgIC8vIENhdGNoIGJvdGggJ251bGwnIGFuZCAndW5kZWZpbmVkJ1xuICAgIGlmIChwYXJ0aXRpb24gPT0gbnVsbCB8fCByZWdpb24gPT0gbnVsbCB8fCBhY2NvdW50ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJuLmZvcm1hdDogcGFydGl0aW9uICgke3BhcnRpdGlvbn0pLCByZWdpb24gKCR7cmVnaW9ufSksIGFuZCBhY2NvdW50ICgke2FjY291bnR9KSBtdXN0IGFsbCBiZSBwYXNzZWQgaWYgc3RhY2sgaXMgbm90IHBhc3NlZC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXAgPSBjb21wb25lbnRzLnNlcCA/PyAoY29tcG9uZW50cy5hcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FID8gJzonIDogJy8nKTtcblxuICAgIGNvbnN0IHZhbHVlcyA9IFtcbiAgICAgICdhcm4nLCAnOicsIHBhcnRpdGlvbiwgJzonLCBjb21wb25lbnRzLnNlcnZpY2UsICc6JywgcmVnaW9uLCAnOicsIGFjY291bnQsICc6JyxcbiAgICAgIC4uLihjb21wb25lbnRzLmFybkZvcm1hdCA9PT0gQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX1NMQVNIX1JFU09VUkNFX05BTUUgPyBbJy8nXSA6IFtdKSxcbiAgICAgIGNvbXBvbmVudHMucmVzb3VyY2UsXG4gICAgXTtcblxuICAgIGlmIChzZXAgIT09ICcvJyAmJiBzZXAgIT09ICc6JyAmJiBzZXAgIT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Jlc291cmNlUGF0aFNlcCBtYXkgb25seSBiZSBcIjpcIiwgXCIvXCIgb3IgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudHMucmVzb3VyY2VOYW1lICE9IG51bGwpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHNlcCk7XG4gICAgICB2YWx1ZXMucHVzaChjb21wb25lbnRzLnJlc291cmNlTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcy5qb2luKCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBBUk4sIHBhcnNlcyBpdCBhbmQgcmV0dXJucyBjb21wb25lbnRzLlxuICAgKlxuICAgKiBJRiBUSEUgQVJOIElTIEEgQ09OQ1JFVEUgU1RSSU5HLi4uXG4gICAqXG4gICAqIC4uLml0IHdpbGwgYmUgcGFyc2VkIGFuZCB2YWxpZGF0ZWQuIFRoZSBzZXBhcmF0b3IgKGBzZXBgKSB3aWxsIGJlIHNldCB0byAnLydcbiAgICogaWYgdGhlIDZ0aCBjb21wb25lbnQgaW5jbHVkZXMgYSAnLycsIGluIHdoaWNoIGNhc2UsIGByZXNvdXJjZWAgd2lsbCBiZSBzZXRcbiAgICogdG8gdGhlIHZhbHVlIGJlZm9yZSB0aGUgJy8nIGFuZCBgcmVzb3VyY2VOYW1lYCB3aWxsIGJlIHRoZSByZXN0LiBJbiBjYXNlXG4gICAqIHRoZXJlIGlzIG5vICcvJywgYHJlc291cmNlYCB3aWxsIGJlIHNldCB0byB0aGUgNnRoIGNvbXBvbmVudHMgYW5kXG4gICAqIGByZXNvdXJjZU5hbWVgIHdpbGwgYmUgc2V0IHRvIHRoZSByZXN0IG9mIHRoZSBzdHJpbmcuXG4gICAqXG4gICAqIElGIFRIRSBBUk4gSVMgQSBUT0tFTi4uLlxuICAgKlxuICAgKiAuLi5pdCBjYW5ub3QgYmUgdmFsaWRhdGVkLCBzaW5jZSB3ZSBkb24ndCBoYXZlIHRoZSBhY3R1YWwgdmFsdWUgeWV0IGF0IHRoZVxuICAgKiB0aW1lIG9mIHRoaXMgZnVuY3Rpb24gY2FsbC4gWW91IHdpbGwgaGF2ZSB0byBzdXBwbHkgYHNlcElmVG9rZW5gIGFuZFxuICAgKiB3aGV0aGVyIG9yIG5vdCBBUk5zIG9mIHRoZSBleHBlY3RlZCBmb3JtYXQgdXN1YWxseSBoYXZlIHJlc291cmNlIG5hbWVzXG4gICAqIGluIG9yZGVyIHRvIHBhcnNlIGl0IHByb3Blcmx5LiBUaGUgcmVzdWx0aW5nIGBBcm5Db21wb25lbnRzYCBvYmplY3Qgd2lsbFxuICAgKiBjb250YWluIHRva2VucyBmb3IgdGhlIHN1YmV4cHJlc3Npb25zIG9mIHRoZSBBUk4sIG5vdCBzdHJpbmcgbGl0ZXJhbHMuXG4gICAqXG4gICAqIElmIHRoZSByZXNvdXJjZSBuYW1lIGNvdWxkIHBvc3NpYmx5IGNvbnRhaW4gdGhlIHNlcGFyYXRvciBjaGFyLCB0aGUgYWN0dWFsXG4gICAqIHJlc291cmNlIG5hbWUgY2Fubm90IGJlIHByb3Blcmx5IHBhcnNlZC4gVGhpcyBvbmx5IG9jY3VycyBpZiB0aGUgc2VwYXJhdG9yXG4gICAqIGNoYXIgaXMgJy8nLCBhbmQgaGFwcGVucyBmb3IgZXhhbXBsZSBmb3IgUzMgb2JqZWN0IEFSTnMsIElBTSBSb2xlIEFSTnMsXG4gICAqIElBTSBPSURDIFByb3ZpZGVyIEFSTnMsIGV0Yy4gVG8gcHJvcGVybHkgZXh0cmFjdCB0aGUgcmVzb3VyY2UgbmFtZSBmcm9tIGFcbiAgICogVG9rZW5pemVkIEFSTiwgeW91IG11c3Qga25vdyB0aGUgcmVzb3VyY2UgdHlwZSBhbmQgY2FsbFxuICAgKiBgQXJuLmV4dHJhY3RSZXNvdXJjZU5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIFRoZSBBUk4gdG8gcGFyc2VcbiAgICogQHBhcmFtIHNlcElmVG9rZW4gVGhlIHNlcGFyYXRvciB1c2VkIHRvIHNlcGFyYXRlIHJlc291cmNlIGZyb20gcmVzb3VyY2VOYW1lXG4gICAqIEBwYXJhbSBoYXNOYW1lIFdoZXRoZXIgdGhlcmUgaXMgYSBuYW1lIGNvbXBvbmVudCBpbiB0aGUgQVJOIGF0IGFsbC4gRm9yXG4gICAqIGV4YW1wbGUsIFNOUyBUb3BpY3MgQVJOcyBoYXZlIHRoZSAncmVzb3VyY2UnIGNvbXBvbmVudCBjb250YWluIHRoZSB0b3BpY1xuICAgKiBuYW1lLCBhbmQgbm8gJ3Jlc291cmNlTmFtZScgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBBcm5Db21wb25lbnRzIG9iamVjdCB3aGljaCBhbGxvd3MgYWNjZXNzIHRvIHRoZSB2YXJpb3VzXG4gICAqIGNvbXBvbmVudHMgb2YgdGhlIEFSTi5cbiAgICpcbiAgICogQHJldHVybnMgYW4gQXJuQ29tcG9uZW50cyBvYmplY3Qgd2hpY2ggYWxsb3dzIGFjY2VzcyB0byB0aGUgdmFyaW91c1xuICAgKiAgICAgIGNvbXBvbmVudHMgb2YgdGhlIEFSTi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIHNwbGl0IGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJuOiBzdHJpbmcsIHNlcElmVG9rZW46IHN0cmluZyA9ICcvJywgaGFzTmFtZTogYm9vbGVhbiA9IHRydWUpOiBBcm5Db21wb25lbnRzIHtcbiAgICBsZXQgYXJuRm9ybWF0OiBBcm5Gb3JtYXQ7XG4gICAgaWYgKCFoYXNOYW1lKSB7XG4gICAgICBhcm5Gb3JtYXQgPSBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJuRm9ybWF0ID0gc2VwSWZUb2tlbiA9PT0gJy8nID8gQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUgOiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3BsaXQoYXJuLCBhcm5Gb3JtYXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0cyB0aGUgcHJvdmlkZWQgQVJOIGludG8gaXRzIGNvbXBvbmVudHMuXG4gICAqIFdvcmtzIGJvdGggaWYgJ2FybicgaXMgYSBzdHJpbmcgbGlrZSAnYXJuOmF3czpzMzo6OmJ1Y2tldCcsXG4gICAqIGFuZCBhIFRva2VuIHJlcHJlc2VudGluZyBhIGR5bmFtaWMgQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvblxuICAgKiAoaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuZWQgY29tcG9uZW50cyB3aWxsIGFsc28gYmUgZHluYW1pYyBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9ucyxcbiAgICogZW5jb2RlZCBhcyBUb2tlbnMpLlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIHRoZSBBUk4gdG8gc3BsaXQgaW50byBpdHMgY29tcG9uZW50c1xuICAgKiBAcGFyYW0gYXJuRm9ybWF0IHRoZSBleHBlY3RlZCBmb3JtYXQgb2YgJ2FybicgLSBkZXBlbmRzIG9uIHdoYXQgZm9ybWF0IHRoZSBzZXJ2aWNlICdhcm4nIHJlcHJlc2VudHMgdXNlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzcGxpdChhcm46IHN0cmluZywgYXJuRm9ybWF0OiBBcm5Gb3JtYXQpOiBBcm5Db21wb25lbnRzIHtcbiAgICBjb25zdCBjb21wb25lbnRzID0gcGFyc2VBcm5TaGFwZShhcm4pO1xuICAgIGlmIChjb21wb25lbnRzID09PSAndG9rZW4nKSB7XG4gICAgICByZXR1cm4gcGFyc2VUb2tlbkFybihhcm4sIGFybkZvcm1hdCk7XG4gICAgfVxuXG4gICAgY29uc3QgWywgcGFydGl0aW9uLCBzZXJ2aWNlLCByZWdpb24sIGFjY291bnQsIHJlc291cmNlVHlwZU9yTmFtZSwgLi4ucmVzdF0gPSBjb21wb25lbnRzO1xuXG4gICAgbGV0IHJlc291cmNlOiBzdHJpbmc7XG4gICAgbGV0IHJlc291cmNlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGxldCBzZXA6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgcmVzb3VyY2VQYXJ0U3RhcnRJbmRleCA9IDA7XG4gICAgbGV0IGRldGVjdGVkQXJuRm9ybWF0OiBBcm5Gb3JtYXQ7XG5cbiAgICBsZXQgc2xhc2hJbmRleCA9IHJlc291cmNlVHlwZU9yTmFtZS5pbmRleE9mKCcvJyk7XG4gICAgaWYgKHNsYXNoSW5kZXggPT09IDApIHtcbiAgICAgIC8vIG5ldy1zdHlsZSBBUk5zIGFyZSBvZiB0aGUgZm9ybSAnYXJuOmF3czpzNDp1cy13ZXN0LTE6MTIzNDU6L3Jlc291cmNlLXR5cGUvcmVzb3VyY2UtbmFtZSdcbiAgICAgIHNsYXNoSW5kZXggPSByZXNvdXJjZVR5cGVPck5hbWUuaW5kZXhPZignLycsIDEpO1xuICAgICAgcmVzb3VyY2VQYXJ0U3RhcnRJbmRleCA9IDE7XG4gICAgICBkZXRlY3RlZEFybkZvcm1hdCA9IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FO1xuICAgIH1cbiAgICBpZiAoc2xhc2hJbmRleCAhPT0gLTEpIHtcbiAgICAgIC8vIHRoZSBzbGFzaCBpcyBvbmx5IGEgc2VwYXJhdG9yIGlmIEFybkZvcm1hdCBpcyBub3QgTk9fUkVTT1VSQ0VfTkFNRVxuICAgICAgaWYgKGFybkZvcm1hdCA9PT0gQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUpIHtcbiAgICAgICAgc2VwID0gdW5kZWZpbmVkO1xuICAgICAgICBzbGFzaEluZGV4ID0gLTE7XG4gICAgICAgIGRldGVjdGVkQXJuRm9ybWF0ID0gQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXAgPSAnLyc7XG4gICAgICAgIGRldGVjdGVkQXJuRm9ybWF0ID0gcmVzb3VyY2VQYXJ0U3RhcnRJbmRleCA9PT0gMFxuICAgICAgICAgID8gQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUVcbiAgICAgICAgICAvLyBuZWVkIHRvIHJlcGVhdCB0aGlzIGhlcmUsIGFzIG90aGVyd2lzZSB0aGUgY29tcGlsZXIgdGhpbmtzICdkZXRlY3RlZEFybkZvcm1hdCcgaXMgbm90IGluaXRpYWxpemVkIGluIGFsbCBwYXRoc1xuICAgICAgICAgIDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX1NMQVNIX1JFU09VUkNFX05BTUU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNlcCA9ICc6JztcbiAgICAgIHNsYXNoSW5kZXggPSAtMTtcbiAgICAgIGRldGVjdGVkQXJuRm9ybWF0ID0gQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlcCA9IHVuZGVmaW5lZDtcbiAgICAgIGRldGVjdGVkQXJuRm9ybWF0ID0gQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUU7XG4gICAgfVxuXG4gICAgaWYgKHNsYXNoSW5kZXggIT09IC0xKSB7XG4gICAgICByZXNvdXJjZSA9IHJlc291cmNlVHlwZU9yTmFtZS5zdWJzdHJpbmcocmVzb3VyY2VQYXJ0U3RhcnRJbmRleCwgc2xhc2hJbmRleCk7XG4gICAgICByZXNvdXJjZU5hbWUgPSByZXNvdXJjZVR5cGVPck5hbWUuc3Vic3RyaW5nKHNsYXNoSW5kZXggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2UgPSByZXNvdXJjZVR5cGVPck5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHJlc3QubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCFyZXNvdXJjZU5hbWUpIHtcbiAgICAgICAgcmVzb3VyY2VOYW1lID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvdXJjZU5hbWUgKz0gJzonO1xuICAgICAgfVxuXG4gICAgICByZXNvdXJjZU5hbWUgKz0gcmVzdC5qb2luKCc6Jyk7XG4gICAgfVxuXG4gICAgLy8gXCJ8fCB1bmRlZmluZWRcIiB3aWxsIGNhdXNlIGVtcHR5IHN0cmluZ3MgdG8gYmUgdHJlYXRlZCBhcyBcInVuZGVmaW5lZFwiLlxuICAgIC8vIE9wdGlvbmFsIEFSTiBhdHRyaWJ1dGVzIChlLmcuIHJlZ2lvbiwgYWNjb3VudCkgc2hvdWxkIHJldHVybiBhcyBlbXB0eSBzdHJpbmdcbiAgICAvLyBpZiB0aGV5IGFyZSBwcm92aWRlZCBhcyBzdWNoLlxuICAgIHJldHVybiBmaWx0ZXJVbmRlZmluZWQoe1xuICAgICAgc2VydmljZTogc2VydmljZSB8fCB1bmRlZmluZWQsXG4gICAgICByZXNvdXJjZTogcmVzb3VyY2UgfHwgdW5kZWZpbmVkLFxuICAgICAgcGFydGl0aW9uOiBwYXJ0aXRpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgcmVnaW9uLFxuICAgICAgYWNjb3VudCxcbiAgICAgIHJlc291cmNlTmFtZSxcbiAgICAgIHNlcCxcbiAgICAgIGFybkZvcm1hdDogZGV0ZWN0ZWRBcm5Gb3JtYXQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCB0aGUgZnVsbCByZXNvdXJjZSBuYW1lIGZyb20gYW4gQVJOXG4gICAqXG4gICAqIE5lY2Vzc2FyeSBmb3IgcmVzb3VyY2UgbmFtZXMgKHBhdGhzKSB0aGF0IG1heSBjb250YWluIHRoZSBzZXBhcmF0b3IsIGxpa2VcbiAgICogYGFybjphd3M6aWFtOjoxMTExMTExMTExMTE6cm9sZS9wYXRoL3RvL3JvbGUvbmFtZWAuXG4gICAqXG4gICAqIE9ubHkgd29ya3MgaWYgd2Ugc3RhdGljYWxseSBrbm93IHRoZSBleHBlY3RlZCBgcmVzb3VyY2VUeXBlYCBiZWZvcmVoYW5kLCBzaW5jZSB3ZSdyZSBnb2luZ1xuICAgKiB0byB1c2UgdGhhdCB0byBzcGxpdCB0aGUgc3RyaW5nIG9uICc6PHJlc291cmNlVHlwZT4vJyAoYW5kIHRha2UgdGhlIHJpZ2h0LWhhbmQgc2lkZSkuXG4gICAqXG4gICAqIFdlIGNhbid0IGV4dHJhY3QgdGhlICdyZXNvdXJjZVR5cGUnIGZyb20gdGhlIEFSTiBhdCBoYW5kLCBiZWNhdXNlIENsb3VkRm9ybWF0aW9uIEV4cHJlc3Npb25zXG4gICAqIG9ubHkgYWxsb3cgbGl0ZXJhbHMgaW4gdGhlICdzZXBhcmF0b3InIGFyZ3VtZW50IHRvIGB7IEZuOjpTcGxpdCB9YCwgYW5kIHNvIGl0IGNhbid0IGJlXG4gICAqIGB7IEZuOjpTZWxlY3Q6IFs1LCB7IEZuOjpTcGxpdDogWyc6JywgQVJOXSB9fWAuXG4gICAqXG4gICAqIE9ubHkgbmVjZXNzYXJ5IGZvciBBUk4gZm9ybWF0cyBmb3Igd2hpY2ggdGhlIHR5cGUtbmFtZSBzZXBhcmF0b3IgaXMgYC9gLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleHRyYWN0UmVzb3VyY2VOYW1lKGFybjogc3RyaW5nLCByZXNvdXJjZVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgY29tcG9uZW50cyA9IHBhcnNlQXJuU2hhcGUoYXJuKTtcbiAgICBpZiAoY29tcG9uZW50cyA9PT0gJ3Rva2VuJykge1xuICAgICAgcmV0dXJuIEZuLnNlbGVjdCgxLCBGbi5zcGxpdChgOiR7cmVzb3VyY2VUeXBlfS9gLCBhcm4pKTtcbiAgICB9XG5cbiAgICAvLyBBcHBhcmVudGx5IHdlIGNvdWxkIGp1c3QgcGFyc2UgdGhpcyByaWdodCBhd2F5LiBWYWxpZGF0ZSB0aGF0IHdlIGdvdCB0aGUgcmlnaHRcbiAgICAvLyByZXNvdXJjZSB0eXBlICh0byBub3RpZnkgYXV0aG9ycyBvZiBpbmNvcnJlY3QgYXNzdW1wdGlvbnMgcmlnaHQgYXdheSkuXG4gICAgY29uc3QgcGFyc2VkID0gQXJuLnNwbGl0KGFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHBhcnNlZC5yZXNvdXJjZSkgJiYgcGFyc2VkLnJlc291cmNlICE9PSByZXNvdXJjZVR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgcmVzb3VyY2UgdHlwZSAnJHtyZXNvdXJjZVR5cGV9JyBpbiBBUk4sIGdvdCAnJHtwYXJzZWQucmVzb3VyY2V9JyBpbiAnJHthcm59J2ApO1xuICAgIH1cbiAgICBpZiAoIXBhcnNlZC5yZXNvdXJjZU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgcmVzb3VyY2UgbmFtZSBpbiBBUk4sIGRpZG4ndCBmaW5kIG9uZTogJyR7YXJufSdgKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZC5yZXNvdXJjZU5hbWU7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBUb2tlbiBldmFsdWF0aW5nIHRvIEFSTiwgcGFyc2VzIGl0IGFuZCByZXR1cm5zIGNvbXBvbmVudHMuXG4gKlxuICogVGhlIEFSTiBjYW5ub3QgYmUgdmFsaWRhdGVkLCBzaW5jZSB3ZSBkb24ndCBoYXZlIHRoZSBhY3R1YWwgdmFsdWUgeWV0XG4gKiBhdCB0aGUgdGltZSBvZiB0aGlzIGZ1bmN0aW9uIGNhbGwuIFlvdSB3aWxsIGhhdmUgdG8ga25vdyB0aGUgc2VwYXJhdG9yXG4gKiBhbmQgdGhlIHR5cGUgb2YgQVJOLlxuICpcbiAqIFRoZSByZXN1bHRpbmcgYEFybkNvbXBvbmVudHNgIG9iamVjdCB3aWxsIGNvbnRhaW4gdG9rZW5zIGZvciB0aGVcbiAqIHN1YmV4cHJlc3Npb25zIG9mIHRoZSBBUk4sIG5vdCBzdHJpbmcgbGl0ZXJhbHMuXG4gKlxuICogV0FSTklORzogdGhpcyBmdW5jdGlvbiBjYW5ub3QgcHJvcGVybHkgcGFyc2UgdGhlIGNvbXBsZXRlIGZpbmFsXG4gKiAncmVzb3VyY2VOYW1lJyBwYXJ0IGlmIGl0IGNvbnRhaW5zIGNvbG9ucyxcbiAqIGxpa2UgJ2Fybjphd3M6Y29nbml0by1zeW5jOnJlZ2lvbjphY2NvdW50OmlkZW50aXR5cG9vbC91cy1lYXN0LTE6MWExYTFhMWEtZmZmZi0xMTExLTk5OTktMTIzNDU2Nzg6YmxhJy5cbiAqXG4gKiBAcGFyYW0gYXJuVG9rZW4gVGhlIGlucHV0IHRva2VuIHRoYXQgY29udGFpbnMgYW4gQVJOXG4gKiBAcGFyYW0gYXJuRm9ybWF0IHRoZSBleHBlY3RlZCBmb3JtYXQgb2YgJ2FybicgLSBkZXBlbmRzIG9uIHdoYXQgZm9ybWF0IHRoZSBzZXJ2aWNlIHRoZSBBUk4gcmVwcmVzZW50cyB1c2VzXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVG9rZW5Bcm4oYXJuVG9rZW46IHN0cmluZywgYXJuRm9ybWF0OiBBcm5Gb3JtYXQpOiBBcm5Db21wb25lbnRzIHtcbiAgLy8gQVJOIGxvb2tzIGxpa2U6XG4gIC8vIGFybjpwYXJ0aXRpb246c2VydmljZTpyZWdpb246YWNjb3VudDpyZXNvdXJjZVxuICAvLyBhcm46cGFydGl0aW9uOnNlcnZpY2U6cmVnaW9uOmFjY291bnQ6cmVzb3VyY2U6cmVzb3VyY2VOYW1lXG4gIC8vIGFybjpwYXJ0aXRpb246c2VydmljZTpyZWdpb246YWNjb3VudDpyZXNvdXJjZS9yZXNvdXJjZU5hbWVcbiAgLy8gYXJuOnBhcnRpdGlvbjpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50Oi9yZXNvdXJjZS9yZXNvdXJjZU5hbWVcblxuICBjb25zdCBjb21wb25lbnRzID0gRm4uc3BsaXQoJzonLCBhcm5Ub2tlbik7XG5cbiAgY29uc3QgcGFydGl0aW9uID0gRm4uc2VsZWN0KDEsIGNvbXBvbmVudHMpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHNlcnZpY2UgPSBGbi5zZWxlY3QoMiwgY29tcG9uZW50cykudG9TdHJpbmcoKTtcbiAgY29uc3QgcmVnaW9uID0gRm4uc2VsZWN0KDMsIGNvbXBvbmVudHMpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IGFjY291bnQgPSBGbi5zZWxlY3QoNCwgY29tcG9uZW50cykudG9TdHJpbmcoKTtcbiAgbGV0IHJlc291cmNlOiBzdHJpbmc7XG4gIGxldCByZXNvdXJjZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbGV0IHNlcDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGlmIChhcm5Gb3JtYXQgPT09IEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FIHx8IGFybkZvcm1hdCA9PT0gQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpIHtcbiAgICAvLyB3ZSBrbm93IHRoYXQgdGhlICdyZXNvdXJjZScgcGFydCB3aWxsIGFsd2F5cyBiZSB0aGUgNnRoIHNlZ21lbnQgaW4gdGhpcyBjYXNlXG4gICAgcmVzb3VyY2UgPSBGbi5zZWxlY3QoNSwgY29tcG9uZW50cyk7XG4gICAgaWYgKGFybkZvcm1hdCA9PT0gQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpIHtcbiAgICAgIHJlc291cmNlTmFtZSA9IEZuLnNlbGVjdCg2LCBjb21wb25lbnRzKTtcbiAgICAgIHNlcCA9ICc6JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2VOYW1lID0gdW5kZWZpbmVkO1xuICAgICAgc2VwID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyB3ZSBrbm93IHRoYXQgdGhlICdyZXNvdXJjZScgYW5kICdyZXNvdXJjZU5hbWUnIHBhcnRzIGFyZSBzZXBhcmF0ZWQgYnkgc2xhc2ggaGVyZSxcbiAgICAvLyBzbyB3ZSBzcGxpdCB0aGUgNnRoIHNlZ21lbnQgZnJvbSB0aGUgY29sb24tc2VwYXJhdGVkIG9uZXMgd2l0aCBhIHNsYXNoXG4gICAgY29uc3QgbGFzdENvbXBvbmVudHMgPSBGbi5zcGxpdCgnLycsIEZuLnNlbGVjdCg1LCBjb21wb25lbnRzKSk7XG5cbiAgICBpZiAoYXJuRm9ybWF0ID09PSBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkge1xuICAgICAgcmVzb3VyY2UgPSBGbi5zZWxlY3QoMCwgbGFzdENvbXBvbmVudHMpO1xuICAgICAgcmVzb3VyY2VOYW1lID0gRm4uc2VsZWN0KDEsIGxhc3RDb21wb25lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXJuRm9ybWF0IGlzIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgLy8gd2hpY2ggbWVhbnMgdGhlcmUncyBhbiBleHRyYSBzbGFzaCB0aGVyZSBhdCB0aGUgYmVnaW5uaW5nIHRoYXQgd2UgbmVlZCB0byBza2lwXG4gICAgICByZXNvdXJjZSA9IEZuLnNlbGVjdCgxLCBsYXN0Q29tcG9uZW50cyk7XG4gICAgICByZXNvdXJjZU5hbWUgPSBGbi5zZWxlY3QoMiwgbGFzdENvbXBvbmVudHMpO1xuICAgIH1cbiAgICBzZXAgPSAnLyc7XG4gIH1cblxuICByZXR1cm4geyBwYXJ0aXRpb24sIHNlcnZpY2UsIHJlZ2lvbiwgYWNjb3VudCwgcmVzb3VyY2UsIHJlc291cmNlTmFtZSwgc2VwLCBhcm5Gb3JtYXQgfTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGF0IGEgc3RyaW5nIGlzIGVpdGhlciB1bnBhcnNlYWJsZSBvciBsb29rcyBtb3N0bHkgbGlrZSBhbiBBUk5cbiAqL1xuZnVuY3Rpb24gcGFyc2VBcm5TaGFwZShhcm46IHN0cmluZyk6ICd0b2tlbicgfCBzdHJpbmdbXSB7XG4gIC8vIGFzc3VtZSBhbnl0aGluZyB0aGF0IHN0YXJ0cyB3aXRoICdhcm46JyBpcyBhbiBBUk4sXG4gIC8vIHNvIHdlIGNhbiByZXBvcnQgYmV0dGVyIGVycm9yc1xuICBjb25zdCBsb29rc0xpa2VBcm4gPSBhcm4uc3RhcnRzV2l0aCgnYXJuOicpO1xuXG4gIGlmICghbG9va3NMaWtlQXJuKSB7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChhcm4pKSB7XG4gICAgICByZXR1cm4gJ3Rva2VuJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUk5zIG11c3Qgc3RhcnQgd2l0aCBcImFybjpcIiBhbmQgaGF2ZSBhdCBsZWFzdCA2IGNvbXBvbmVudHM6ICR7YXJufWApO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZSBBUk4gbWVyZWx5IGNvbnRhaW5zIFRva2VucywgYnV0IG90aGVyd2lzZSAqbG9va3MqIG1vc3RseSBsaWtlIGFuIEFSTixcbiAgLy8gaXQncyBhIHN0cmluZyBvZiB0aGUgZm9ybSAnYXJuOiR7cGFydGl0aW9ufTpzZXJ2aWNlOiR7cmVnaW9ufToke2FjY291bnR9OnJlc291cmNlL3h5eicuXG4gIC8vIFBhcnNlIGZpZWxkcyBvdXQgdG8gdGhlIGJlc3Qgb2Ygb3VyIGFiaWxpdHkuXG4gIC8vIFRva2VucyB3b24ndCBjb250YWluIFwiOlwiLCBzbyB0aGlzIHdvbid0IGJyZWFrIHRoZW0uXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBhcm4uc3BsaXQoJzonKTtcblxuICBjb25zdCBwYXJ0aXRpb24gPSBjb21wb25lbnRzLmxlbmd0aCA+IDEgPyBjb21wb25lbnRzWzFdIDogdW5kZWZpbmVkO1xuICBpZiAoIXBhcnRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBwYXJ0aXRpb25gIGNvbXBvbmVudCAoMm5kIGNvbXBvbmVudCkgb2YgYW4gQVJOIGlzIHJlcXVpcmVkOiAnICsgYXJuKTtcbiAgfVxuXG4gIGNvbnN0IHNlcnZpY2UgPSBjb21wb25lbnRzLmxlbmd0aCA+IDIgPyBjb21wb25lbnRzWzJdIDogdW5kZWZpbmVkO1xuICBpZiAoIXNlcnZpY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgc2VydmljZWAgY29tcG9uZW50ICgzcmQgY29tcG9uZW50KSBvZiBhbiBBUk4gaXMgcmVxdWlyZWQ6ICcgKyBhcm4pO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2UgPSBjb21wb25lbnRzLmxlbmd0aCA+IDUgPyBjb21wb25lbnRzWzVdIDogdW5kZWZpbmVkO1xuICBpZiAoIXJlc291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHJlc291cmNlYCBjb21wb25lbnQgKDZ0aCBjb21wb25lbnQpIG9mIGFuIEFSTiBpcyByZXF1aXJlZDogJyArIGFybik7XG4gIH1cblxuICAvLyBSZWdpb24gY2FuIGJlIG1pc3NpbmcgaW4gZ2xvYmFsIEFSTnMgKHN1Y2ggYXMgdXNlZCBieSBJQU0pXG5cbiAgLy8gQWNjb3VudCBjYW4gYmUgbWlzc2luZyBpbiBzb21lIEFSTiB0eXBlcyAoc3VjaCBhcyB1c2VkIGZvciBTMyBidWNrZXRzKVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xufVxuIl19