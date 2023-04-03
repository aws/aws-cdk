"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateHostedZone = exports.PublicHostedZone = exports.HostedZone = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const record_set_1 = require("./record-set");
const route53_generated_1 = require("./route53.generated");
const util_1 = require("./util");
/**
 * Container for records, and records contain information about how to route traffic for a
 * specific domain, such as example.com and its subdomains (acme.example.com, zenith.example.com)
 */
class HostedZone extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * VPCs to which this hosted zone will be added
         */
        this.vpcs = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_HostedZoneProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HostedZone);
            }
            throw error;
        }
        util_1.validateZoneName(props.zoneName);
        const resource = new route53_generated_1.CfnHostedZone(this, 'Resource', {
            name: props.zoneName + '.',
            hostedZoneConfig: props.comment ? { comment: props.comment } : undefined,
            queryLoggingConfig: props.queryLogsLogGroupArn ? { cloudWatchLogsLogGroupArn: props.queryLogsLogGroupArn } : undefined,
            vpcs: core_1.Lazy.any({ produce: () => this.vpcs.length === 0 ? undefined : this.vpcs }),
        });
        this.hostedZoneId = resource.ref;
        this.hostedZoneNameServers = resource.attrNameServers;
        this.zoneName = props.zoneName;
        for (const vpc of props.vpcs || []) {
            this.addVpc(vpc);
        }
    }
    get hostedZoneArn() {
        return util_1.makeHostedZoneArn(this, this.hostedZoneId);
    }
    /**
     * Import a Route 53 hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a HostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then the HostedZone should be imported with `fromHostedZoneAttributes()` or `fromLookup()`
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param hostedZoneId the ID of the hosted zone to import
     */
    static fromHostedZoneId(scope, id, hostedZoneId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.hostedZoneId = hostedZoneId;
            }
            get zoneName() {
                throw new Error('Cannot reference `zoneName` when using `HostedZone.fromHostedZoneId()`. A construct consuming this hosted zone may be trying to reference its `zoneName`. If this is the case, use `fromHostedZoneAttributes()` or `fromLookup()` instead.');
            }
            get hostedZoneArn() {
                return util_1.makeHostedZoneArn(this, this.hostedZoneId);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports a hosted zone from another stack.
     *
     * Use when both hosted zone ID and hosted zone name are known.
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param attrs the HostedZoneAttributes (hosted zone ID and hosted zone name)
     */
    static fromHostedZoneAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_HostedZoneAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromHostedZoneAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.hostedZoneId = attrs.hostedZoneId;
                this.zoneName = attrs.zoneName;
            }
            get hostedZoneArn() {
                return util_1.makeHostedZoneArn(this, this.hostedZoneId);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Lookup a hosted zone in the current account/region based on query parameters.
     * Requires environment, you must specify env for the stack.
     *
     * Use to easily query hosted zones.
     *
     * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
     */
    static fromLookup(scope, id, query) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_HostedZoneProviderProps(query);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        if (!query.domainName) {
            throw new Error('Cannot use undefined value for attribute `domainName`');
        }
        const DEFAULT_HOSTED_ZONE = {
            Id: 'DUMMY',
            Name: query.domainName,
        };
        const response = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.HOSTED_ZONE_PROVIDER,
            dummyValue: DEFAULT_HOSTED_ZONE,
            props: query,
        }).value;
        // CDK handles the '.' at the end, so remove it here
        if (response.Name.endsWith('.')) {
            response.Name = response.Name.substring(0, response.Name.length - 1);
        }
        response.Id = response.Id.replace('/hostedzone/', '');
        return HostedZone.fromHostedZoneAttributes(scope, id, {
            hostedZoneId: response.Id,
            zoneName: response.Name,
        });
    }
    /**
     * Add another VPC to this private hosted zone.
     *
     * @param vpc the other VPC to add.
     */
    addVpc(vpc) {
        this.vpcs.push({ vpcId: vpc.vpcId, vpcRegion: vpc.env.region ?? core_1.Stack.of(vpc).region });
    }
}
exports.HostedZone = HostedZone;
_a = JSII_RTTI_SYMBOL_1;
HostedZone[_a] = { fqn: "@aws-cdk/aws-route53.HostedZone", version: "0.0.0" };
/**
 * Create a Route53 public hosted zone.
 *
 * @resource AWS::Route53::HostedZone
 */
class PublicHostedZone extends HostedZone {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_PublicHostedZoneProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PublicHostedZone);
            }
            throw error;
        }
        if (props.caaAmazon) {
            new record_set_1.CaaAmazonRecord(this, 'CaaAmazon', {
                zone: this,
            });
        }
        if (!props.crossAccountZoneDelegationPrincipal && props.crossAccountZoneDelegationRoleName) {
            throw Error('crossAccountZoneDelegationRoleName property is not supported without crossAccountZoneDelegationPrincipal');
        }
        if (props.crossAccountZoneDelegationPrincipal) {
            this.crossAccountZoneDelegationRole = new iam.Role(this, 'CrossAccountZoneDelegationRole', {
                roleName: props.crossAccountZoneDelegationRoleName,
                assumedBy: props.crossAccountZoneDelegationPrincipal,
                inlinePolicies: {
                    delegation: new iam.PolicyDocument({
                        statements: [
                            new iam.PolicyStatement({
                                actions: ['route53:ChangeResourceRecordSets'],
                                resources: [this.hostedZoneArn],
                                conditions: {
                                    'ForAllValues:StringEquals': {
                                        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
                                        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                                    },
                                },
                            }),
                            new iam.PolicyStatement({
                                actions: ['route53:ListHostedZonesByName'],
                                resources: ['*'],
                            }),
                        ],
                    }),
                },
            });
        }
    }
    /**
     * Import a Route 53 public hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a PublicHostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then the PublicHostedZone should be imported with `fromPublicHostedZoneAttributes()`.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param publicHostedZoneId the ID of the public hosted zone to import
     */
    static fromPublicHostedZoneId(scope, id, publicHostedZoneId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.hostedZoneId = publicHostedZoneId;
            }
            get zoneName() { throw new Error('Cannot reference `zoneName` when using `PublicHostedZone.fromPublicHostedZoneId()`. A construct consuming this hosted zone may be trying to reference its `zoneName`. If this is the case, use `fromPublicHostedZoneAttributes()` instead'); }
            get hostedZoneArn() {
                return util_1.makeHostedZoneArn(this, this.hostedZoneId);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports a public hosted zone from another stack.
     *
     * Use when both hosted zone ID and hosted zone name are known.
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param attrs the PublicHostedZoneAttributes (hosted zone ID and hosted zone name)
     */
    static fromPublicHostedZoneAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_PublicHostedZoneAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPublicHostedZoneAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.hostedZoneId = attrs.hostedZoneId;
                this.zoneName = attrs.zoneName;
            }
            get hostedZoneArn() {
                return util_1.makeHostedZoneArn(this, this.hostedZoneId);
            }
        }
        return new Import(scope, id);
    }
    addVpc(_vpc) {
        throw new Error('Cannot associate public hosted zones with a VPC');
    }
    /**
     * Adds a delegation from this zone to a designated zone.
     *
     * @param delegate the zone being delegated to.
     * @param opts     options for creating the DNS record, if any.
     */
    addDelegation(delegate, opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_IPublicHostedZone(delegate);
            jsiiDeprecationWarnings._aws_cdk_aws_route53_ZoneDelegationOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDelegation);
            }
            throw error;
        }
        new record_set_1.ZoneDelegationRecord(this, `${this.zoneName} -> ${delegate.zoneName}`, {
            zone: this,
            recordName: delegate.zoneName,
            nameServers: delegate.hostedZoneNameServers,
            comment: opts.comment,
            ttl: opts.ttl,
        });
    }
    /**
     * Grant permissions to add delegation records to this zone
     */
    grantDelegation(grantee) {
        const g1 = iam.Grant.addToPrincipal({
            grantee,
            actions: ['route53:ChangeResourceRecordSets'],
            resourceArns: [this.hostedZoneArn],
            conditions: {
                'ForAllValues:StringEquals': {
                    'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
                    'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                },
            },
        });
        const g2 = iam.Grant.addToPrincipal({
            grantee,
            actions: ['route53:ListHostedZonesByName'],
            resourceArns: ['*'],
        });
        return g1.combine(g2);
    }
}
exports.PublicHostedZone = PublicHostedZone;
_b = JSII_RTTI_SYMBOL_1;
PublicHostedZone[_b] = { fqn: "@aws-cdk/aws-route53.PublicHostedZone", version: "0.0.0" };
/**
 * Create a Route53 private hosted zone for use in one or more VPCs.
 *
 * Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
 * for the VPC you're configuring for private hosted zones.
 *
 * @resource AWS::Route53::HostedZone
 */
class PrivateHostedZone extends HostedZone {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_PrivateHostedZoneProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrivateHostedZone);
            }
            throw error;
        }
        this.addVpc(props.vpc);
    }
    /**
     * Import a Route 53 private hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a HostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then you cannot import a PrivateHostedZone.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param privateHostedZoneId the ID of the private hosted zone to import
     */
    static fromPrivateHostedZoneId(scope, id, privateHostedZoneId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.hostedZoneId = privateHostedZoneId;
            }
            get zoneName() { throw new Error('Cannot reference `zoneName` when using `PrivateHostedZone.fromPrivateHostedZoneId()`. A construct consuming this hosted zone may be trying to reference its `zoneName`'); }
            get hostedZoneArn() {
                return util_1.makeHostedZoneArn(this, this.hostedZoneId);
            }
        }
        return new Import(scope, id);
    }
}
exports.PrivateHostedZone = PrivateHostedZone;
_c = JSII_RTTI_SYMBOL_1;
PrivateHostedZone[_c] = { fqn: "@aws-cdk/aws-route53.PrivateHostedZone", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdGVkLXpvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3N0ZWQtem9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFDeEMsMkRBQTJEO0FBQzNELHdDQUFpRjtBQUlqRiw2Q0FBcUU7QUFDckUsMkRBQW9EO0FBQ3BELGlDQUE2RDtBQTBDN0Q7OztHQUdHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsZUFBUTtJQXFHdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBTm5COztXQUVHO1FBQ2dCLFNBQUksR0FBRyxJQUFJLEtBQUssRUFBNkIsQ0FBQzs7Ozs7OytDQW5HdEQsVUFBVTs7OztRQXdHbkIsdUJBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUksaUNBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELElBQUksRUFBRSxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUc7WUFDMUIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3hFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSx5QkFBeUIsRUFBRSxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN0SCxJQUFJLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2xGLENB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RUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQ2xDLE9BQU87WUFDUCxPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztZQUMxQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZCOztBQW5JSCw0Q0FvSUM7OztBQXVDRDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxVQUFVO0lBdUIvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBeEJmLGlCQUFpQjs7OztRQTBCMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEI7SUF6QkQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLHVCQUF1QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLG1CQUEyQjtRQUM3RixNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0IsaUJBQVksR0FBRyxtQkFBbUIsQ0FBQztZQUtyRCxDQUFDO1lBSkMsSUFBVyxRQUFRLEtBQWEsTUFBTSxJQUFJLEtBQUssQ0FBQyx3S0FBd0ssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1TixJQUFXLGFBQWE7Z0JBQ3RCLE9BQU8sd0JBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwRCxDQUFDO1NBQ0Y7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7QUFyQkgsOENBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IENvbnRleHRQcm92aWRlciwgRHVyYXRpb24sIExhenksIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBIb3N0ZWRab25lUHJvdmlkZXJQcm9wcyB9IGZyb20gJy4vaG9zdGVkLXpvbmUtcHJvdmlkZXInO1xuaW1wb3J0IHsgSG9zdGVkWm9uZUF0dHJpYnV0ZXMsIElIb3N0ZWRab25lLCBQdWJsaWNIb3N0ZWRab25lQXR0cmlidXRlcyB9IGZyb20gJy4vaG9zdGVkLXpvbmUtcmVmJztcbmltcG9ydCB7IENhYUFtYXpvblJlY29yZCwgWm9uZURlbGVnYXRpb25SZWNvcmQgfSBmcm9tICcuL3JlY29yZC1zZXQnO1xuaW1wb3J0IHsgQ2ZuSG9zdGVkWm9uZSB9IGZyb20gJy4vcm91dGU1My5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgbWFrZUhvc3RlZFpvbmVBcm4sIHZhbGlkYXRlWm9uZU5hbWUgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIENvbW1vbiBwcm9wZXJ0aWVzIHRvIGNyZWF0ZSBhIFJvdXRlIDUzIGhvc3RlZCB6b25lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uSG9zdGVkWm9uZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBkb21haW4uIEZvciByZXNvdXJjZSByZWNvcmQgdHlwZXMgdGhhdCBpbmNsdWRlIGEgZG9tYWluXG4gICAqIG5hbWUsIHNwZWNpZnkgYSBmdWxseSBxdWFsaWZpZWQgZG9tYWluIG5hbWUuXG4gICAqL1xuICByZWFkb25seSB6b25lTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbnkgY29tbWVudHMgdGhhdCB5b3Ugd2FudCB0byBpbmNsdWRlIGFib3V0IHRoZSBob3N0ZWQgem9uZS5cbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIGZvciB0aGUgbG9nIGdyb3VwIHRoYXQgeW91IHdhbnQgQW1hem9uIFJvdXRlIDUzIHRvIHNlbmQgcXVlcnkgbG9ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5TG9nc0xvZ0dyb3VwQXJuPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgYSBuZXcgaG9zdGVkIHpvbmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3N0ZWRab25lUHJvcHMgZXh0ZW5kcyBDb21tb25Ib3N0ZWRab25lUHJvcHMge1xuICAvKipcbiAgICogQSBWUEMgdGhhdCB5b3Ugd2FudCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIGhvc3RlZCB6b25lLiBXaGVuIHlvdSBzcGVjaWZ5XG4gICAqIHRoaXMgcHJvcGVydHksIGEgcHJpdmF0ZSBob3N0ZWQgem9uZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIFlvdSBjYW4gYXNzb2NpYXRlIGFkZGl0aW9uYWwgVlBDcyB0byB0aGlzIHByaXZhdGUgem9uZSB1c2luZyBgYWRkVnBjKHZwYylgLlxuICAgKlxuICAgKiBAZGVmYXVsdCBwdWJsaWMgKG5vIFZQQ3MgYXNzb2NpYXRlZClcbiAgICovXG4gIHJlYWRvbmx5IHZwY3M/OiBlYzIuSVZwY1tdO1xufVxuXG4vKipcbiAqIENvbnRhaW5lciBmb3IgcmVjb3JkcywgYW5kIHJlY29yZHMgY29udGFpbiBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8gcm91dGUgdHJhZmZpYyBmb3IgYVxuICogc3BlY2lmaWMgZG9tYWluLCBzdWNoIGFzIGV4YW1wbGUuY29tIGFuZCBpdHMgc3ViZG9tYWlucyAoYWNtZS5leGFtcGxlLmNvbSwgemVuaXRoLmV4YW1wbGUuY29tKVxuICovXG5leHBvcnQgY2xhc3MgSG9zdGVkWm9uZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUhvc3RlZFpvbmUge1xuICBwdWJsaWMgZ2V0IGhvc3RlZFpvbmVBcm4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWFrZUhvc3RlZFpvbmVBcm4odGhpcywgdGhpcy5ob3N0ZWRab25lSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFJvdXRlIDUzIGhvc3RlZCB6b25lIGRlZmluZWQgZWl0aGVyIG91dHNpZGUgdGhlIENESywgb3IgaW4gYSBkaWZmZXJlbnQgQ0RLIHN0YWNrXG4gICAqXG4gICAqIFVzZSB3aGVuIGhvc3RlZCB6b25lIElEIGlzIGtub3duLiBJZiBhIEhvc3RlZFpvbmUgaXMgaW1wb3J0ZWQgd2l0aCB0aGlzIG1ldGhvZCB0aGUgem9uZU5hbWUgY2Fubm90IGJlIHJlZmVyZW5jZWQuXG4gICAqIElmIHRoZSB6b25lTmFtZSBpcyBuZWVkZWQgdGhlbiB0aGUgSG9zdGVkWm9uZSBzaG91bGQgYmUgaW1wb3J0ZWQgd2l0aCBgZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKClgIG9yIGBmcm9tTG9va3VwKClgXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCBmb3IgdGhpcyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkICB0aGUgbG9naWNhbCBuYW1lIG9mIHRoaXMgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBob3N0ZWRab25lSWQgdGhlIElEIG9mIHRoZSBob3N0ZWQgem9uZSB0byBpbXBvcnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUhvc3RlZFpvbmVJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBob3N0ZWRab25lSWQ6IHN0cmluZyk6IElIb3N0ZWRab25lIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElIb3N0ZWRab25lIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBob3N0ZWRab25lSWQgPSBob3N0ZWRab25lSWQ7XG4gICAgICBwdWJsaWMgZ2V0IHpvbmVOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlZmVyZW5jZSBgem9uZU5hbWVgIHdoZW4gdXNpbmcgYEhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVJZCgpYC4gQSBjb25zdHJ1Y3QgY29uc3VtaW5nIHRoaXMgaG9zdGVkIHpvbmUgbWF5IGJlIHRyeWluZyB0byByZWZlcmVuY2UgaXRzIGB6b25lTmFtZWAuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHVzZSBgZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKClgIG9yIGBmcm9tTG9va3VwKClgIGluc3RlYWQuJyk7XG4gICAgICB9XG4gICAgICBwdWJsaWMgZ2V0IGhvc3RlZFpvbmVBcm4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG1ha2VIb3N0ZWRab25lQXJuKHRoaXMsIHRoaXMuaG9zdGVkWm9uZUlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYSBob3N0ZWQgem9uZSBmcm9tIGFub3RoZXIgc3RhY2suXG4gICAqXG4gICAqIFVzZSB3aGVuIGJvdGggaG9zdGVkIHpvbmUgSUQgYW5kIGhvc3RlZCB6b25lIG5hbWUgYXJlIGtub3duLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCAgdGhlIGxvZ2ljYWwgbmFtZSBvZiB0aGlzIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIEhvc3RlZFpvbmVBdHRyaWJ1dGVzIChob3N0ZWQgem9uZSBJRCBhbmQgaG9zdGVkIHpvbmUgbmFtZSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBIb3N0ZWRab25lQXR0cmlidXRlcyk6IElIb3N0ZWRab25lIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElIb3N0ZWRab25lIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBob3N0ZWRab25lSWQgPSBhdHRycy5ob3N0ZWRab25lSWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgem9uZU5hbWUgPSBhdHRycy56b25lTmFtZTtcbiAgICAgIHB1YmxpYyBnZXQgaG9zdGVkWm9uZUFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbWFrZUhvc3RlZFpvbmVBcm4odGhpcywgdGhpcy5ob3N0ZWRab25lSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIGEgaG9zdGVkIHpvbmUgaW4gdGhlIGN1cnJlbnQgYWNjb3VudC9yZWdpb24gYmFzZWQgb24gcXVlcnkgcGFyYW1ldGVycy5cbiAgICogUmVxdWlyZXMgZW52aXJvbm1lbnQsIHlvdSBtdXN0IHNwZWNpZnkgZW52IGZvciB0aGUgc3RhY2suXG4gICAqXG4gICAqIFVzZSB0byBlYXNpbHkgcXVlcnkgaG9zdGVkIHpvbmVzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2Vudmlyb25tZW50cy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Mb29rdXAoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcXVlcnk6IEhvc3RlZFpvbmVQcm92aWRlclByb3BzKTogSUhvc3RlZFpvbmUge1xuICAgIGlmICghcXVlcnkuZG9tYWluTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIHVuZGVmaW5lZCB2YWx1ZSBmb3IgYXR0cmlidXRlIGBkb21haW5OYW1lYCcpO1xuICAgIH1cblxuICAgIGNvbnN0IERFRkFVTFRfSE9TVEVEX1pPTkU6IEhvc3RlZFpvbmVDb250ZXh0UmVzcG9uc2UgPSB7XG4gICAgICBJZDogJ0RVTU1ZJyxcbiAgICAgIE5hbWU6IHF1ZXJ5LmRvbWFpbk5hbWUsXG4gICAgfTtcblxuICAgIGludGVyZmFjZSBIb3N0ZWRab25lQ29udGV4dFJlc3BvbnNlIHtcbiAgICAgIElkOiBzdHJpbmc7XG4gICAgICBOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2U6IEhvc3RlZFpvbmVDb250ZXh0UmVzcG9uc2UgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuSE9TVEVEX1pPTkVfUFJPVklERVIsXG4gICAgICBkdW1teVZhbHVlOiBERUZBVUxUX0hPU1RFRF9aT05FLFxuICAgICAgcHJvcHM6IHF1ZXJ5LFxuICAgIH0pLnZhbHVlO1xuXG4gICAgLy8gQ0RLIGhhbmRsZXMgdGhlICcuJyBhdCB0aGUgZW5kLCBzbyByZW1vdmUgaXQgaGVyZVxuICAgIGlmIChyZXNwb25zZS5OYW1lLmVuZHNXaXRoKCcuJykpIHtcbiAgICAgIHJlc3BvbnNlLk5hbWUgPSByZXNwb25zZS5OYW1lLnN1YnN0cmluZygwLCByZXNwb25zZS5OYW1lLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHJlc3BvbnNlLklkID0gcmVzcG9uc2UuSWQucmVwbGFjZSgnL2hvc3RlZHpvbmUvJywgJycpO1xuXG4gICAgcmV0dXJuIEhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHNjb3BlLCBpZCwge1xuICAgICAgaG9zdGVkWm9uZUlkOiByZXNwb25zZS5JZCxcbiAgICAgIHpvbmVOYW1lOiByZXNwb25zZS5OYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgem9uZU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGhvc3RlZFpvbmVOYW1lU2VydmVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBWUENzIHRvIHdoaWNoIHRoaXMgaG9zdGVkIHpvbmUgd2lsbCBiZSBhZGRlZFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHZwY3MgPSBuZXcgQXJyYXk8Q2ZuSG9zdGVkWm9uZS5WUENQcm9wZXJ0eT4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSG9zdGVkWm9uZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHZhbGlkYXRlWm9uZU5hbWUocHJvcHMuem9uZU5hbWUpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuSG9zdGVkWm9uZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy56b25lTmFtZSArICcuJyxcbiAgICAgIGhvc3RlZFpvbmVDb25maWc6IHByb3BzLmNvbW1lbnQgPyB7IGNvbW1lbnQ6IHByb3BzLmNvbW1lbnQgfSA6IHVuZGVmaW5lZCxcbiAgICAgIHF1ZXJ5TG9nZ2luZ0NvbmZpZzogcHJvcHMucXVlcnlMb2dzTG9nR3JvdXBBcm4gPyB7IGNsb3VkV2F0Y2hMb2dzTG9nR3JvdXBBcm46IHByb3BzLnF1ZXJ5TG9nc0xvZ0dyb3VwQXJuIH0gOiB1bmRlZmluZWQsXG4gICAgICB2cGNzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMudnBjcy5sZW5ndGggPT09IDAgPyB1bmRlZmluZWQgOiB0aGlzLnZwY3MgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmhvc3RlZFpvbmVJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmhvc3RlZFpvbmVOYW1lU2VydmVycyA9IHJlc291cmNlLmF0dHJOYW1lU2VydmVycztcbiAgICB0aGlzLnpvbmVOYW1lID0gcHJvcHMuem9uZU5hbWU7XG5cbiAgICBmb3IgKGNvbnN0IHZwYyBvZiBwcm9wcy52cGNzIHx8IFtdKSB7XG4gICAgICB0aGlzLmFkZFZwYyh2cGMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBWUEMgdG8gdGhpcyBwcml2YXRlIGhvc3RlZCB6b25lLlxuICAgKlxuICAgKiBAcGFyYW0gdnBjIHRoZSBvdGhlciBWUEMgdG8gYWRkLlxuICAgKi9cbiAgcHVibGljIGFkZFZwYyh2cGM6IGVjMi5JVnBjKSB7XG4gICAgdGhpcy52cGNzLnB1c2goeyB2cGNJZDogdnBjLnZwY0lkLCB2cGNSZWdpb246IHZwYy5lbnYucmVnaW9uID8/IFN0YWNrLm9mKHZwYykucmVnaW9uIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgUHVibGljSG9zdGVkWm9uZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQdWJsaWNIb3N0ZWRab25lUHJvcHMgZXh0ZW5kcyBDb21tb25Ib3N0ZWRab25lUHJvcHMge1xuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgYSBDQUEgcmVjb3JkIHRvIHJlc3RyaWN0IGNlcnRpZmljYXRlIGF1dGhvcml0aWVzIGFsbG93ZWRcbiAgICogdG8gaXNzdWUgY2VydGlmaWNhdGVzIGZvciB0aGlzIGRvbWFpbiB0byBBbWF6b24gb25seS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNhYUFtYXpvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgcHJpbmNpcGFsIHdoaWNoIGlzIHRydXN0ZWQgdG8gYXNzdW1lIGEgcm9sZSBmb3Igem9uZSBkZWxlZ2F0aW9uXG4gICAqXG4gICAqIElmIHN1cHBsaWVkLCB0aGlzIHdpbGwgY3JlYXRlIGEgUm9sZSBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBIb3N0ZWRcbiAgICogWm9uZSwgd2hpY2ggY2FuIGJlIGFzc3VtZWQgYnkgdGhlIGBDcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZGAgdG9cbiAgICogY3JlYXRlIGEgZGVsZWdhdGlvbiByZWNvcmQgdG8gYSB6b25lIGluIGEgZGlmZmVyZW50IGFjY291bnQuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW5kaWNhdGUgdGhlIGFjY291bnQocykgdGhhdCB5b3UgdHJ1c3QgdG8gY3JlYXRlIGRlbGVnYXRpb25cbiAgICogcmVjb3JkcywgdXNpbmcgZWl0aGVyIGBpYW0uQWNjb3VudFByaW5jaXBhbGAgb3IgYGlhbS5Pcmdhbml6YXRpb25QcmluY2lwYWxgLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHBsYW5uaW5nIHRvIHVzZSBgaWFtLlNlcnZpY2VQcmluY2lwYWxgcyBoZXJlLCBiZSBzdXJlIHRvIGluY2x1ZGVcbiAgICogcmVnaW9uLXNwZWNpZmljIHNlcnZpY2UgcHJpbmNpcGFscyBmb3IgZXZlcnkgb3B0LWluIHJlZ2lvbiB5b3UgYXJlIGdvaW5nIHRvXG4gICAqIGJlIGRlbGVnYXRpbmcgdG87IG9yIGRvbid0IHVzZSB0aGlzIGZlYXR1cmUgYW5kIGNyZWF0ZSBzZXBhcmF0ZSByb2xlc1xuICAgKiB3aXRoIGFwcHJvcHJpYXRlIHBlcm1pc3Npb25zIGZvciBldmVyeSBvcHQtaW4gcmVnaW9uIGluc3RlYWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVsZWdhdGlvbiBjb25maWd1cmF0aW9uXG4gICAqIEBkZXByZWNhdGVkIENyZWF0ZSB0aGUgUm9sZSB5b3Vyc2VsZiBhbmQgY2FsbCBgaG9zdGVkWm9uZS5ncmFudERlbGVnYXRpb24oKWAuXG4gICAqL1xuICByZWFkb25seSBjcm9zc0FjY291bnRab25lRGVsZWdhdGlvblByaW5jaXBhbD86IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcm9sZSBjcmVhdGVkIGZvciBjcm9zcyBhY2NvdW50IGRlbGVnYXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHJvbGUgbmFtZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseVxuICAgKiBAZGVwcmVjYXRlZCBDcmVhdGUgdGhlIFJvbGUgeW91cnNlbGYgYW5kIGNhbGwgYGhvc3RlZFpvbmUuZ3JhbnREZWxlZ2F0aW9uKClgLlxuICAgKi9cbiAgcmVhZG9ubHkgY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgUm91dGUgNTMgcHVibGljIGhvc3RlZCB6b25lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVB1YmxpY0hvc3RlZFpvbmUgZXh0ZW5kcyBJSG9zdGVkWm9uZSB7IH1cblxuLyoqXG4gKiBDcmVhdGUgYSBSb3V0ZTUzIHB1YmxpYyBob3N0ZWQgem9uZS5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpSb3V0ZTUzOjpIb3N0ZWRab25lXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNIb3N0ZWRab25lIGV4dGVuZHMgSG9zdGVkWm9uZSBpbXBsZW1lbnRzIElQdWJsaWNIb3N0ZWRab25lIHtcblxuICAvKipcbiAgICogSW1wb3J0IGEgUm91dGUgNTMgcHVibGljIGhvc3RlZCB6b25lIGRlZmluZWQgZWl0aGVyIG91dHNpZGUgdGhlIENESywgb3IgaW4gYSBkaWZmZXJlbnQgQ0RLIHN0YWNrXG4gICAqXG4gICAqIFVzZSB3aGVuIGhvc3RlZCB6b25lIElEIGlzIGtub3duLiBJZiBhIFB1YmxpY0hvc3RlZFpvbmUgaXMgaW1wb3J0ZWQgd2l0aCB0aGlzIG1ldGhvZCB0aGUgem9uZU5hbWUgY2Fubm90IGJlIHJlZmVyZW5jZWQuXG4gICAqIElmIHRoZSB6b25lTmFtZSBpcyBuZWVkZWQgdGhlbiB0aGUgUHVibGljSG9zdGVkWm9uZSBzaG91bGQgYmUgaW1wb3J0ZWQgd2l0aCBgZnJvbVB1YmxpY0hvc3RlZFpvbmVBdHRyaWJ1dGVzKClgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCB0aGUgbG9naWNhbCBuYW1lIG9mIHRoaXMgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBwdWJsaWNIb3N0ZWRab25lSWQgdGhlIElEIG9mIHRoZSBwdWJsaWMgaG9zdGVkIHpvbmUgdG8gaW1wb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21QdWJsaWNIb3N0ZWRab25lSWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHVibGljSG9zdGVkWm9uZUlkOiBzdHJpbmcpOiBJUHVibGljSG9zdGVkWm9uZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUHVibGljSG9zdGVkWm9uZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgaG9zdGVkWm9uZUlkID0gcHVibGljSG9zdGVkWm9uZUlkO1xuICAgICAgcHVibGljIGdldCB6b25lTmFtZSgpOiBzdHJpbmcgeyB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZWZlcmVuY2UgYHpvbmVOYW1lYCB3aGVuIHVzaW5nIGBQdWJsaWNIb3N0ZWRab25lLmZyb21QdWJsaWNIb3N0ZWRab25lSWQoKWAuIEEgY29uc3RydWN0IGNvbnN1bWluZyB0aGlzIGhvc3RlZCB6b25lIG1heSBiZSB0cnlpbmcgdG8gcmVmZXJlbmNlIGl0cyBgem9uZU5hbWVgLiBJZiB0aGlzIGlzIHRoZSBjYXNlLCB1c2UgYGZyb21QdWJsaWNIb3N0ZWRab25lQXR0cmlidXRlcygpYCBpbnN0ZWFkJyk7IH1cbiAgICAgIHB1YmxpYyBnZXQgaG9zdGVkWm9uZUFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbWFrZUhvc3RlZFpvbmVBcm4odGhpcywgdGhpcy5ob3N0ZWRab25lSWQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYSBwdWJsaWMgaG9zdGVkIHpvbmUgZnJvbSBhbm90aGVyIHN0YWNrLlxuICAgKlxuICAgKiBVc2Ugd2hlbiBib3RoIGhvc3RlZCB6b25lIElEIGFuZCBob3N0ZWQgem9uZSBuYW1lIGFyZSBrbm93bi5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBwYXJlbnQgQ29uc3RydWN0IGZvciB0aGlzIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgIHRoZSBsb2dpY2FsIG5hbWUgb2YgdGhpcyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGF0dHJzIHRoZSBQdWJsaWNIb3N0ZWRab25lQXR0cmlidXRlcyAoaG9zdGVkIHpvbmUgSUQgYW5kIGhvc3RlZCB6b25lIG5hbWUpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21QdWJsaWNIb3N0ZWRab25lQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogUHVibGljSG9zdGVkWm9uZUF0dHJpYnV0ZXMpOiBJUHVibGljSG9zdGVkWm9uZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUHVibGljSG9zdGVkWm9uZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgaG9zdGVkWm9uZUlkID0gYXR0cnMuaG9zdGVkWm9uZUlkO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHpvbmVOYW1lID0gYXR0cnMuem9uZU5hbWU7XG4gICAgICBwdWJsaWMgZ2V0IGhvc3RlZFpvbmVBcm4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG1ha2VIb3N0ZWRab25lQXJuKHRoaXMsIHRoaXMuaG9zdGVkWm9uZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSb2xlIGZvciBjcm9zcyBhY2NvdW50IHpvbmUgZGVsZWdhdGlvblxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZT86IGlhbS5Sb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQdWJsaWNIb3N0ZWRab25lUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5jYWFBbWF6b24pIHtcbiAgICAgIG5ldyBDYWFBbWF6b25SZWNvcmQodGhpcywgJ0NhYUFtYXpvbicsIHtcbiAgICAgICAgem9uZTogdGhpcyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25QcmluY2lwYWwgJiYgcHJvcHMuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlTmFtZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ2Nyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZU5hbWUgcHJvcGVydHkgaXMgbm90IHN1cHBvcnRlZCB3aXRob3V0IGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsKSB7XG4gICAgICB0aGlzLmNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlJywge1xuICAgICAgICByb2xlTmFtZTogcHJvcHMuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlTmFtZSxcbiAgICAgICAgYXNzdW1lZEJ5OiBwcm9wcy5jcm9zc0FjY291bnRab25lRGVsZWdhdGlvblByaW5jaXBhbCxcbiAgICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgICBkZWxlZ2F0aW9uOiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgICAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMnXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFt0aGlzLmhvc3RlZFpvbmVBcm5dLFxuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICdGb3JBbGxWYWx1ZXM6U3RyaW5nRXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNSZWNvcmRUeXBlcyc6IFsnTlMnXSxcbiAgICAgICAgICAgICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzQWN0aW9ucyc6IFsnVVBTRVJUJywgJ0RFTEVURSddLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsncm91dGU1MzpMaXN0SG9zdGVkWm9uZXNCeU5hbWUnXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkVnBjKF92cGM6IGVjMi5JVnBjKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXNzb2NpYXRlIHB1YmxpYyBob3N0ZWQgem9uZXMgd2l0aCBhIFZQQycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkZWxlZ2F0aW9uIGZyb20gdGhpcyB6b25lIHRvIGEgZGVzaWduYXRlZCB6b25lLlxuICAgKlxuICAgKiBAcGFyYW0gZGVsZWdhdGUgdGhlIHpvbmUgYmVpbmcgZGVsZWdhdGVkIHRvLlxuICAgKiBAcGFyYW0gb3B0cyAgICAgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGhlIEROUyByZWNvcmQsIGlmIGFueS5cbiAgICovXG4gIHB1YmxpYyBhZGREZWxlZ2F0aW9uKGRlbGVnYXRlOiBJUHVibGljSG9zdGVkWm9uZSwgb3B0czogWm9uZURlbGVnYXRpb25PcHRpb25zID0ge30pOiB2b2lkIHtcbiAgICBuZXcgWm9uZURlbGVnYXRpb25SZWNvcmQodGhpcywgYCR7dGhpcy56b25lTmFtZX0gLT4gJHtkZWxlZ2F0ZS56b25lTmFtZX1gLCB7XG4gICAgICB6b25lOiB0aGlzLFxuICAgICAgcmVjb3JkTmFtZTogZGVsZWdhdGUuem9uZU5hbWUsXG4gICAgICBuYW1lU2VydmVyczogZGVsZWdhdGUuaG9zdGVkWm9uZU5hbWVTZXJ2ZXJzISwgLy8gUHVibGljSG9zdGVkWm9uZXMgYWx3YXlzIGhhdmUgbmFtZSBzZXJ2ZXJzIVxuICAgICAgY29tbWVudDogb3B0cy5jb21tZW50LFxuICAgICAgdHRsOiBvcHRzLnR0bCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byBhZGQgZGVsZWdhdGlvbiByZWNvcmRzIHRvIHRoaXMgem9uZVxuICAgKi9cbiAgcHVibGljIGdyYW50RGVsZWdhdGlvbihncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIGNvbnN0IGcxID0gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmhvc3RlZFpvbmVBcm5dLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0VxdWFscyc6IHtcbiAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNSZWNvcmRUeXBlcyc6IFsnTlMnXSxcbiAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNBY3Rpb25zJzogWydVUFNFUlQnLCAnREVMRVRFJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IGcyID0gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ3JvdXRlNTM6TGlzdEhvc3RlZFpvbmVzQnlOYW1lJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGcxLmNvbWJpbmUoZzIpO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBhdmFpbGFibGUgd2hlbiBjcmVhdGluZyBhIGRlbGVnYXRpb24gcmVsYXRpb25zaGlwIGZyb20gb25lIFB1YmxpY0hvc3RlZFpvbmUgdG8gYW5vdGhlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBab25lRGVsZWdhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogQSBjb21tZW50IHRvIGFkZCBvbiB0aGUgRE5TIHJlY29yZCBjcmVhdGVkIHRvIGluY29ycG9yYXRlIHRoZSBkZWxlZ2F0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVFRMIChUaW1lIFRvIExpdmUpIG9mIHRoZSBETlMgZGVsZWdhdGlvbiByZWNvcmQgaW4gRE5TIGNhY2hlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgMTcyODAwXG4gICAqL1xuICByZWFkb25seSB0dGw/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNyZWF0ZSBhIFJvdXRlIDUzIHByaXZhdGUgaG9zdGVkIHpvbmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcml2YXRlSG9zdGVkWm9uZVByb3BzIGV4dGVuZHMgQ29tbW9uSG9zdGVkWm9uZVByb3BzIHtcbiAgLyoqXG4gICAqIEEgVlBDIHRoYXQgeW91IHdhbnQgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBob3N0ZWQgem9uZS5cbiAgICpcbiAgICogUHJpdmF0ZSBob3N0ZWQgem9uZXMgbXVzdCBiZSBhc3NvY2lhdGVkIHdpdGggYXQgbGVhc3Qgb25lIFZQQy4gWW91IGNhblxuICAgKiBhc3NvY2lhdGVkIGFkZGl0aW9uYWwgVlBDcyB1c2luZyBgYWRkVnBjKHZwYylgLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgUm91dGUgNTMgcHJpdmF0ZSBob3N0ZWQgem9uZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQcml2YXRlSG9zdGVkWm9uZSBleHRlbmRzIElIb3N0ZWRab25lIHt9XG5cbi8qKlxuICogQ3JlYXRlIGEgUm91dGU1MyBwcml2YXRlIGhvc3RlZCB6b25lIGZvciB1c2UgaW4gb25lIG9yIG1vcmUgVlBDcy5cbiAqXG4gKiBOb3RlIHRoYXQgYGVuYWJsZURuc0hvc3RuYW1lc2AgYW5kIGBlbmFibGVEbnNTdXBwb3J0YCBtdXN0IGhhdmUgYmVlbiBlbmFibGVkXG4gKiBmb3IgdGhlIFZQQyB5b3UncmUgY29uZmlndXJpbmcgZm9yIHByaXZhdGUgaG9zdGVkIHpvbmVzLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmVcbiAqL1xuZXhwb3J0IGNsYXNzIFByaXZhdGVIb3N0ZWRab25lIGV4dGVuZHMgSG9zdGVkWm9uZSBpbXBsZW1lbnRzIElQcml2YXRlSG9zdGVkWm9uZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFJvdXRlIDUzIHByaXZhdGUgaG9zdGVkIHpvbmUgZGVmaW5lZCBlaXRoZXIgb3V0c2lkZSB0aGUgQ0RLLCBvciBpbiBhIGRpZmZlcmVudCBDREsgc3RhY2tcbiAgICpcbiAgICogVXNlIHdoZW4gaG9zdGVkIHpvbmUgSUQgaXMga25vd24uIElmIGEgSG9zdGVkWm9uZSBpcyBpbXBvcnRlZCB3aXRoIHRoaXMgbWV0aG9kIHRoZSB6b25lTmFtZSBjYW5ub3QgYmUgcmVmZXJlbmNlZC5cbiAgICogSWYgdGhlIHpvbmVOYW1lIGlzIG5lZWRlZCB0aGVuIHlvdSBjYW5ub3QgaW1wb3J0IGEgUHJpdmF0ZUhvc3RlZFpvbmUuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCBmb3IgdGhpcyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIHRoZSBsb2dpY2FsIG5hbWUgb2YgdGhpcyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIHByaXZhdGVIb3N0ZWRab25lSWQgdGhlIElEIG9mIHRoZSBwcml2YXRlIGhvc3RlZCB6b25lIHRvIGltcG9ydFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUHJpdmF0ZUhvc3RlZFpvbmVJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcml2YXRlSG9zdGVkWm9uZUlkOiBzdHJpbmcpOiBJUHJpdmF0ZUhvc3RlZFpvbmUge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVByaXZhdGVIb3N0ZWRab25lIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBob3N0ZWRab25lSWQgPSBwcml2YXRlSG9zdGVkWm9uZUlkO1xuICAgICAgcHVibGljIGdldCB6b25lTmFtZSgpOiBzdHJpbmcgeyB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZWZlcmVuY2UgYHpvbmVOYW1lYCB3aGVuIHVzaW5nIGBQcml2YXRlSG9zdGVkWm9uZS5mcm9tUHJpdmF0ZUhvc3RlZFpvbmVJZCgpYC4gQSBjb25zdHJ1Y3QgY29uc3VtaW5nIHRoaXMgaG9zdGVkIHpvbmUgbWF5IGJlIHRyeWluZyB0byByZWZlcmVuY2UgaXRzIGB6b25lTmFtZWAnKTsgfVxuICAgICAgcHVibGljIGdldCBob3N0ZWRab25lQXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBtYWtlSG9zdGVkWm9uZUFybih0aGlzLCB0aGlzLmhvc3RlZFpvbmVJZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUHJpdmF0ZUhvc3RlZFpvbmVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5hZGRWcGMocHJvcHMudnBjKTtcbiAgfVxufVxuIl19