"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnFHIRDatastore = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnFHIRDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnFHIRDatastoreProps`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastorePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datastoreName', cdk.validateString)(properties.datastoreName));
    errors.collect(cdk.propertyValidator('datastoreTypeVersion', cdk.requiredValidator)(properties.datastoreTypeVersion));
    errors.collect(cdk.propertyValidator('datastoreTypeVersion', cdk.validateString)(properties.datastoreTypeVersion));
    errors.collect(cdk.propertyValidator('preloadDataConfig', CfnFHIRDatastore_PreloadDataConfigPropertyValidator)(properties.preloadDataConfig));
    errors.collect(cdk.propertyValidator('sseConfiguration', CfnFHIRDatastore_SseConfigurationPropertyValidator)(properties.sseConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFHIRDatastoreProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore` resource
 *
 * @param properties - the TypeScript properties of a `CfnFHIRDatastoreProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastorePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFHIRDatastorePropsValidator(properties).assertSuccess();
    return {
        DatastoreTypeVersion: cdk.stringToCloudFormation(properties.datastoreTypeVersion),
        DatastoreName: cdk.stringToCloudFormation(properties.datastoreName),
        PreloadDataConfig: cfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties.preloadDataConfig),
        SseConfiguration: cfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties.sseConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnFHIRDatastorePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('datastoreTypeVersion', 'DatastoreTypeVersion', cfn_parse.FromCloudFormation.getString(properties.DatastoreTypeVersion));
    ret.addPropertyResult('datastoreName', 'DatastoreName', properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined);
    ret.addPropertyResult('preloadDataConfig', 'PreloadDataConfig', properties.PreloadDataConfig != null ? CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties.PreloadDataConfig) : undefined);
    ret.addPropertyResult('sseConfiguration', 'SseConfiguration', properties.SseConfiguration != null ? CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties.SseConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::HealthLake::FHIRDatastore`
 *
 * Creates a Data Store that can ingest and export FHIR formatted data.
 *
 * > Please note that when a user tries to do an Update operation via CloudFormation, changes to the Data Store name, Type Version, PreloadDataConfig, or SSEConfiguration will delete their existing Data Store for the stack and create a new one. This will lead to potential loss of data.
 *
 * @cloudformationResource AWS::HealthLake::FHIRDatastore
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
class CfnFHIRDatastore extends cdk.CfnResource {
    /**
     * Create a new `AWS::HealthLake::FHIRDatastore`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_healthlake_CfnFHIRDatastoreProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnFHIRDatastore);
            }
            throw error;
        }
        cdk.requireProperty(props, 'datastoreTypeVersion', this);
        this.attrCreatedAtNanos = cdk.Token.asNumber(this.getAtt('CreatedAt.Nanos', cdk.ResolutionTypeHint.NUMBER));
        this.attrCreatedAtSeconds = cdk.Token.asString(this.getAtt('CreatedAt.Seconds', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreArn = cdk.Token.asString(this.getAtt('DatastoreArn', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreEndpoint = cdk.Token.asString(this.getAtt('DatastoreEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreId = cdk.Token.asString(this.getAtt('DatastoreId', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreStatus = cdk.Token.asString(this.getAtt('DatastoreStatus', cdk.ResolutionTypeHint.STRING));
        this.datastoreTypeVersion = props.datastoreTypeVersion;
        this.datastoreName = props.datastoreName;
        this.preloadDataConfig = props.preloadDataConfig;
        this.sseConfiguration = props.sseConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::HealthLake::FHIRDatastore", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFHIRDatastorePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFHIRDatastore(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            datastoreTypeVersion: this.datastoreTypeVersion,
            datastoreName: this.datastoreName,
            preloadDataConfig: this.preloadDataConfig,
            sseConfiguration: this.sseConfiguration,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnFHIRDatastorePropsToCloudFormation(props);
    }
}
exports.CfnFHIRDatastore = CfnFHIRDatastore;
_a = JSII_RTTI_SYMBOL_1;
CfnFHIRDatastore[_a] = { fqn: "@aws-cdk/aws-healthlake.CfnFHIRDatastore", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME = "AWS::HealthLake::FHIRDatastore";
/**
 * Determine whether the given properties match those of a `CreatedAtProperty`
 *
 * @param properties - the TypeScript properties of a `CreatedAtProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_CreatedAtPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nanos', cdk.requiredValidator)(properties.nanos));
    errors.collect(cdk.propertyValidator('nanos', cdk.validateNumber)(properties.nanos));
    errors.collect(cdk.propertyValidator('seconds', cdk.requiredValidator)(properties.seconds));
    errors.collect(cdk.propertyValidator('seconds', cdk.validateString)(properties.seconds));
    return errors.wrap('supplied properties not correct for "CreatedAtProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.CreatedAt` resource
 *
 * @param properties - the TypeScript properties of a `CreatedAtProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.CreatedAt` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreCreatedAtPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFHIRDatastore_CreatedAtPropertyValidator(properties).assertSuccess();
    return {
        Nanos: cdk.numberToCloudFormation(properties.nanos),
        Seconds: cdk.stringToCloudFormation(properties.seconds),
    };
}
// @ts-ignore TS6133
function CfnFHIRDatastoreCreatedAtPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('nanos', 'Nanos', cfn_parse.FromCloudFormation.getNumber(properties.Nanos));
    ret.addPropertyResult('seconds', 'Seconds', cfn_parse.FromCloudFormation.getString(properties.Seconds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `KmsEncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KmsEncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cmkType', cdk.requiredValidator)(properties.cmkType));
    errors.collect(cdk.propertyValidator('cmkType', cdk.validateString)(properties.cmkType));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    return errors.wrap('supplied properties not correct for "KmsEncryptionConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.KmsEncryptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `KmsEncryptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.KmsEncryptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        CmkType: cdk.stringToCloudFormation(properties.cmkType),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
    };
}
// @ts-ignore TS6133
function CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('cmkType', 'CmkType', cfn_parse.FromCloudFormation.getString(properties.CmkType));
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `PreloadDataConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PreloadDataConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_PreloadDataConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('preloadDataType', cdk.requiredValidator)(properties.preloadDataType));
    errors.collect(cdk.propertyValidator('preloadDataType', cdk.validateString)(properties.preloadDataType));
    return errors.wrap('supplied properties not correct for "PreloadDataConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.PreloadDataConfig` resource
 *
 * @param properties - the TypeScript properties of a `PreloadDataConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.PreloadDataConfig` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFHIRDatastore_PreloadDataConfigPropertyValidator(properties).assertSuccess();
    return {
        PreloadDataType: cdk.stringToCloudFormation(properties.preloadDataType),
    };
}
// @ts-ignore TS6133
function CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('preloadDataType', 'PreloadDataType', cfn_parse.FromCloudFormation.getString(properties.PreloadDataType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `SseConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_SseConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsEncryptionConfig', cdk.requiredValidator)(properties.kmsEncryptionConfig));
    errors.collect(cdk.propertyValidator('kmsEncryptionConfig', CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator)(properties.kmsEncryptionConfig));
    return errors.wrap('supplied properties not correct for "SseConfigurationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.SseConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SseConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.SseConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFHIRDatastore_SseConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KmsEncryptionConfig: cfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties.kmsEncryptionConfig),
    };
}
// @ts-ignore TS6133
function CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('kmsEncryptionConfig', 'KmsEncryptionConfig', CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties.KmsEncryptionConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRobGFrZS5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFsdGhsYWtlLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBa0RoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLDhCQUE4QixDQUFDLFVBQWU7SUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDckcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUN0SCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUNuSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxt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QUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBNkMsQ0FBQztJQUN4RyxHQUFHLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUsNkRBQTZELENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNuSyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uXG4vLyBTZWU6IGRvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jZm4tcmVzb3VyY2Utc3BlY2lmaWNhdGlvbi5odG1sXG4vLyBAY2ZuMnRzOm1ldGFAIHtcImdlbmVyYXRlZFwiOlwiMjAyMy0wMS0yMlQwOTo1MjoyNi42MTFaXCIsXCJmaW5nZXJwcmludFwiOlwieHFuMkRhUjA3Yk9IRjZ3ZGcyamZsb1FhM01zWkNYSEE2TnEwWXFYYUx6UT1cIn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2ZuX3BhcnNlIGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkZISVJEYXRhc3RvcmVgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuRkhJUkRhdGFzdG9yZVByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBGSElSIHZlcnNpb24gb2YgdGhlIERhdGEgU3RvcmUuIFRoZSBvbmx5IHN1cHBvcnRlZCB2ZXJzaW9uIGlzIFI0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLmh0bWwjY2ZuLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1kYXRhc3RvcmV0eXBldmVyc2lvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRhdGFzdG9yZVR5cGVWZXJzaW9uOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdXNlciBnZW5lcmF0ZWQgbmFtZSBmb3IgdGhlIERhdGEgU3RvcmUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLWRhdGFzdG9yZW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBkYXRhc3RvcmVOYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHByZWxvYWRlZCBkYXRhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBEYXRhIFN0b3JlLiBPbmx5IGRhdGEgcHJlbG9hZGVkIGZyb20gU3ludGhlYSBpcyBzdXBwb3J0ZWQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXByZWxvYWRkYXRhY29uZmlnXG4gICAgICovXG4gICAgcmVhZG9ubHkgcHJlbG9hZERhdGFDb25maWc/OiBDZm5GSElSRGF0YXN0b3JlLlByZWxvYWREYXRhQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2VydmVyLXNpZGUgZW5jcnlwdGlvbiBrZXkgY29uZmlndXJhdGlvbiBmb3IgYSBjdXN0b21lciBwcm92aWRlZCBlbmNyeXB0aW9uIGtleSBzcGVjaWZpZWQgZm9yIGNyZWF0aW5nIGEgRGF0YSBTdG9yZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS5odG1sI2Nmbi1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtc3NlY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IHNzZUNvbmZpZ3VyYXRpb24/OiBDZm5GSElSRGF0YXN0b3JlLlNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS5odG1sI2Nmbi1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtdGFnc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHRhZ3M/OiBjZGsuQ2ZuVGFnW107XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuRkhJUkRhdGFzdG9yZVByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5GSElSRGF0YXN0b3JlUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRkhJUkRhdGFzdG9yZVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGF0YXN0b3JlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kYXRhc3RvcmVOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhc3RvcmVUeXBlVmVyc2lvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kYXRhc3RvcmVUeXBlVmVyc2lvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGF0YXN0b3JlVHlwZVZlcnNpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZGF0YXN0b3JlVHlwZVZlcnNpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByZWxvYWREYXRhQ29uZmlnJywgQ2ZuRkhJUkRhdGFzdG9yZV9QcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnByZWxvYWREYXRhQ29uZmlnKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzc2VDb25maWd1cmF0aW9uJywgQ2ZuRkhJUkRhdGFzdG9yZV9Tc2VDb25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuc3NlQ29uZmlndXJhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZUNmblRhZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5GSElSRGF0YXN0b3JlUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkhlYWx0aExha2U6OkZISVJEYXRhc3RvcmVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkZISVJEYXRhc3RvcmVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GSElSRGF0YXN0b3JlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZISVJEYXRhc3RvcmVQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YXN0b3JlVHlwZVZlcnNpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YXN0b3JlVHlwZVZlcnNpb24pLFxuICAgICAgICBEYXRhc3RvcmVOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRhdGFzdG9yZU5hbWUpLFxuICAgICAgICBQcmVsb2FkRGF0YUNvbmZpZzogY2ZuRkhJUkRhdGFzdG9yZVByZWxvYWREYXRhQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucHJlbG9hZERhdGFDb25maWcpLFxuICAgICAgICBTc2VDb25maWd1cmF0aW9uOiBjZm5GSElSRGF0YXN0b3JlU3NlQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnNzZUNvbmZpZ3VyYXRpb24pLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRkhJUkRhdGFzdG9yZVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuRkhJUkRhdGFzdG9yZVByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5GSElSRGF0YXN0b3JlUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkYXRhc3RvcmVUeXBlVmVyc2lvbicsICdEYXRhc3RvcmVUeXBlVmVyc2lvbicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGF0YXN0b3JlVHlwZVZlcnNpb24pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RhdGFzdG9yZU5hbWUnLCAnRGF0YXN0b3JlTmFtZScsIHByb3BlcnRpZXMuRGF0YXN0b3JlTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5EYXRhc3RvcmVOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwcmVsb2FkRGF0YUNvbmZpZycsICdQcmVsb2FkRGF0YUNvbmZpZycsIHByb3BlcnRpZXMuUHJlbG9hZERhdGFDb25maWcgIT0gbnVsbCA/IENmbkZISVJEYXRhc3RvcmVQcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuUHJlbG9hZERhdGFDb25maWcpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3NzZUNvbmZpZ3VyYXRpb24nLCAnU3NlQ29uZmlndXJhdGlvbicsIHByb3BlcnRpZXMuU3NlQ29uZmlndXJhdGlvbiAhPSBudWxsID8gQ2ZuRkhJUkRhdGFzdG9yZVNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLlNzZUNvbmZpZ3VyYXRpb24pIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIHByb3BlcnRpZXMuVGFncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldENmblRhZykocHJvcGVydGllcy5UYWdzKSA6IHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZWBcbiAqXG4gKiBDcmVhdGVzIGEgRGF0YSBTdG9yZSB0aGF0IGNhbiBpbmdlc3QgYW5kIGV4cG9ydCBGSElSIGZvcm1hdHRlZCBkYXRhLlxuICpcbiAqID4gUGxlYXNlIG5vdGUgdGhhdCB3aGVuIGEgdXNlciB0cmllcyB0byBkbyBhbiBVcGRhdGUgb3BlcmF0aW9uIHZpYSBDbG91ZEZvcm1hdGlvbiwgY2hhbmdlcyB0byB0aGUgRGF0YSBTdG9yZSBuYW1lLCBUeXBlIFZlcnNpb24sIFByZWxvYWREYXRhQ29uZmlnLCBvciBTU0VDb25maWd1cmF0aW9uIHdpbGwgZGVsZXRlIHRoZWlyIGV4aXN0aW5nIERhdGEgU3RvcmUgZm9yIHRoZSBzdGFjayBhbmQgY3JlYXRlIGEgbmV3IG9uZS4gVGhpcyB3aWxsIGxlYWQgdG8gcG90ZW50aWFsIGxvc3Mgb2YgZGF0YS5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkhlYWx0aExha2U6OkZISVJEYXRhc3RvcmVcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuRkhJUkRhdGFzdG9yZSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkhlYWx0aExha2U6OkZISVJEYXRhc3RvcmVcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5GSElSRGF0YXN0b3JlIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5GSElSRGF0YXN0b3JlUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkZISVJEYXRhc3RvcmUoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQ3JlYXRlZEF0Lk5hbm9zXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJDcmVhdGVkQXROYW5vczogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQ3JlYXRlZEF0LlNlY29uZHNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckNyZWF0ZWRBdFNlY29uZHM6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBEYXRhIFN0b3JlIEFSTiBpcyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjcmVhdGlvbiBvZiB0aGUgRGF0YSBTdG9yZSBhbmQgY2FuIGJlIGZvdW5kIGluIHRoZSBvdXRwdXQgZnJvbSB0aGUgaW5pdGlhbCBEYXRhIFN0b3JlIGNyZWF0aW9uIHJlcXVlc3QuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIERhdGFzdG9yZUFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyRGF0YXN0b3JlQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZW5kcG9pbnQgZm9yIHRoZSBjcmVhdGVkIERhdGEgU3RvcmUuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIERhdGFzdG9yZUVuZHBvaW50XG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJEYXRhc3RvcmVFbmRwb2ludDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBnZW5lcmF0ZWQgRGF0YSBTdG9yZSBpZC4gVGhpcyBpZCBpcyBpbiB0aGUgb3V0cHV0IGZyb20gdGhlIGluaXRpYWwgRGF0YSBTdG9yZSBjcmVhdGlvbiBjYWxsLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBEYXRhc3RvcmVJZFxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyRGF0YXN0b3JlSWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0dXMgb2YgdGhlIEZISVIgRGF0YSBTdG9yZS4gUG9zc2libGUgc3RhdHVzZXMgYXJlIOKAmENSRUFUSU5H4oCZLCDigJhBQ1RJVkXigJksIOKAmERFTEVUSU5H4oCZLCDigJhERUxFVEVE4oCZLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBEYXRhc3RvcmVTdGF0dXNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckRhdGFzdG9yZVN0YXR1czogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEZISVIgdmVyc2lvbiBvZiB0aGUgRGF0YSBTdG9yZS4gVGhlIG9ubHkgc3VwcG9ydGVkIHZlcnNpb24gaXMgUjQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLWRhdGFzdG9yZXR5cGV2ZXJzaW9uXG4gICAgICovXG4gICAgcHVibGljIGRhdGFzdG9yZVR5cGVWZXJzaW9uOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdXNlciBnZW5lcmF0ZWQgbmFtZSBmb3IgdGhlIERhdGEgU3RvcmUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLWRhdGFzdG9yZW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZGF0YXN0b3JlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHByZWxvYWRlZCBkYXRhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBEYXRhIFN0b3JlLiBPbmx5IGRhdGEgcHJlbG9hZGVkIGZyb20gU3ludGhlYSBpcyBzdXBwb3J0ZWQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXByZWxvYWRkYXRhY29uZmlnXG4gICAgICovXG4gICAgcHVibGljIHByZWxvYWREYXRhQ29uZmlnOiBDZm5GSElSRGF0YXN0b3JlLlByZWxvYWREYXRhQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2VydmVyLXNpZGUgZW5jcnlwdGlvbiBrZXkgY29uZmlndXJhdGlvbiBmb3IgYSBjdXN0b21lciBwcm92aWRlZCBlbmNyeXB0aW9uIGtleSBzcGVjaWZpZWQgZm9yIGNyZWF0aW5nIGEgRGF0YSBTdG9yZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS5odG1sI2Nmbi1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtc3NlY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBzc2VDb25maWd1cmF0aW9uOiBDZm5GSElSRGF0YXN0b3JlLlNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS5odG1sI2Nmbi1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpIZWFsdGhMYWtlOjpGSElSRGF0YXN0b3JlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRkhJUkRhdGFzdG9yZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5GSElSRGF0YXN0b3JlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZGF0YXN0b3JlVHlwZVZlcnNpb24nLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyQ3JlYXRlZEF0TmFub3MgPSBjZGsuVG9rZW4uYXNOdW1iZXIodGhpcy5nZXRBdHQoJ0NyZWF0ZWRBdC5OYW5vcycsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuTlVNQkVSKSk7XG4gICAgICAgIHRoaXMuYXR0ckNyZWF0ZWRBdFNlY29uZHMgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0NyZWF0ZWRBdC5TZWNvbmRzJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyRGF0YXN0b3JlQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdEYXRhc3RvcmVBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJEYXRhc3RvcmVFbmRwb2ludCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnRGF0YXN0b3JlRW5kcG9pbnQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJEYXRhc3RvcmVJZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnRGF0YXN0b3JlSWQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJEYXRhc3RvcmVTdGF0dXMgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0RhdGFzdG9yZVN0YXR1cycsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5kYXRhc3RvcmVUeXBlVmVyc2lvbiA9IHByb3BzLmRhdGFzdG9yZVR5cGVWZXJzaW9uO1xuICAgICAgICB0aGlzLmRhdGFzdG9yZU5hbWUgPSBwcm9wcy5kYXRhc3RvcmVOYW1lO1xuICAgICAgICB0aGlzLnByZWxvYWREYXRhQ29uZmlnID0gcHJvcHMucHJlbG9hZERhdGFDb25maWc7XG4gICAgICAgIHRoaXMuc3NlQ29uZmlndXJhdGlvbiA9IHByb3BzLnNzZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OkhlYWx0aExha2U6OkZISVJEYXRhc3RvcmVcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkZISVJEYXRhc3RvcmUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGFzdG9yZVR5cGVWZXJzaW9uOiB0aGlzLmRhdGFzdG9yZVR5cGVWZXJzaW9uLFxuICAgICAgICAgICAgZGF0YXN0b3JlTmFtZTogdGhpcy5kYXRhc3RvcmVOYW1lLFxuICAgICAgICAgICAgcHJlbG9hZERhdGFDb25maWc6IHRoaXMucHJlbG9hZERhdGFDb25maWcsXG4gICAgICAgICAgICBzc2VDb25maWd1cmF0aW9uOiB0aGlzLnNzZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkZISVJEYXRhc3RvcmVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GSElSRGF0YXN0b3JlIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtaGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLWNyZWF0ZWRhdC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVkQXRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRkhJUkRhdGFzdG9yZS5DcmVhdGVkQXRQcm9wZXJ0eS5OYW5vc2BcbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtY3JlYXRlZGF0Lmh0bWwjY2ZuLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1jcmVhdGVkYXQtbmFub3NcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG5hbm9zOiBudW1iZXI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRkhJUkRhdGFzdG9yZS5DcmVhdGVkQXRQcm9wZXJ0eS5TZWNvbmRzYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1jcmVhdGVkYXQuaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLWNyZWF0ZWRhdC1zZWNvbmRzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBzZWNvbmRzOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENyZWF0ZWRBdFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDcmVhdGVkQXRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GSElSRGF0YXN0b3JlX0NyZWF0ZWRBdFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFub3MnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFub3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbm9zJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLm5hbm9zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzZWNvbmRzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNlY29uZHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NlY29uZHMnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuc2Vjb25kcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDcmVhdGVkQXRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZS5DcmVhdGVkQXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENyZWF0ZWRBdFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpIZWFsdGhMYWtlOjpGSElSRGF0YXN0b3JlLkNyZWF0ZWRBdGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GSElSRGF0YXN0b3JlQ3JlYXRlZEF0UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZISVJEYXRhc3RvcmVfQ3JlYXRlZEF0UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIE5hbm9zOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbm9zKSxcbiAgICAgICAgU2Vjb25kczogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zZWNvbmRzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRkhJUkRhdGFzdG9yZUNyZWF0ZWRBdFByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuRkhJUkRhdGFzdG9yZS5DcmVhdGVkQXRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5GSElSRGF0YXN0b3JlLkNyZWF0ZWRBdFByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFub3MnLCAnTmFub3MnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLk5hbm9zKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdzZWNvbmRzJywgJ1NlY29uZHMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlNlY29uZHMpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GSElSRGF0YXN0b3JlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tZXItbWFuYWdlZC1rZXkoQ01LKSB1c2VkIHdoZW4gY3JlYXRpbmcgYSBEYXRhIFN0b3JlLiBJZiBhIGN1c3RvbWVyIG93bmVkIGtleSBpcyBub3Qgc3BlY2lmaWVkLCBhbiBBbWF6b24gb3duZWQga2V5IHdpbGwgYmUgdXNlZCBmb3IgZW5jcnlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1rbXNlbmNyeXB0aW9uY29uZmlnLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEttc0VuY3J5cHRpb25Db25maWdQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiBjdXN0b21lci1tYW5hZ2VkLWtleShDTUspIHVzZWQgZm9yIGVuY3J5cHRpb24uIFRoZSB0d28gdHlwZXMgb2Ygc3VwcG9ydGVkIENNS3MgYXJlIGN1c3RvbWVyIG93bmVkIENNS3MgYW5kIEFtYXpvbiBvd25lZCBDTUtzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBDTUsgdHlwZXMsIHNlZSBbS21zRW5jcnlwdGlvbkNvbmZpZ10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2hlYWx0aGxha2UvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfS21zRW5jcnlwdGlvbkNvbmZpZy5odG1sI0hlYWx0aExha2UtVHlwZS1LbXNFbmNyeXB0aW9uQ29uZmlnLUNta1R5cGUpIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUta21zZW5jcnlwdGlvbmNvbmZpZy5odG1sI2Nmbi1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUta21zZW5jcnlwdGlvbmNvbmZpZy1jbWt0eXBlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBjbWtUeXBlOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgS01TIGVuY3J5cHRpb24ga2V5IGlkL2FsaWFzIHVzZWQgdG8gZW5jcnlwdCB0aGUgRGF0YSBTdG9yZSBjb250ZW50cyBhdCByZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1rbXNlbmNyeXB0aW9uY29uZmlnLmh0bWwjY2ZuLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1rbXNlbmNyeXB0aW9uY29uZmlnLWttc2tleWlkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBrbXNLZXlJZD86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgS21zRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBLbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRkhJUkRhdGFzdG9yZV9LbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjbWtUeXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNta1R5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Nta1R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY21rVHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna21zS2V5SWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMua21zS2V5SWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiS21zRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpIZWFsdGhMYWtlOjpGSElSRGF0YXN0b3JlLkttc0VuY3J5cHRpb25Db25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEttc0VuY3J5cHRpb25Db25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZS5LbXNFbmNyeXB0aW9uQ29uZmlnYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZISVJEYXRhc3RvcmVLbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZISVJEYXRhc3RvcmVfS21zRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBDbWtUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNta1R5cGUpLFxuICAgICAgICBLbXNLZXlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5rbXNLZXlJZCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkZISVJEYXRhc3RvcmVLbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5GSElSRGF0YXN0b3JlLkttc0VuY3J5cHRpb25Db25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5GSElSRGF0YXN0b3JlLkttc0VuY3J5cHRpb25Db25maWdQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Nta1R5cGUnLCAnQ21rVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ21rVHlwZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgna21zS2V5SWQnLCAnS21zS2V5SWQnLCBwcm9wZXJ0aWVzLkttc0tleUlkICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkttc0tleUlkKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRkhJUkRhdGFzdG9yZSB7XG4gICAgLyoqXG4gICAgICogT3B0aW9uYWwgcGFyYW1ldGVyIHRvIHByZWxvYWQgZGF0YSB1cG9uIGNyZWF0aW9uIG9mIHRoZSBEYXRhIFN0b3JlLiBDdXJyZW50bHksIHRoZSBvbmx5IHN1cHBvcnRlZCBwcmVsb2FkZWQgZGF0YSBpcyBzeW50aGV0aWMgZGF0YSBnZW5lcmF0ZWQgZnJvbSBTeW50aGVhLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtaGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXByZWxvYWRkYXRhY29uZmlnLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFByZWxvYWREYXRhQ29uZmlnUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgcHJlbG9hZGVkIGRhdGEuIE9ubHkgU3ludGhlYSBwcmVsb2FkZWQgZGF0YSBpcyBzdXBwb3J0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtaGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXByZWxvYWRkYXRhY29uZmlnLmh0bWwjY2ZuLWhlYWx0aGxha2UtZmhpcmRhdGFzdG9yZS1wcmVsb2FkZGF0YWNvbmZpZy1wcmVsb2FkZGF0YXR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHByZWxvYWREYXRhVHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBQcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZISVJEYXRhc3RvcmVfUHJlbG9hZERhdGFDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByZWxvYWREYXRhVHlwZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wcmVsb2FkRGF0YVR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByZWxvYWREYXRhVHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wcmVsb2FkRGF0YVR5cGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUHJlbG9hZERhdGFDb25maWdQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZS5QcmVsb2FkRGF0YUNvbmZpZ2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUHJlbG9hZERhdGFDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SGVhbHRoTGFrZTo6RkhJUkRhdGFzdG9yZS5QcmVsb2FkRGF0YUNvbmZpZ2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GSElSRGF0YXN0b3JlUHJlbG9hZERhdGFDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRkhJUkRhdGFzdG9yZV9QcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBQcmVsb2FkRGF0YVR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucHJlbG9hZERhdGFUeXBlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRkhJUkRhdGFzdG9yZVByZWxvYWREYXRhQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5GSElSRGF0YXN0b3JlLlByZWxvYWREYXRhQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRkhJUkRhdGFzdG9yZS5QcmVsb2FkRGF0YUNvbmZpZ1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncHJlbG9hZERhdGFUeXBlJywgJ1ByZWxvYWREYXRhVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUHJlbG9hZERhdGFUeXBlKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRkhJUkRhdGFzdG9yZSB7XG4gICAgLyoqXG4gICAgICogVGhlIHNlcnZlci1zaWRlIGVuY3J5cHRpb24ga2V5IGNvbmZpZ3VyYXRpb24gZm9yIGEgY3VzdG9tZXIgcHJvdmlkZWQgZW5jcnlwdGlvbiBrZXkuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1oZWFsdGhsYWtlLWZoaXJkYXRhc3RvcmUtc3NlY29uZmlndXJhdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTc2VDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNlcnZlci1zaWRlIGVuY3J5cHRpb24ga2V5IGNvbmZpZ3VyYXRpb24gZm9yIGEgY3VzdG9tZXIgcHJvdmlkZWQgZW5jcnlwdGlvbiBrZXkgKENNSykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtaGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXNzZWNvbmZpZ3VyYXRpb24uaHRtbCNjZm4taGVhbHRobGFrZS1maGlyZGF0YXN0b3JlLXNzZWNvbmZpZ3VyYXRpb24ta21zZW5jcnlwdGlvbmNvbmZpZ1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkga21zRW5jcnlwdGlvbkNvbmZpZzogQ2ZuRkhJUkRhdGFzdG9yZS5LbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU3NlQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZISVJEYXRhc3RvcmVfU3NlQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna21zRW5jcnlwdGlvbkNvbmZpZycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5rbXNFbmNyeXB0aW9uQ29uZmlnKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrbXNFbmNyeXB0aW9uQ29uZmlnJywgQ2ZuRkhJUkRhdGFzdG9yZV9LbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMua21zRW5jcnlwdGlvbkNvbmZpZykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTc2VDb25maWd1cmF0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkhlYWx0aExha2U6OkZISVJEYXRhc3RvcmUuU3NlQ29uZmlndXJhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU3NlQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpIZWFsdGhMYWtlOjpGSElSRGF0YXN0b3JlLlNzZUNvbmZpZ3VyYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRkhJUkRhdGFzdG9yZVNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRkhJUkRhdGFzdG9yZV9Tc2VDb25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEttc0VuY3J5cHRpb25Db25maWc6IGNmbkZISVJEYXRhc3RvcmVLbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua21zRW5jcnlwdGlvbkNvbmZpZyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkZISVJEYXRhc3RvcmVTc2VDb25maWd1cmF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5GSElSRGF0YXN0b3JlLlNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5GSElSRGF0YXN0b3JlLlNzZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ttc0VuY3J5cHRpb25Db25maWcnLCAnS21zRW5jcnlwdGlvbkNvbmZpZycsIENmbkZISVJEYXRhc3RvcmVLbXNFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5LbXNFbmNyeXB0aW9uQ29uZmlnKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=