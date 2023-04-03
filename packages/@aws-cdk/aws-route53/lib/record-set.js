"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossAccountZoneDelegationRecord = exports.ZoneDelegationRecord = exports.DsRecord = exports.NsRecord = exports.MxRecord = exports.CaaAmazonRecord = exports.CaaRecord = exports.CaaTag = exports.SrvRecord = exports.TxtRecord = exports.CnameRecord = exports.AaaaRecord = exports.ARecord = exports.AddressRecordTarget = exports.RecordSet = exports.RecordTarget = exports.RecordType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const route53_generated_1 = require("./route53.generated");
const util_1 = require("./util");
const CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE = 'Custom::CrossAccountZoneDelegation';
const DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE = 'Custom::DeleteExistingRecordSet';
/**
 * Context key to control whether to use the regional STS endpoint, instead of the global one
 *
 * There is only exactly one use case where you want to turn this on. If:
 *
 * - you are building an AWS service; AND
 * - would like to your own Global Service Principal in the trust policy of the delegation role; AND
 * - the target account is opted in in the same region as well
 *
 * Then you can turn this on. For all other use cases, the global endpoint is preferable:
 *
 * - if you are a regular customer, your trust policy would be in terms of account ids or
 *   organization ids, or ARNs, not Service Principals, so you don't care about this behavior.
 * - if the target account is not opted in as well, the AssumeRole call would fail
 *
 * Because this configuration option is so rare, turn it into a context setting instead
 * of a publicly available prop.
 */
const USE_REGIONAL_STS_ENDPOINT_CONTEXT_KEY = '@aws-cdk/aws-route53:useRegionalStsEndpoint';
/**
 * The record type.
 */
var RecordType;
(function (RecordType) {
    /**
     * route traffic to a resource, such as a web server, using an IPv4 address in dotted decimal
     * notation
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AFormat
     */
    RecordType["A"] = "A";
    /**
     * route traffic to a resource, such as a web server, using an IPv6 address in colon-separated
     * hexadecimal format
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AAAAFormat
     */
    RecordType["AAAA"] = "AAAA";
    /**
     * A CAA record specifies which certificate authorities (CAs) are allowed to issue certificates
     * for a domain or subdomain
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CAAFormat
     */
    RecordType["CAA"] = "CAA";
    /**
     * A CNAME record maps DNS queries for the name of the current record, such as acme.example.com,
     * to another domain (example.com or example.net) or subdomain (acme.example.com or zenith.example.org).
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CNAMEFormat
     */
    RecordType["CNAME"] = "CNAME";
    /**
     * A delegation signer (DS) record refers a zone key for a delegated subdomain zone.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#DSFormat
     */
    RecordType["DS"] = "DS";
    /**
     * An MX record specifies the names of your mail servers and, if you have two or more mail servers,
     * the priority order.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#MXFormat
     */
    RecordType["MX"] = "MX";
    /**
     * A Name Authority Pointer (NAPTR) is a type of record that is used by Dynamic Delegation Discovery
     * System (DDDS) applications to convert one value to another or to replace one value with another.
     * For example, one common use is to convert phone numbers into SIP URIs.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NAPTRFormat
     */
    RecordType["NAPTR"] = "NAPTR";
    /**
     * An NS record identifies the name servers for the hosted zone
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NSFormat
     */
    RecordType["NS"] = "NS";
    /**
     * A PTR record maps an IP address to the corresponding domain name.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#PTRFormat
     */
    RecordType["PTR"] = "PTR";
    /**
     * A start of authority (SOA) record provides information about a domain and the corresponding Amazon
     * Route 53 hosted zone
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SOAFormat
     */
    RecordType["SOA"] = "SOA";
    /**
     * SPF records were formerly used to verify the identity of the sender of email messages.
     * Instead of an SPF record, we recommend that you create a TXT record that contains the applicable value.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SPFFormat
     */
    RecordType["SPF"] = "SPF";
    /**
     * An SRV record Value element consists of four space-separated values. The first three values are
     * decimal numbers representing priority, weight, and port. The fourth value is a domain name.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SRVFormat
     */
    RecordType["SRV"] = "SRV";
    /**
     * A TXT record contains one or more strings that are enclosed in double quotation marks (").
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#TXTFormat
     */
    RecordType["TXT"] = "TXT";
})(RecordType = exports.RecordType || (exports.RecordType = {}));
/**
 * Type union for a record that accepts multiple types of target.
 */
class RecordTarget {
    /**
     *
     * @param values correspond with the chosen record type (e.g. for 'A' Type, specify one or more IP addresses)
     * @param aliasTarget alias for targets such as CloudFront distribution to route traffic to
     */
    constructor(values, aliasTarget) {
        this.values = values;
        this.aliasTarget = aliasTarget;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_IAliasRecordTarget(aliasTarget);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RecordTarget);
            }
            throw error;
        }
    }
    /**
     * Use string values as target.
     */
    static fromValues(...values) {
        return new RecordTarget(values);
    }
    /**
     * Use an alias as target.
     */
    static fromAlias(aliasTarget) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_IAliasRecordTarget(aliasTarget);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAlias);
            }
            throw error;
        }
        return new RecordTarget(undefined, aliasTarget);
    }
    /**
     * Use ip addresses as target.
     */
    static fromIpAddresses(...ipAddresses) {
        return RecordTarget.fromValues(...ipAddresses);
    }
}
exports.RecordTarget = RecordTarget;
_a = JSII_RTTI_SYMBOL_1;
RecordTarget[_a] = { fqn: "@aws-cdk/aws-route53.RecordTarget", version: "0.0.0" };
/**
 * A record set.
 */
class RecordSet extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_RecordSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RecordSet);
            }
            throw error;
        }
        const ttl = props.target.aliasTarget ? undefined : ((props.ttl && props.ttl.toSeconds()) ?? 1800).toString();
        const recordName = util_1.determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone);
        const recordSet = new route53_generated_1.CfnRecordSet(this, 'Resource', {
            hostedZoneId: props.zone.hostedZoneId,
            name: recordName,
            type: props.recordType,
            resourceRecords: props.target.values,
            aliasTarget: props.target.aliasTarget && props.target.aliasTarget.bind(this, props.zone),
            ttl,
            comment: props.comment,
        });
        this.domainName = recordSet.ref;
        if (props.deleteExisting) {
            // Delete existing record before creating the new one
            const provider = core_1.CustomResourceProvider.getOrCreateProvider(this, DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE, {
                codeDirectory: path.join(__dirname, 'delete-existing-record-set-handler'),
                runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
                policyStatements: [{
                        Effect: 'Allow',
                        Action: 'route53:GetChange',
                        Resource: '*',
                    }],
            });
            // Add to the singleton policy for this specific provider
            provider.addToRolePolicy({
                Effect: 'Allow',
                Action: 'route53:ListResourceRecordSets',
                Resource: props.zone.hostedZoneArn,
            });
            provider.addToRolePolicy({
                Effect: 'Allow',
                Action: 'route53:ChangeResourceRecordSets',
                Resource: props.zone.hostedZoneArn,
                Condition: {
                    'ForAllValues:StringEquals': {
                        'route53:ChangeResourceRecordSetsRecordTypes': [props.recordType],
                        'route53:ChangeResourceRecordSetsActions': ['DELETE'],
                    },
                },
            });
            const customResource = new core_1.CustomResource(this, 'DeleteExistingRecordSetCustomResource', {
                resourceType: DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE,
                serviceToken: provider.serviceToken,
                properties: {
                    HostedZoneId: props.zone.hostedZoneId,
                    RecordName: recordName,
                    RecordType: props.recordType,
                },
            });
            recordSet.node.addDependency(customResource);
        }
    }
}
exports.RecordSet = RecordSet;
_b = JSII_RTTI_SYMBOL_1;
RecordSet[_b] = { fqn: "@aws-cdk/aws-route53.RecordSet", version: "0.0.0" };
/**
 * Target for a DNS A Record
 *
 * @deprecated Use RecordTarget
 */
class AddressRecordTarget extends RecordTarget {
}
exports.AddressRecordTarget = AddressRecordTarget;
_c = JSII_RTTI_SYMBOL_1;
AddressRecordTarget[_c] = { fqn: "@aws-cdk/aws-route53.AddressRecordTarget", version: "0.0.0" };
/**
 * A DNS A record
 *
 * @resource AWS::Route53::RecordSet
 */
class ARecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.A,
            target: props.target,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_ARecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ARecord);
            }
            throw error;
        }
    }
}
exports.ARecord = ARecord;
_d = JSII_RTTI_SYMBOL_1;
ARecord[_d] = { fqn: "@aws-cdk/aws-route53.ARecord", version: "0.0.0" };
/**
 * A DNS AAAA record
 *
 * @resource AWS::Route53::RecordSet
 */
class AaaaRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.AAAA,
            target: props.target,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_AaaaRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AaaaRecord);
            }
            throw error;
        }
    }
}
exports.AaaaRecord = AaaaRecord;
_e = JSII_RTTI_SYMBOL_1;
AaaaRecord[_e] = { fqn: "@aws-cdk/aws-route53.AaaaRecord", version: "0.0.0" };
/**
 * A DNS CNAME record
 *
 * @resource AWS::Route53::RecordSet
 */
class CnameRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.CNAME,
            target: RecordTarget.fromValues(props.domainName),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_CnameRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CnameRecord);
            }
            throw error;
        }
    }
}
exports.CnameRecord = CnameRecord;
_f = JSII_RTTI_SYMBOL_1;
CnameRecord[_f] = { fqn: "@aws-cdk/aws-route53.CnameRecord", version: "0.0.0" };
/**
 * A DNS TXT record
 *
 * @resource AWS::Route53::RecordSet
 */
class TxtRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.TXT,
            target: RecordTarget.fromValues(...props.values.map(v => formatTxt(v))),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_TxtRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TxtRecord);
            }
            throw error;
        }
    }
}
exports.TxtRecord = TxtRecord;
_g = JSII_RTTI_SYMBOL_1;
TxtRecord[_g] = { fqn: "@aws-cdk/aws-route53.TxtRecord", version: "0.0.0" };
/**
 * Formats a text value for use in a TXT record
 *
 * Use `JSON.stringify` to correctly escape and enclose in double quotes ("").
 *
 * DNS TXT records can contain up to 255 characters in a single string. TXT
 * record strings over 255 characters must be split into multiple text strings
 * within the same record.
 *
 * @see https://aws.amazon.com/premiumsupport/knowledge-center/route53-resolve-dkim-text-record-error/
 */
function formatTxt(string) {
    const result = [];
    let idx = 0;
    while (idx < string.length) {
        result.push(string.slice(idx, idx += 255)); // chunks of 255 characters long
    }
    return result.map(r => JSON.stringify(r)).join('');
}
/**
 * A DNS SRV record
 *
 * @resource AWS::Route53::RecordSet
 */
class SrvRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.SRV,
            target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.weight} ${v.port} ${v.hostName}`)),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_SrvRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SrvRecord);
            }
            throw error;
        }
    }
}
exports.SrvRecord = SrvRecord;
_h = JSII_RTTI_SYMBOL_1;
SrvRecord[_h] = { fqn: "@aws-cdk/aws-route53.SrvRecord", version: "0.0.0" };
/**
 * The CAA tag.
 */
var CaaTag;
(function (CaaTag) {
    /**
     * Explicity authorizes a single certificate authority to issue a
     * certificate (any type) for the hostname.
     */
    CaaTag["ISSUE"] = "issue";
    /**
     * Explicity authorizes a single certificate authority to issue a
     * wildcard certificate (and only wildcard) for the hostname.
     */
    CaaTag["ISSUEWILD"] = "issuewild";
    /**
     * Specifies a URL to which a certificate authority may report policy
     * violations.
     */
    CaaTag["IODEF"] = "iodef";
})(CaaTag = exports.CaaTag || (exports.CaaTag = {}));
/**
 * A DNS CAA record
 *
 * @resource AWS::Route53::RecordSet
 */
class CaaRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.CAA,
            target: RecordTarget.fromValues(...props.values.map(v => `${v.flag} ${v.tag} "${v.value}"`)),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_CaaRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CaaRecord);
            }
            throw error;
        }
    }
}
exports.CaaRecord = CaaRecord;
_j = JSII_RTTI_SYMBOL_1;
CaaRecord[_j] = { fqn: "@aws-cdk/aws-route53.CaaRecord", version: "0.0.0" };
/**
 * A DNS Amazon CAA record.
 *
 * A CAA record to restrict certificate authorities allowed
 * to issue certificates for a domain to Amazon only.
 *
 * @resource AWS::Route53::RecordSet
 */
class CaaAmazonRecord extends CaaRecord {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            values: [
                {
                    flag: 0,
                    tag: CaaTag.ISSUE,
                    value: 'amazon.com',
                },
            ],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_CaaAmazonRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CaaAmazonRecord);
            }
            throw error;
        }
    }
}
exports.CaaAmazonRecord = CaaAmazonRecord;
_k = JSII_RTTI_SYMBOL_1;
CaaAmazonRecord[_k] = { fqn: "@aws-cdk/aws-route53.CaaAmazonRecord", version: "0.0.0" };
/**
 * A DNS MX record
 *
 * @resource AWS::Route53::RecordSet
 */
class MxRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.MX,
            target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.hostName}`)),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_MxRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MxRecord);
            }
            throw error;
        }
    }
}
exports.MxRecord = MxRecord;
_l = JSII_RTTI_SYMBOL_1;
MxRecord[_l] = { fqn: "@aws-cdk/aws-route53.MxRecord", version: "0.0.0" };
/**
 * A DNS NS record
 *
 * @resource AWS::Route53::RecordSet
 */
class NsRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.NS,
            target: RecordTarget.fromValues(...props.values),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_NsRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NsRecord);
            }
            throw error;
        }
    }
}
exports.NsRecord = NsRecord;
_m = JSII_RTTI_SYMBOL_1;
NsRecord[_m] = { fqn: "@aws-cdk/aws-route53.NsRecord", version: "0.0.0" };
/**
 * A DNS DS record
 *
 * @resource AWS::Route53::RecordSet
 */
class DsRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.DS,
            target: RecordTarget.fromValues(...props.values),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_DsRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DsRecord);
            }
            throw error;
        }
    }
}
exports.DsRecord = DsRecord;
_o = JSII_RTTI_SYMBOL_1;
DsRecord[_o] = { fqn: "@aws-cdk/aws-route53.DsRecord", version: "0.0.0" };
/**
 * A record to delegate further lookups to a different set of name servers.
 */
class ZoneDelegationRecord extends RecordSet {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            recordType: RecordType.NS,
            target: RecordTarget.fromValues(...core_1.Token.isUnresolved(props.nameServers)
                ? props.nameServers // Can't map a string-array token!
                : props.nameServers.map(ns => (core_1.Token.isUnresolved(ns) || ns.endsWith('.')) ? ns : `${ns}.`)),
            ttl: props.ttl || core_1.Duration.days(2),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_ZoneDelegationRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ZoneDelegationRecord);
            }
            throw error;
        }
    }
}
exports.ZoneDelegationRecord = ZoneDelegationRecord;
_p = JSII_RTTI_SYMBOL_1;
ZoneDelegationRecord[_p] = { fqn: "@aws-cdk/aws-route53.ZoneDelegationRecord", version: "0.0.0" };
/**
 * A Cross Account Zone Delegation record
 */
class CrossAccountZoneDelegationRecord extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_CrossAccountZoneDelegationRecordProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CrossAccountZoneDelegationRecord);
            }
            throw error;
        }
        if (!props.parentHostedZoneName && !props.parentHostedZoneId) {
            throw Error('At least one of parentHostedZoneName or parentHostedZoneId is required');
        }
        if (props.parentHostedZoneName && props.parentHostedZoneId) {
            throw Error('Only one of parentHostedZoneName and parentHostedZoneId is supported');
        }
        const provider = core_1.CustomResourceProvider.getOrCreateProvider(this, CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE, {
            codeDirectory: path.join(__dirname, 'cross-account-zone-delegation-handler'),
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
        });
        const role = iam.Role.fromRoleArn(this, 'cross-account-zone-delegation-handler-role', provider.roleArn);
        const addToPrinciplePolicyResult = role.addToPrincipalPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: [props.delegationRole.roleArn],
        }));
        const useRegionalStsEndpoint = this.node.tryGetContext(USE_REGIONAL_STS_ENDPOINT_CONTEXT_KEY);
        const customResource = new core_1.CustomResource(this, 'CrossAccountZoneDelegationCustomResource', {
            resourceType: CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            removalPolicy: props.removalPolicy,
            properties: {
                AssumeRoleArn: props.delegationRole.roleArn,
                ParentZoneName: props.parentHostedZoneName,
                ParentZoneId: props.parentHostedZoneId,
                DelegatedZoneName: props.delegatedZone.zoneName,
                DelegatedZoneNameServers: props.delegatedZone.hostedZoneNameServers,
                TTL: (props.ttl || core_1.Duration.days(2)).toSeconds(),
                UseRegionalStsEndpoint: useRegionalStsEndpoint ? 'true' : undefined,
            },
        });
        if (addToPrinciplePolicyResult.policyDependable) {
            customResource.node.addDependency(addToPrinciplePolicyResult.policyDependable);
        }
    }
}
exports.CrossAccountZoneDelegationRecord = CrossAccountZoneDelegationRecord;
_q = JSII_RTTI_SYMBOL_1;
CrossAccountZoneDelegationRecord[_q] = { fqn: "@aws-cdk/aws-route53.CrossAccountZoneDelegationRecord", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlY29yZC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyx3Q0FBMko7QUFDM0osMkNBQXVDO0FBR3ZDLDJEQUFtRDtBQUNuRCxpQ0FBMkQ7QUFFM0QsTUFBTSwyQ0FBMkMsR0FBRyxvQ0FBb0MsQ0FBQztBQUN6RixNQUFNLHdDQUF3QyxHQUFHLGlDQUFpQyxDQUFDO0FBRW5GOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILE1BQU0scUNBQXFDLEdBQUcsNkNBQTZDLENBQUM7QUFZNUY7O0dBRUc7QUFDSCxJQUFZLFVBcUdYO0FBckdELFdBQVksVUFBVTtJQUNwQjs7Ozs7T0FLRztJQUNILHFCQUFPLENBQUE7SUFFUDs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7SUFFYjs7Ozs7T0FLRztJQUNILHlCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILDZCQUFlLENBQUE7SUFFZjs7OztPQUlHO0lBQ0gsdUJBQVMsQ0FBQTtJQUVUOzs7OztPQUtHO0lBQ0gsdUJBQVMsQ0FBQTtJQUVUOzs7Ozs7T0FNRztJQUNILDZCQUFlLENBQUE7SUFFZjs7OztPQUlHO0lBQ0gsdUJBQVMsQ0FBQTtJQUVUOzs7O09BSUc7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7O09BS0c7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7O09BS0c7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7O09BS0c7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7T0FJRztJQUNILHlCQUFXLENBQUE7QUFDYixDQUFDLEVBckdXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBcUdyQjtBQWlERDs7R0FFRztBQUNILE1BQWEsWUFBWTtJQXNCdkI7Ozs7T0FJRztJQUNILFlBQXNDLE1BQWlCLEVBQWtCLFdBQWdDO1FBQW5FLFdBQU0sR0FBTixNQUFNLENBQVc7UUFB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c0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSwgRHVyYXRpb24sIElSZXNvdXJjZSwgUmVtb3ZhbFBvbGljeSwgUmVzb3VyY2UsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElBbGlhc1JlY29yZFRhcmdldCB9IGZyb20gJy4vYWxpYXMtcmVjb3JkLXRhcmdldCc7XG5pbXBvcnQgeyBJSG9zdGVkWm9uZSB9IGZyb20gJy4vaG9zdGVkLXpvbmUtcmVmJztcbmltcG9ydCB7IENmblJlY29yZFNldCB9IGZyb20gJy4vcm91dGU1My5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgZGV0ZXJtaW5lRnVsbHlRdWFsaWZpZWREb21haW5OYW1lIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgQ1JPU1NfQUNDT1VOVF9aT05FX0RFTEVHQVRJT05fUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uJztcbmNvbnN0IERFTEVURV9FWElTVElOR19SRUNPUkRfU0VUX1JFU09VUkNFX1RZUEUgPSAnQ3VzdG9tOjpEZWxldGVFeGlzdGluZ1JlY29yZFNldCc7XG5cbi8qKlxuICogQ29udGV4dCBrZXkgdG8gY29udHJvbCB3aGV0aGVyIHRvIHVzZSB0aGUgcmVnaW9uYWwgU1RTIGVuZHBvaW50LCBpbnN0ZWFkIG9mIHRoZSBnbG9iYWwgb25lXG4gKlxuICogVGhlcmUgaXMgb25seSBleGFjdGx5IG9uZSB1c2UgY2FzZSB3aGVyZSB5b3Ugd2FudCB0byB0dXJuIHRoaXMgb24uIElmOlxuICpcbiAqIC0geW91IGFyZSBidWlsZGluZyBhbiBBV1Mgc2VydmljZTsgQU5EXG4gKiAtIHdvdWxkIGxpa2UgdG8geW91ciBvd24gR2xvYmFsIFNlcnZpY2UgUHJpbmNpcGFsIGluIHRoZSB0cnVzdCBwb2xpY3kgb2YgdGhlIGRlbGVnYXRpb24gcm9sZTsgQU5EXG4gKiAtIHRoZSB0YXJnZXQgYWNjb3VudCBpcyBvcHRlZCBpbiBpbiB0aGUgc2FtZSByZWdpb24gYXMgd2VsbFxuICpcbiAqIFRoZW4geW91IGNhbiB0dXJuIHRoaXMgb24uIEZvciBhbGwgb3RoZXIgdXNlIGNhc2VzLCB0aGUgZ2xvYmFsIGVuZHBvaW50IGlzIHByZWZlcmFibGU6XG4gKlxuICogLSBpZiB5b3UgYXJlIGEgcmVndWxhciBjdXN0b21lciwgeW91ciB0cnVzdCBwb2xpY3kgd291bGQgYmUgaW4gdGVybXMgb2YgYWNjb3VudCBpZHMgb3JcbiAqICAgb3JnYW5pemF0aW9uIGlkcywgb3IgQVJOcywgbm90IFNlcnZpY2UgUHJpbmNpcGFscywgc28geW91IGRvbid0IGNhcmUgYWJvdXQgdGhpcyBiZWhhdmlvci5cbiAqIC0gaWYgdGhlIHRhcmdldCBhY2NvdW50IGlzIG5vdCBvcHRlZCBpbiBhcyB3ZWxsLCB0aGUgQXNzdW1lUm9sZSBjYWxsIHdvdWxkIGZhaWxcbiAqXG4gKiBCZWNhdXNlIHRoaXMgY29uZmlndXJhdGlvbiBvcHRpb24gaXMgc28gcmFyZSwgdHVybiBpdCBpbnRvIGEgY29udGV4dCBzZXR0aW5nIGluc3RlYWRcbiAqIG9mIGEgcHVibGljbHkgYXZhaWxhYmxlIHByb3AuXG4gKi9cbmNvbnN0IFVTRV9SRUdJT05BTF9TVFNfRU5EUE9JTlRfQ09OVEVYVF9LRVkgPSAnQGF3cy1jZGsvYXdzLXJvdXRlNTM6dXNlUmVnaW9uYWxTdHNFbmRwb2ludCc7XG5cbi8qKlxuICogQSByZWNvcmQgc2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJlY29yZFNldCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgb2YgdGhlIHJlY29yZFxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSByZWNvcmQgdHlwZS5cbiAqL1xuZXhwb3J0IGVudW0gUmVjb3JkVHlwZSB7XG4gIC8qKlxuICAgKiByb3V0ZSB0cmFmZmljIHRvIGEgcmVzb3VyY2UsIHN1Y2ggYXMgYSB3ZWIgc2VydmVyLCB1c2luZyBhbiBJUHY0IGFkZHJlc3MgaW4gZG90dGVkIGRlY2ltYWxcbiAgICogbm90YXRpb25cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vUm91dGU1My9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvUmVzb3VyY2VSZWNvcmRUeXBlcy5odG1sI0FGb3JtYXRcbiAgICovXG4gIEEgPSAnQScsXG5cbiAgLyoqXG4gICAqIHJvdXRlIHRyYWZmaWMgdG8gYSByZXNvdXJjZSwgc3VjaCBhcyBhIHdlYiBzZXJ2ZXIsIHVzaW5nIGFuIElQdjYgYWRkcmVzcyBpbiBjb2xvbi1zZXBhcmF0ZWRcbiAgICogaGV4YWRlY2ltYWwgZm9ybWF0XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNBQUFBRm9ybWF0XG4gICAqL1xuICBBQUFBID0gJ0FBQUEnLFxuXG4gIC8qKlxuICAgKiBBIENBQSByZWNvcmQgc3BlY2lmaWVzIHdoaWNoIGNlcnRpZmljYXRlIGF1dGhvcml0aWVzIChDQXMpIGFyZSBhbGxvd2VkIHRvIGlzc3VlIGNlcnRpZmljYXRlc1xuICAgKiBmb3IgYSBkb21haW4gb3Igc3ViZG9tYWluXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNDQUFGb3JtYXRcbiAgICovXG4gIENBQSA9ICdDQUEnLFxuXG4gIC8qKlxuICAgKiBBIENOQU1FIHJlY29yZCBtYXBzIEROUyBxdWVyaWVzIGZvciB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCByZWNvcmQsIHN1Y2ggYXMgYWNtZS5leGFtcGxlLmNvbSxcbiAgICogdG8gYW5vdGhlciBkb21haW4gKGV4YW1wbGUuY29tIG9yIGV4YW1wbGUubmV0KSBvciBzdWJkb21haW4gKGFjbWUuZXhhbXBsZS5jb20gb3IgemVuaXRoLmV4YW1wbGUub3JnKS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vUm91dGU1My9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvUmVzb3VyY2VSZWNvcmRUeXBlcy5odG1sI0NOQU1FRm9ybWF0XG4gICAqL1xuICBDTkFNRSA9ICdDTkFNRScsXG5cbiAgLyoqXG4gICAqIEEgZGVsZWdhdGlvbiBzaWduZXIgKERTKSByZWNvcmQgcmVmZXJzIGEgem9uZSBrZXkgZm9yIGEgZGVsZWdhdGVkIHN1YmRvbWFpbiB6b25lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9Sb3V0ZTUzL2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9SZXNvdXJjZVJlY29yZFR5cGVzLmh0bWwjRFNGb3JtYXRcbiAgICovXG4gIERTID0gJ0RTJyxcblxuICAvKipcbiAgICogQW4gTVggcmVjb3JkIHNwZWNpZmllcyB0aGUgbmFtZXMgb2YgeW91ciBtYWlsIHNlcnZlcnMgYW5kLCBpZiB5b3UgaGF2ZSB0d28gb3IgbW9yZSBtYWlsIHNlcnZlcnMsXG4gICAqIHRoZSBwcmlvcml0eSBvcmRlci5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vUm91dGU1My9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvUmVzb3VyY2VSZWNvcmRUeXBlcy5odG1sI01YRm9ybWF0XG4gICAqL1xuICBNWCA9ICdNWCcsXG5cbiAgLyoqXG4gICAqIEEgTmFtZSBBdXRob3JpdHkgUG9pbnRlciAoTkFQVFIpIGlzIGEgdHlwZSBvZiByZWNvcmQgdGhhdCBpcyB1c2VkIGJ5IER5bmFtaWMgRGVsZWdhdGlvbiBEaXNjb3ZlcnlcbiAgICogU3lzdGVtIChERERTKSBhcHBsaWNhdGlvbnMgdG8gY29udmVydCBvbmUgdmFsdWUgdG8gYW5vdGhlciBvciB0byByZXBsYWNlIG9uZSB2YWx1ZSB3aXRoIGFub3RoZXIuXG4gICAqIEZvciBleGFtcGxlLCBvbmUgY29tbW9uIHVzZSBpcyB0byBjb252ZXJ0IHBob25lIG51bWJlcnMgaW50byBTSVAgVVJJcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vUm91dGU1My9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvUmVzb3VyY2VSZWNvcmRUeXBlcy5odG1sI05BUFRSRm9ybWF0XG4gICAqL1xuICBOQVBUUiA9ICdOQVBUUicsXG5cbiAgLyoqXG4gICAqIEFuIE5TIHJlY29yZCBpZGVudGlmaWVzIHRoZSBuYW1lIHNlcnZlcnMgZm9yIHRoZSBob3N0ZWQgem9uZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9Sb3V0ZTUzL2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9SZXNvdXJjZVJlY29yZFR5cGVzLmh0bWwjTlNGb3JtYXRcbiAgICovXG4gIE5TID0gJ05TJyxcblxuICAvKipcbiAgICogQSBQVFIgcmVjb3JkIG1hcHMgYW4gSVAgYWRkcmVzcyB0byB0aGUgY29ycmVzcG9uZGluZyBkb21haW4gbmFtZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vUm91dGU1My9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvUmVzb3VyY2VSZWNvcmRUeXBlcy5odG1sI1BUUkZvcm1hdFxuICAgKi9cbiAgUFRSID0gJ1BUUicsXG5cbiAgLyoqXG4gICAqIEEgc3RhcnQgb2YgYXV0aG9yaXR5IChTT0EpIHJlY29yZCBwcm92aWRlcyBpbmZvcm1hdGlvbiBhYm91dCBhIGRvbWFpbiBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgQW1hem9uXG4gICAqIFJvdXRlIDUzIGhvc3RlZCB6b25lXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNTT0FGb3JtYXRcbiAgICovXG4gIFNPQSA9ICdTT0EnLFxuXG4gIC8qKlxuICAgKiBTUEYgcmVjb3JkcyB3ZXJlIGZvcm1lcmx5IHVzZWQgdG8gdmVyaWZ5IHRoZSBpZGVudGl0eSBvZiB0aGUgc2VuZGVyIG9mIGVtYWlsIG1lc3NhZ2VzLlxuICAgKiBJbnN0ZWFkIG9mIGFuIFNQRiByZWNvcmQsIHdlIHJlY29tbWVuZCB0aGF0IHlvdSBjcmVhdGUgYSBUWFQgcmVjb3JkIHRoYXQgY29udGFpbnMgdGhlIGFwcGxpY2FibGUgdmFsdWUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNTUEZGb3JtYXRcbiAgICovXG4gIFNQRiA9ICdTUEYnLFxuXG4gIC8qKlxuICAgKiBBbiBTUlYgcmVjb3JkIFZhbHVlIGVsZW1lbnQgY29uc2lzdHMgb2YgZm91ciBzcGFjZS1zZXBhcmF0ZWQgdmFsdWVzLiBUaGUgZmlyc3QgdGhyZWUgdmFsdWVzIGFyZVxuICAgKiBkZWNpbWFsIG51bWJlcnMgcmVwcmVzZW50aW5nIHByaW9yaXR5LCB3ZWlnaHQsIGFuZCBwb3J0LiBUaGUgZm91cnRoIHZhbHVlIGlzIGEgZG9tYWluIG5hbWUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNTUlZGb3JtYXRcbiAgICovXG4gIFNSViA9ICdTUlYnLFxuXG4gIC8qKlxuICAgKiBBIFRYVCByZWNvcmQgY29udGFpbnMgb25lIG9yIG1vcmUgc3RyaW5ncyB0aGF0IGFyZSBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGF0aW9uIG1hcmtzIChcIikuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1Jlc291cmNlUmVjb3JkVHlwZXMuaHRtbCNUWFRGb3JtYXRcbiAgICovXG4gIFRYVCA9ICdUWFQnXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYSBSZWNvcmRTZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkU2V0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgaG9zdGVkIHpvbmUgaW4gd2hpY2ggdG8gZGVmaW5lIHRoZSBuZXcgcmVjb3JkLlxuICAgKi9cbiAgcmVhZG9ubHkgem9uZTogSUhvc3RlZFpvbmU7XG5cbiAgLyoqXG4gICAqIFRoZSBkb21haW4gbmFtZSBmb3IgdGhpcyByZWNvcmQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHpvbmUgcm9vdFxuICAgKi9cbiAgcmVhZG9ubHkgcmVjb3JkTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIHJlY29yZCBjYWNoZSB0aW1lIHRvIGxpdmUgKFRUTCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoMzApXG4gICAqL1xuICByZWFkb25seSB0dGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogQSBjb21tZW50IHRvIGFkZCBvbiB0aGUgcmVjb3JkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBubyBjb21tZW50XG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRlbGV0ZSB0aGUgc2FtZSByZWNvcmQgc2V0IGluIHRoZSBob3N0ZWQgem9uZSBpZiBpdCBhbHJlYWR5IGV4aXN0cyAoZGFuZ2Vyb3VzISlcbiAgICpcbiAgICogVGhpcyBhbGxvd3MgdG8gZGVwbG95IGEgbmV3IHJlY29yZCBzZXQgd2hpbGUgbWluaW1pemluZyB0aGUgZG93bnRpbWUgYmVjYXVzZSB0aGVcbiAgICogbmV3IHJlY29yZCBzZXQgd2lsbCBiZSBjcmVhdGVkIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGlzdGluZyBvbmUgaXMgZGVsZXRlZC4gSXRcbiAgICogYWxzbyBhdm9pZHMgXCJtYW51YWxcIiBhY3Rpb25zIHRvIGRlbGV0ZSBleGlzdGluZyByZWNvcmQgc2V0cy5cbiAgICpcbiAgICogPiAqKk4uQi46KiogdGhpcyBmZWF0dXJlIGlzIGRhbmdlcm91cywgdXNlIHdpdGggY2F1dGlvbiEgSXQgY2FuIG9ubHkgYmUgdXNlZCBzYWZlbHkgd2hlblxuICAgKiA+IGBkZWxldGVFeGlzdGluZ2AgaXMgc2V0IHRvIGB0cnVlYCBhcyBzb29uIGFzIHRoZSByZXNvdXJjZSBpcyBhZGRlZCB0byB0aGUgc3RhY2suIENoYW5naW5nXG4gICAqID4gYW4gZXhpc3RpbmcgUmVjb3JkIFNldCdzIGBkZWxldGVFeGlzdGluZ2AgcHJvcGVydHkgZnJvbSBgZmFsc2UgLT4gdHJ1ZWAgYWZ0ZXIgZGVwbG95bWVudFxuICAgKiA+IHdpbGwgZGVsZXRlIHRoZSByZWNvcmQhXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBkZWxldGVFeGlzdGluZz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVHlwZSB1bmlvbiBmb3IgYSByZWNvcmQgdGhhdCBhY2NlcHRzIG11bHRpcGxlIHR5cGVzIG9mIHRhcmdldC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZFRhcmdldCB7XG4gIC8qKlxuICAgKiBVc2Ugc3RyaW5nIHZhbHVlcyBhcyB0YXJnZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21WYWx1ZXMoLi4udmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBuZXcgUmVjb3JkVGFyZ2V0KHZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGFuIGFsaWFzIGFzIHRhcmdldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFsaWFzKGFsaWFzVGFyZ2V0OiBJQWxpYXNSZWNvcmRUYXJnZXQpIHtcbiAgICByZXR1cm4gbmV3IFJlY29yZFRhcmdldCh1bmRlZmluZWQsIGFsaWFzVGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgaXAgYWRkcmVzc2VzIGFzIHRhcmdldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUlwQWRkcmVzc2VzKC4uLmlwQWRkcmVzc2VzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBSZWNvcmRUYXJnZXQuZnJvbVZhbHVlcyguLi5pcEFkZHJlc3Nlcyk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlcyBjb3JyZXNwb25kIHdpdGggdGhlIGNob3NlbiByZWNvcmQgdHlwZSAoZS5nLiBmb3IgJ0EnIFR5cGUsIHNwZWNpZnkgb25lIG9yIG1vcmUgSVAgYWRkcmVzc2VzKVxuICAgKiBAcGFyYW0gYWxpYXNUYXJnZXQgYWxpYXMgZm9yIHRhcmdldHMgc3VjaCBhcyBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiB0byByb3V0ZSB0cmFmZmljIHRvXG4gICAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlcz86IHN0cmluZ1tdLCBwdWJsaWMgcmVhZG9ubHkgYWxpYXNUYXJnZXQ/OiBJQWxpYXNSZWNvcmRUYXJnZXQpIHtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIFJlY29yZFNldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRTZXRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJlY29yZCB0eXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVjb3JkVHlwZTogUmVjb3JkVHlwZTtcblxuICAvKipcbiAgICogVGhlIHRhcmdldCBmb3IgdGhpcyByZWNvcmQsIGVpdGhlciBgUmVjb3JkVGFyZ2V0LmZyb21WYWx1ZXMoKWAgb3JcbiAgICogYFJlY29yZFRhcmdldC5mcm9tQWxpYXMoKWAuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ6IFJlY29yZFRhcmdldDtcbn1cblxuLyoqXG4gKiBBIHJlY29yZCBzZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNvcmRTZXQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSZWNvcmRTZXQge1xuICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZWNvcmRTZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB0dGwgPSBwcm9wcy50YXJnZXQuYWxpYXNUYXJnZXQgPyB1bmRlZmluZWQgOiAoKHByb3BzLnR0bCAmJiBwcm9wcy50dGwudG9TZWNvbmRzKCkpID8/IDE4MDApLnRvU3RyaW5nKCk7XG5cbiAgICBjb25zdCByZWNvcmROYW1lID0gZGV0ZXJtaW5lRnVsbHlRdWFsaWZpZWREb21haW5OYW1lKHByb3BzLnJlY29yZE5hbWUgfHwgcHJvcHMuem9uZS56b25lTmFtZSwgcHJvcHMuem9uZSk7XG5cbiAgICBjb25zdCByZWNvcmRTZXQgPSBuZXcgQ2ZuUmVjb3JkU2V0KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogcHJvcHMuem9uZS5ob3N0ZWRab25lSWQsXG4gICAgICBuYW1lOiByZWNvcmROYW1lLFxuICAgICAgdHlwZTogcHJvcHMucmVjb3JkVHlwZSxcbiAgICAgIHJlc291cmNlUmVjb3JkczogcHJvcHMudGFyZ2V0LnZhbHVlcyxcbiAgICAgIGFsaWFzVGFyZ2V0OiBwcm9wcy50YXJnZXQuYWxpYXNUYXJnZXQgJiYgcHJvcHMudGFyZ2V0LmFsaWFzVGFyZ2V0LmJpbmQodGhpcywgcHJvcHMuem9uZSksXG4gICAgICB0dGwsXG4gICAgICBjb21tZW50OiBwcm9wcy5jb21tZW50LFxuICAgIH0pO1xuXG4gICAgdGhpcy5kb21haW5OYW1lID0gcmVjb3JkU2V0LnJlZjtcblxuICAgIGlmIChwcm9wcy5kZWxldGVFeGlzdGluZykge1xuICAgICAgLy8gRGVsZXRlIGV4aXN0aW5nIHJlY29yZCBiZWZvcmUgY3JlYXRpbmcgdGhlIG5ldyBvbmVcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHRoaXMsIERFTEVURV9FWElTVElOR19SRUNPUkRfU0VUX1JFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbGV0ZS1leGlzdGluZy1yZWNvcmQtc2V0LWhhbmRsZXInKSxcbiAgICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7IC8vIElBTSBwZXJtaXNzaW9ucyBmb3IgYWxsIHByb3ZpZGVyc1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBBY3Rpb246ICdyb3V0ZTUzOkdldENoYW5nZScsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gQWRkIHRvIHRoZSBzaW5nbGV0b24gcG9saWN5IGZvciB0aGlzIHNwZWNpZmljIHByb3ZpZGVyXG4gICAgICBwcm92aWRlci5hZGRUb1JvbGVQb2xpY3koe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIEFjdGlvbjogJ3JvdXRlNTM6TGlzdFJlc291cmNlUmVjb3JkU2V0cycsXG4gICAgICAgIFJlc291cmNlOiBwcm9wcy56b25lLmhvc3RlZFpvbmVBcm4sXG4gICAgICB9KTtcbiAgICAgIHByb3ZpZGVyLmFkZFRvUm9sZVBvbGljeSh7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMnLFxuICAgICAgICBSZXNvdXJjZTogcHJvcHMuem9uZS5ob3N0ZWRab25lQXJuLFxuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0VxdWFscyc6IHtcbiAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c1JlY29yZFR5cGVzJzogW3Byb3BzLnJlY29yZFR5cGVdLFxuICAgICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzQWN0aW9ucyc6IFsnREVMRVRFJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjdXN0b21SZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnRGVsZXRlRXhpc3RpbmdSZWNvcmRTZXRDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiBERUxFVEVfRVhJU1RJTkdfUkVDT1JEX1NFVF9SRVNPVVJDRV9UWVBFLFxuICAgICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEhvc3RlZFpvbmVJZDogcHJvcHMuem9uZS5ob3N0ZWRab25lSWQsXG4gICAgICAgICAgUmVjb3JkTmFtZTogcmVjb3JkTmFtZSxcbiAgICAgICAgICBSZWNvcmRUeXBlOiBwcm9wcy5yZWNvcmRUeXBlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHJlY29yZFNldC5ub2RlLmFkZERlcGVuZGVuY3koY3VzdG9tUmVzb3VyY2UpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRhcmdldCBmb3IgYSBETlMgQSBSZWNvcmRcbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgUmVjb3JkVGFyZ2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBBZGRyZXNzUmVjb3JkVGFyZ2V0IGV4dGVuZHMgUmVjb3JkVGFyZ2V0IHtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBBUmVjb3JkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldDogUmVjb3JkVGFyZ2V0O1xufVxuXG4vKipcbiAqIEEgRE5TIEEgcmVjb3JkXG4gKlxuICogQHJlc291cmNlIEFXUzo6Um91dGU1Mzo6UmVjb3JkU2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBBUmVjb3JkIGV4dGVuZHMgUmVjb3JkU2V0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFSZWNvcmRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZWNvcmRUeXBlOiBSZWNvcmRUeXBlLkEsXG4gICAgICB0YXJnZXQ6IHByb3BzLnRhcmdldCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIEFhYWFSZWNvcmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWFhYVJlY29yZFByb3BzIGV4dGVuZHMgUmVjb3JkU2V0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0OiBSZWNvcmRUYXJnZXQ7XG59XG5cbi8qKlxuICogQSBETlMgQUFBQSByZWNvcmRcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXRcbiAqL1xuZXhwb3J0IGNsYXNzIEFhYWFSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQWFhYVJlY29yZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlY29yZFR5cGU6IFJlY29yZFR5cGUuQUFBQSxcbiAgICAgIHRhcmdldDogcHJvcHMudGFyZ2V0LFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgQ25hbWVSZWNvcmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ25hbWVSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgRE5TIENOQU1FIHJlY29yZFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6OlJlY29yZFNldFxuICovXG5leHBvcnQgY2xhc3MgQ25hbWVSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ25hbWVSZWNvcmRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZWNvcmRUeXBlOiBSZWNvcmRUeXBlLkNOQU1FLFxuICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbVZhbHVlcyhwcm9wcy5kb21haW5OYW1lKSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIFR4dFJlY29yZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUeHRSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHRleHQgdmFsdWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBBIEROUyBUWFQgcmVjb3JkXG4gKlxuICogQHJlc291cmNlIEFXUzo6Um91dGU1Mzo6UmVjb3JkU2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBUeHRSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVHh0UmVjb3JkUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgcmVjb3JkVHlwZTogUmVjb3JkVHlwZS5UWFQsXG4gICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tVmFsdWVzKC4uLnByb3BzLnZhbHVlcy5tYXAodiA9PiBmb3JtYXRUeHQodikpKSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEZvcm1hdHMgYSB0ZXh0IHZhbHVlIGZvciB1c2UgaW4gYSBUWFQgcmVjb3JkXG4gKlxuICogVXNlIGBKU09OLnN0cmluZ2lmeWAgdG8gY29ycmVjdGx5IGVzY2FwZSBhbmQgZW5jbG9zZSBpbiBkb3VibGUgcXVvdGVzIChcIlwiKS5cbiAqXG4gKiBETlMgVFhUIHJlY29yZHMgY2FuIGNvbnRhaW4gdXAgdG8gMjU1IGNoYXJhY3RlcnMgaW4gYSBzaW5nbGUgc3RyaW5nLiBUWFRcbiAqIHJlY29yZCBzdHJpbmdzIG92ZXIgMjU1IGNoYXJhY3RlcnMgbXVzdCBiZSBzcGxpdCBpbnRvIG11bHRpcGxlIHRleHQgc3RyaW5nc1xuICogd2l0aGluIHRoZSBzYW1lIHJlY29yZC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9yb3V0ZTUzLXJlc29sdmUtZGtpbS10ZXh0LXJlY29yZC1lcnJvci9cbiAqL1xuZnVuY3Rpb24gZm9ybWF0VHh0KHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGxldCBpZHggPSAwO1xuICB3aGlsZSAoaWR4IDwgc3RyaW5nLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKHN0cmluZy5zbGljZShpZHgsIGlkeCArPSAyNTUpKTsgLy8gY2h1bmtzIG9mIDI1NSBjaGFyYWN0ZXJzIGxvbmdcbiAgfVxuICByZXR1cm4gcmVzdWx0Lm1hcChyID0+IEpTT04uc3RyaW5naWZ5KHIpKS5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFNSViByZWNvcmQgdmFsdWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3J2UmVjb3JkVmFsdWUge1xuICAvKipcbiAgICogVGhlIHByaW9yaXR5LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJpb3JpdHk6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHdlaWdodC5cbiAgICovXG4gIHJlYWRvbmx5IHdlaWdodDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9ydC5cbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHNlcnZlciBob3N0IG5hbWUuXG4gICAqL1xuICByZWFkb25seSBob3N0TmFtZTogc3RyaW5nO1xufVxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBTcnZSZWNvcmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3J2UmVjb3JkUHJvcHMgZXh0ZW5kcyBSZWNvcmRTZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZXMuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZXM6IFNydlJlY29yZFZhbHVlW107XG59XG5cbi8qKlxuICogQSBETlMgU1JWIHJlY29yZFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6OlJlY29yZFNldFxuICovXG5leHBvcnQgY2xhc3MgU3J2UmVjb3JkIGV4dGVuZHMgUmVjb3JkU2V0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNydlJlY29yZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlY29yZFR5cGU6IFJlY29yZFR5cGUuU1JWLFxuICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbVZhbHVlcyguLi5wcm9wcy52YWx1ZXMubWFwKHYgPT4gYCR7di5wcmlvcml0eX0gJHt2LndlaWdodH0gJHt2LnBvcnR9ICR7di5ob3N0TmFtZX1gKSksXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgQ0FBIHRhZy5cbiAqL1xuZXhwb3J0IGVudW0gQ2FhVGFnIHtcbiAgLyoqXG4gICAqIEV4cGxpY2l0eSBhdXRob3JpemVzIGEgc2luZ2xlIGNlcnRpZmljYXRlIGF1dGhvcml0eSB0byBpc3N1ZSBhXG4gICAqIGNlcnRpZmljYXRlIChhbnkgdHlwZSkgZm9yIHRoZSBob3N0bmFtZS5cbiAgICovXG4gIElTU1VFID0gJ2lzc3VlJyxcblxuICAvKipcbiAgICogRXhwbGljaXR5IGF1dGhvcml6ZXMgYSBzaW5nbGUgY2VydGlmaWNhdGUgYXV0aG9yaXR5IHRvIGlzc3VlIGFcbiAgICogd2lsZGNhcmQgY2VydGlmaWNhdGUgKGFuZCBvbmx5IHdpbGRjYXJkKSBmb3IgdGhlIGhvc3RuYW1lLlxuICAgKi9cbiAgSVNTVUVXSUxEID0gJ2lzc3Vld2lsZCcsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIFVSTCB0byB3aGljaCBhIGNlcnRpZmljYXRlIGF1dGhvcml0eSBtYXkgcmVwb3J0IHBvbGljeVxuICAgKiB2aW9sYXRpb25zLlxuICAgKi9cbiAgSU9ERUYgPSAnaW9kZWYnLFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgQ0FBIHJlY29yZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDYWFSZWNvcmRWYWx1ZSB7XG4gIC8qKlxuICAgKiBUaGUgZmxhZy5cbiAgICovXG4gIHJlYWRvbmx5IGZsYWc6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHRhZy5cbiAgICovXG4gIHJlYWRvbmx5IHRhZzogQ2FhVGFnO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSB0YWcuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIENhYVJlY29yZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDYWFSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHZhbHVlcy5cbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlczogQ2FhUmVjb3JkVmFsdWVbXTtcbn1cblxuLyoqXG4gKiBBIEROUyBDQUEgcmVjb3JkXG4gKlxuICogQHJlc291cmNlIEFXUzo6Um91dGU1Mzo6UmVjb3JkU2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBDYWFSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2FhUmVjb3JkUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgcmVjb3JkVHlwZTogUmVjb3JkVHlwZS5DQUEsXG4gICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tVmFsdWVzKC4uLnByb3BzLnZhbHVlcy5tYXAodiA9PiBgJHt2LmZsYWd9ICR7di50YWd9IFwiJHt2LnZhbHVlfVwiYCkpLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgQ2FhQW1hem9uUmVjb3JkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhYUFtYXpvblJlY29yZFByb3BzIGV4dGVuZHMgUmVjb3JkU2V0T3B0aW9ucyB7fVxuXG4vKipcbiAqIEEgRE5TIEFtYXpvbiBDQUEgcmVjb3JkLlxuICpcbiAqIEEgQ0FBIHJlY29yZCB0byByZXN0cmljdCBjZXJ0aWZpY2F0ZSBhdXRob3JpdGllcyBhbGxvd2VkXG4gKiB0byBpc3N1ZSBjZXJ0aWZpY2F0ZXMgZm9yIGEgZG9tYWluIHRvIEFtYXpvbiBvbmx5LlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6OlJlY29yZFNldFxuICovXG5leHBvcnQgY2xhc3MgQ2FhQW1hem9uUmVjb3JkIGV4dGVuZHMgQ2FhUmVjb3JkIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENhYUFtYXpvblJlY29yZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHZhbHVlczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmxhZzogMCxcbiAgICAgICAgICB0YWc6IENhYVRhZy5JU1NVRSxcbiAgICAgICAgICB2YWx1ZTogJ2FtYXpvbi5jb20nLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTVggcmVjb3JkIHZhbHVlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE14UmVjb3JkVmFsdWUge1xuICAvKipcbiAgICogVGhlIHByaW9yaXR5LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJpb3JpdHk6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1haWwgc2VydmVyIGhvc3QgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGhvc3ROYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgTXhSZWNvcmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTXhSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHZhbHVlcy5cbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlczogTXhSZWNvcmRWYWx1ZVtdO1xufVxuXG4vKipcbiAqIEEgRE5TIE1YIHJlY29yZFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6OlJlY29yZFNldFxuICovXG5leHBvcnQgY2xhc3MgTXhSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTXhSZWNvcmRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZWNvcmRUeXBlOiBSZWNvcmRUeXBlLk1YLFxuICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbVZhbHVlcyguLi5wcm9wcy52YWx1ZXMubWFwKHYgPT4gYCR7di5wcmlvcml0eX0gJHt2Lmhvc3ROYW1lfWApKSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIE5TUmVjb3JkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5zUmVjb3JkUHJvcHMgZXh0ZW5kcyBSZWNvcmRTZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBOUyB2YWx1ZXMuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIEEgRE5TIE5TIHJlY29yZFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6OlJlY29yZFNldFxuICovXG5leHBvcnQgY2xhc3MgTnNSZWNvcmQgZXh0ZW5kcyBSZWNvcmRTZXQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTnNSZWNvcmRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZWNvcmRUeXBlOiBSZWNvcmRUeXBlLk5TLFxuICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbVZhbHVlcyguLi5wcm9wcy52YWx1ZXMpLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgRFNSZWNvcmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRHNSZWNvcmRQcm9wcyBleHRlbmRzIFJlY29yZFNldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIERTIHZhbHVlcy5cbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlczogc3RyaW5nW107XG59XG5cbi8qKlxuICogQSBETlMgRFMgcmVjb3JkXG4gKlxuICogQHJlc291cmNlIEFXUzo6Um91dGU1Mzo6UmVjb3JkU2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBEc1JlY29yZCBleHRlbmRzIFJlY29yZFNldCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEc1JlY29yZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlY29yZFR5cGU6IFJlY29yZFR5cGUuRFMsXG4gICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tVmFsdWVzKC4uLnByb3BzLnZhbHVlcyksXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBab25lRGVsZWdhdGlvblJlY29yZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvcHMgZXh0ZW5kcyBSZWNvcmRTZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIHNlcnZlcnMgdG8gcmVwb3J0IGluIHRoZSBkZWxlZ2F0aW9uIHJlY29yZHMuXG4gICAqL1xuICByZWFkb25seSBuYW1lU2VydmVyczogc3RyaW5nW107XG59XG5cbi8qKlxuICogQSByZWNvcmQgdG8gZGVsZWdhdGUgZnVydGhlciBsb29rdXBzIHRvIGEgZGlmZmVyZW50IHNldCBvZiBuYW1lIHNlcnZlcnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBab25lRGVsZWdhdGlvblJlY29yZCBleHRlbmRzIFJlY29yZFNldCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBab25lRGVsZWdhdGlvblJlY29yZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlY29yZFR5cGU6IFJlY29yZFR5cGUuTlMsXG4gICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tVmFsdWVzKC4uLlRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5uYW1lU2VydmVycylcbiAgICAgICAgPyBwcm9wcy5uYW1lU2VydmVycyAvLyBDYW4ndCBtYXAgYSBzdHJpbmctYXJyYXkgdG9rZW4hXG4gICAgICAgIDogcHJvcHMubmFtZVNlcnZlcnMubWFwKG5zID0+IChUb2tlbi5pc1VucmVzb2x2ZWQobnMpIHx8IG5zLmVuZHNXaXRoKCcuJykpID8gbnMgOiBgJHtuc30uYCksXG4gICAgICApLFxuICAgICAgdHRsOiBwcm9wcy50dGwgfHwgRHVyYXRpb24uZGF5cygyKSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25SZWNvcmRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgem9uZSB0byBiZSBkZWxlZ2F0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGRlbGVnYXRlZFpvbmU6IElIb3N0ZWRab25lO1xuXG4gIC8qKlxuICAgKiBUaGUgaG9zdGVkIHpvbmUgbmFtZSBpbiB0aGUgcGFyZW50IGFjY291bnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB6b25lIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHBhcmVudEhvc3RlZFpvbmVOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaG9zdGVkIHpvbmUgaWQgaW4gdGhlIHBhcmVudCBhY2NvdW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gem9uZSBpZFxuICAgKi9cbiAgcmVhZG9ubHkgcGFyZW50SG9zdGVkWm9uZUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVsZWdhdGlvbiByb2xlIGluIHRoZSBwYXJlbnQgYWNjb3VudFxuICAgKi9cbiAgcmVhZG9ubHkgZGVsZWdhdGlvblJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIHJlY29yZCBjYWNoZSB0aW1lIHRvIGxpdmUgKFRUTCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmRheXMoMilcbiAgICovXG4gIHJlYWRvbmx5IHR0bD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVtb3ZhbCBwb2xpY3kgdG8gYXBwbHkgdG8gdGhlIHJlY29yZCBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZhbFBvbGljeT86IFJlbW92YWxQb2xpY3k7XG59XG5cbi8qKlxuICogQSBDcm9zcyBBY2NvdW50IFpvbmUgRGVsZWdhdGlvbiByZWNvcmRcbiAqL1xuZXhwb3J0IGNsYXNzIENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKCFwcm9wcy5wYXJlbnRIb3N0ZWRab25lTmFtZSAmJiAhcHJvcHMucGFyZW50SG9zdGVkWm9uZUlkKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIHBhcmVudEhvc3RlZFpvbmVOYW1lIG9yIHBhcmVudEhvc3RlZFpvbmVJZCBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5wYXJlbnRIb3N0ZWRab25lTmFtZSAmJiBwcm9wcy5wYXJlbnRIb3N0ZWRab25lSWQpIHtcbiAgICAgIHRocm93IEVycm9yKCdPbmx5IG9uZSBvZiBwYXJlbnRIb3N0ZWRab25lTmFtZSBhbmQgcGFyZW50SG9zdGVkWm9uZUlkIGlzIHN1cHBvcnRlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHRoaXMsIENST1NTX0FDQ09VTlRfWk9ORV9ERUxFR0FUSU9OX1JFU09VUkNFX1RZUEUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdjcm9zcy1hY2NvdW50LXpvbmUtZGVsZWdhdGlvbi1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybih0aGlzLCAnY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24taGFuZGxlci1yb2xlJywgcHJvdmlkZXIucm9sZUFybik7XG5cbiAgICBjb25zdCBhZGRUb1ByaW5jaXBsZVBvbGljeVJlc3VsdCA9IHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogWydzdHM6QXNzdW1lUm9sZSddLFxuICAgICAgcmVzb3VyY2VzOiBbcHJvcHMuZGVsZWdhdGlvblJvbGUucm9sZUFybl0sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdXNlUmVnaW9uYWxTdHNFbmRwb2ludCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KFVTRV9SRUdJT05BTF9TVFNfRU5EUE9JTlRfQ09OVEVYVF9LRVkpO1xuXG4gICAgY29uc3QgY3VzdG9tUmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0Nyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uQ3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IENST1NTX0FDQ09VTlRfWk9ORV9ERUxFR0FUSU9OX1JFU09VUkNFX1RZUEUsXG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIHJlbW92YWxQb2xpY3k6IHByb3BzLnJlbW92YWxQb2xpY3ksXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEFzc3VtZVJvbGVBcm46IHByb3BzLmRlbGVnYXRpb25Sb2xlLnJvbGVBcm4sXG4gICAgICAgIFBhcmVudFpvbmVOYW1lOiBwcm9wcy5wYXJlbnRIb3N0ZWRab25lTmFtZSxcbiAgICAgICAgUGFyZW50Wm9uZUlkOiBwcm9wcy5wYXJlbnRIb3N0ZWRab25lSWQsXG4gICAgICAgIERlbGVnYXRlZFpvbmVOYW1lOiBwcm9wcy5kZWxlZ2F0ZWRab25lLnpvbmVOYW1lLFxuICAgICAgICBEZWxlZ2F0ZWRab25lTmFtZVNlcnZlcnM6IHByb3BzLmRlbGVnYXRlZFpvbmUuaG9zdGVkWm9uZU5hbWVTZXJ2ZXJzISxcbiAgICAgICAgVFRMOiAocHJvcHMudHRsIHx8IER1cmF0aW9uLmRheXMoMikpLnRvU2Vjb25kcygpLFxuICAgICAgICBVc2VSZWdpb25hbFN0c0VuZHBvaW50OiB1c2VSZWdpb25hbFN0c0VuZHBvaW50ID8gJ3RydWUnIDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmIChhZGRUb1ByaW5jaXBsZVBvbGljeVJlc3VsdC5wb2xpY3lEZXBlbmRhYmxlKSB7XG4gICAgICBjdXN0b21SZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koYWRkVG9QcmluY2lwbGVQb2xpY3lSZXN1bHQucG9saWN5RGVwZW5kYWJsZSk7XG4gICAgfVxuICB9XG59XG4iXX0=