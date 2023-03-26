// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:55.578Z","fingerprint":"dUZiF1OdofWaZ1ujD+gGOdX9OlJtScisG0Eflvn9/04="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCollection`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html
 */
export interface CfnCollectionProps {

    /**
     * ID for the collection that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html#cfn-rekognition-collection-collectionid
     */
    readonly collectionId: string;

    /**
     * A set of tags (key-value pairs) that you want to attach to the collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html#cfn-rekognition-collection-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCollectionProps`
 *
 * @returns the result of the validation.
 */
function CfnCollectionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('collectionId', cdk.requiredValidator)(properties.collectionId));
    errors.collect(cdk.propertyValidator('collectionId', cdk.validateString)(properties.collectionId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCollectionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::Collection` resource
 *
 * @param properties - the TypeScript properties of a `CfnCollectionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::Collection` resource.
 */
// @ts-ignore TS6133
function cfnCollectionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCollectionPropsValidator(properties).assertSuccess();
    return {
        CollectionId: cdk.stringToCloudFormation(properties.collectionId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCollectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCollectionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollectionProps>();
    ret.addPropertyResult('collectionId', 'CollectionId', cfn_parse.FromCloudFormation.getString(properties.CollectionId));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Rekognition::Collection`
 *
 * The `AWS::Rekognition::Collection` type creates a server-side container called a collection. You can use a collection to store information about detected faces and search for known faces in images, stored videos, and streaming videos.
 *
 * @cloudformationResource AWS::Rekognition::Collection
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html
 */
export class CfnCollection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Rekognition::Collection";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCollection {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCollectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCollection(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name of the collection.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * ID for the collection that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html#cfn-rekognition-collection-collectionid
     */
    public collectionId: string;

    /**
     * A set of tags (key-value pairs) that you want to attach to the collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-collection.html#cfn-rekognition-collection-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Rekognition::Collection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCollectionProps) {
        super(scope, id, { type: CfnCollection.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'collectionId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.collectionId = props.collectionId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Rekognition::Collection", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCollection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            collectionId: this.collectionId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCollectionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-project.html
 */
export interface CfnProjectProps {

    /**
     * The name of the project to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-project.html#cfn-rekognition-project-projectname
     */
    readonly projectName: string;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('projectName', cdk.requiredValidator)(properties.projectName));
    errors.collect(cdk.propertyValidator('projectName', cdk.validateString)(properties.projectName));
    return errors.wrap('supplied properties not correct for "CfnProjectProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::Project` resource
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::Project` resource.
 */
// @ts-ignore TS6133
function cfnProjectPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProjectPropsValidator(properties).assertSuccess();
    return {
        ProjectName: cdk.stringToCloudFormation(properties.projectName),
    };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
    ret.addPropertyResult('projectName', 'ProjectName', cfn_parse.FromCloudFormation.getString(properties.ProjectName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Rekognition::Project`
 *
 * The `AWS::Rekognition::Project` type creates an Amazon Rekognition Custom Labels project. A project is a group of resources needed to create and manage versions of an Amazon Rekognition Custom Labels model.
 *
 * @cloudformationResource AWS::Rekognition::Project
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Rekognition::Project";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
        const ret = new CfnProject(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name of the project.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the project to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-project.html#cfn-rekognition-project-projectname
     */
    public projectName: string;

    /**
     * Create a new `AWS::Rekognition::Project`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
        super(scope, id, { type: CfnProject.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'projectName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.projectName = props.projectName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            projectName: this.projectName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProjectPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStreamProcessor`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html
 */
export interface CfnStreamProcessorProps {

    /**
     * The Kinesis video stream that provides the source of the streaming video for an Amazon Rekognition Video stream processor. For more information, see [KinesisVideoStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisVideoStream) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kinesisvideostream
     */
    readonly kinesisVideoStream: CfnStreamProcessor.KinesisVideoStreamProperty | cdk.IResolvable;

    /**
     * The ARN of the IAM role that allows access to the stream processor. The IAM role provides Rekognition read permissions to the Kinesis stream. It also provides write permissions to an Amazon S3 bucket and Amazon Simple Notification Service topic for a connected home stream processor. This is required for both face search and connected home stream processors. For information about constraints, see the RoleArn section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-rolearn
     */
    readonly roleArn: string;

    /**
     * List of BoundingBox objects, each of which denotes a region of interest on screen. For more information, see the BoundingBox field of [RegionOfInterest](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_RegionOfInterest) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-boundingboxregionsofinterest
     */
    readonly boundingBoxRegionsOfInterest?: Array<CfnStreamProcessor.BoundingBoxProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Connected home settings to use on a streaming video. You can use a stream processor for connected home features and select what you want the stream processor to detect, such as people or pets. When the stream processor has started, one notification is sent for each object class specified. For more information, see the ConnectedHome section of [StreamProcessorSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorSettings) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-connectedhomesettings
     */
    readonly connectedHomeSettings?: CfnStreamProcessor.ConnectedHomeSettingsProperty | cdk.IResolvable;

    /**
     * Allows you to opt in or opt out to share data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level this setting is ignored on individual streams. For more information, see [StreamProcessorDataSharingPreference](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorDataSharingPreference) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-datasharingpreference
     */
    readonly dataSharingPreference?: CfnStreamProcessor.DataSharingPreferenceProperty | cdk.IResolvable;

    /**
     * The input parameters used to recognize faces in a streaming video analyzed by an Amazon Rekognition stream processor. For more information regarding the contents of the parameters, see [FaceSearchSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_FaceSearchSettings) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-facesearchsettings
     */
    readonly faceSearchSettings?: CfnStreamProcessor.FaceSearchSettingsProperty | cdk.IResolvable;

    /**
     * Amazon Rekognition's Video Stream Processor takes a Kinesis video stream as input. This is the Amazon Kinesis Data Streams instance to which the Amazon Rekognition stream processor streams the analysis results. This must be created within the constraints specified at [KinesisDataStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisDataStream) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kinesisdatastream
     */
    readonly kinesisDataStream?: CfnStreamProcessor.KinesisDataStreamProperty | cdk.IResolvable;

    /**
     * The identifier for your Amazon Key Management Service key (Amazon KMS key). Optional parameter for connected home stream processors used to encrypt results and data published to your Amazon S3 bucket. For more information, see the KMSKeyId section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The Name attribute specifies the name of the stream processor and it must be within the constraints described in the Name section of [StreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessor) . If you don't specify a name, Amazon CloudFormation generates a unique ID and uses that ID for the stream processor name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-name
     */
    readonly name?: string;

    /**
     * The Amazon Simple Notification Service topic to which Amazon Rekognition publishes the object detection results and completion status of a video analysis operation. Amazon Rekognition publishes a notification the first time an object of interest or a person is detected in the video stream. Amazon Rekognition also publishes an end-of-session notification with a summary when the stream processing session is complete. For more information, see [StreamProcessorNotificationChannel](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorNotificationChannel) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-notificationchannel
     */
    readonly notificationChannel?: CfnStreamProcessor.NotificationChannelProperty | cdk.IResolvable;

    /**
     * A set of ordered lists of [Point](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_Point) objects. Each entry of the set contains a polygon denoting a region of interest on the screen. Each polygon is an ordered list of [Point](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_Point) objects. For more information, see the Polygon field of [RegionOfInterest](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_RegionOfInterest) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-polygonregionsofinterest
     */
    readonly polygonRegionsOfInterest?: any | cdk.IResolvable;

    /**
     * The Amazon S3 bucket location to which Amazon Rekognition publishes the detailed inference results of a video analysis operation. For more information, see the S3Destination section of [StreamProcessorOutput](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorOutput) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-s3destination
     */
    readonly s3Destination?: CfnStreamProcessor.S3DestinationProperty | cdk.IResolvable;

    /**
     * A set of tags (key-value pairs) that you want to attach to the stream processor. For more information, see the Tags section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnStreamProcessorProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamProcessorProps`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('boundingBoxRegionsOfInterest', cdk.listValidator(CfnStreamProcessor_BoundingBoxPropertyValidator))(properties.boundingBoxRegionsOfInterest));
    errors.collect(cdk.propertyValidator('connectedHomeSettings', CfnStreamProcessor_ConnectedHomeSettingsPropertyValidator)(properties.connectedHomeSettings));
    errors.collect(cdk.propertyValidator('dataSharingPreference', CfnStreamProcessor_DataSharingPreferencePropertyValidator)(properties.dataSharingPreference));
    errors.collect(cdk.propertyValidator('faceSearchSettings', CfnStreamProcessor_FaceSearchSettingsPropertyValidator)(properties.faceSearchSettings));
    errors.collect(cdk.propertyValidator('kinesisDataStream', CfnStreamProcessor_KinesisDataStreamPropertyValidator)(properties.kinesisDataStream));
    errors.collect(cdk.propertyValidator('kinesisVideoStream', cdk.requiredValidator)(properties.kinesisVideoStream));
    errors.collect(cdk.propertyValidator('kinesisVideoStream', CfnStreamProcessor_KinesisVideoStreamPropertyValidator)(properties.kinesisVideoStream));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('notificationChannel', CfnStreamProcessor_NotificationChannelPropertyValidator)(properties.notificationChannel));
    errors.collect(cdk.propertyValidator('polygonRegionsOfInterest', cdk.validateObject)(properties.polygonRegionsOfInterest));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('s3Destination', CfnStreamProcessor_S3DestinationPropertyValidator)(properties.s3Destination));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStreamProcessorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamProcessorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessorPropsValidator(properties).assertSuccess();
    return {
        KinesisVideoStream: cfnStreamProcessorKinesisVideoStreamPropertyToCloudFormation(properties.kinesisVideoStream),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        BoundingBoxRegionsOfInterest: cdk.listMapper(cfnStreamProcessorBoundingBoxPropertyToCloudFormation)(properties.boundingBoxRegionsOfInterest),
        ConnectedHomeSettings: cfnStreamProcessorConnectedHomeSettingsPropertyToCloudFormation(properties.connectedHomeSettings),
        DataSharingPreference: cfnStreamProcessorDataSharingPreferencePropertyToCloudFormation(properties.dataSharingPreference),
        FaceSearchSettings: cfnStreamProcessorFaceSearchSettingsPropertyToCloudFormation(properties.faceSearchSettings),
        KinesisDataStream: cfnStreamProcessorKinesisDataStreamPropertyToCloudFormation(properties.kinesisDataStream),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        Name: cdk.stringToCloudFormation(properties.name),
        NotificationChannel: cfnStreamProcessorNotificationChannelPropertyToCloudFormation(properties.notificationChannel),
        PolygonRegionsOfInterest: cdk.objectToCloudFormation(properties.polygonRegionsOfInterest),
        S3Destination: cfnStreamProcessorS3DestinationPropertyToCloudFormation(properties.s3Destination),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessorProps>();
    ret.addPropertyResult('kinesisVideoStream', 'KinesisVideoStream', CfnStreamProcessorKinesisVideoStreamPropertyFromCloudFormation(properties.KinesisVideoStream));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('boundingBoxRegionsOfInterest', 'BoundingBoxRegionsOfInterest', properties.BoundingBoxRegionsOfInterest != null ? cfn_parse.FromCloudFormation.getArray(CfnStreamProcessorBoundingBoxPropertyFromCloudFormation)(properties.BoundingBoxRegionsOfInterest) : undefined);
    ret.addPropertyResult('connectedHomeSettings', 'ConnectedHomeSettings', properties.ConnectedHomeSettings != null ? CfnStreamProcessorConnectedHomeSettingsPropertyFromCloudFormation(properties.ConnectedHomeSettings) : undefined);
    ret.addPropertyResult('dataSharingPreference', 'DataSharingPreference', properties.DataSharingPreference != null ? CfnStreamProcessorDataSharingPreferencePropertyFromCloudFormation(properties.DataSharingPreference) : undefined);
    ret.addPropertyResult('faceSearchSettings', 'FaceSearchSettings', properties.FaceSearchSettings != null ? CfnStreamProcessorFaceSearchSettingsPropertyFromCloudFormation(properties.FaceSearchSettings) : undefined);
    ret.addPropertyResult('kinesisDataStream', 'KinesisDataStream', properties.KinesisDataStream != null ? CfnStreamProcessorKinesisDataStreamPropertyFromCloudFormation(properties.KinesisDataStream) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('notificationChannel', 'NotificationChannel', properties.NotificationChannel != null ? CfnStreamProcessorNotificationChannelPropertyFromCloudFormation(properties.NotificationChannel) : undefined);
    ret.addPropertyResult('polygonRegionsOfInterest', 'PolygonRegionsOfInterest', properties.PolygonRegionsOfInterest != null ? cfn_parse.FromCloudFormation.getAny(properties.PolygonRegionsOfInterest) : undefined);
    ret.addPropertyResult('s3Destination', 'S3Destination', properties.S3Destination != null ? CfnStreamProcessorS3DestinationPropertyFromCloudFormation(properties.S3Destination) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Rekognition::StreamProcessor`
 *
 * The `AWS::Rekognition::StreamProcessor` type creates a stream processor used to detect and recognize faces or to detect connected home labels in a streaming video. Amazon Rekognition Video is a consumer of live video from Amazon Kinesis Video Streams. There are two different settings for stream processors in Amazon Rekognition, one for detecting faces and one for connected home features.
 *
 * If you are creating a stream processor for detecting faces, you provide a Kinesis video stream (input) and a Kinesis data stream (output). You also specify the face recognition criteria in FaceSearchSettings. For example, the collection containing faces that you want to recognize.
 *
 * If you are creating a stream processor for detection of connected home labels, you provide a Kinesis video stream for input, and for output an Amazon S3 bucket and an Amazon SNS topic. You can also provide a KMS key ID to encrypt the data sent to your Amazon S3 bucket. You specify what you want to detect in ConnectedHomeSettings, such as people, packages, and pets.
 *
 * You can also specify where in the frame you want Amazon Rekognition to monitor with BoundingBoxRegionsOfInterest and PolygonRegionsOfInterest. The Name is used to manage the stream processor and it is the identifier for the stream processor. The `AWS::Rekognition::StreamProcessor` resource creates a stream processor in the same Region where you create the Amazon CloudFormation stack.
 *
 * For more information, see [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
 *
 * @cloudformationResource AWS::Rekognition::StreamProcessor
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html
 */
export class CfnStreamProcessor extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Rekognition::StreamProcessor";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamProcessor {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStreamProcessorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStreamProcessor(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Amazon Resource Name for the newly created stream processor.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Current status of the Amazon Rekognition stream processor.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * Detailed status message about the stream processor.
     * @cloudformationAttribute StatusMessage
     */
    public readonly attrStatusMessage: string;

    /**
     * The Kinesis video stream that provides the source of the streaming video for an Amazon Rekognition Video stream processor. For more information, see [KinesisVideoStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisVideoStream) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kinesisvideostream
     */
    public kinesisVideoStream: CfnStreamProcessor.KinesisVideoStreamProperty | cdk.IResolvable;

    /**
     * The ARN of the IAM role that allows access to the stream processor. The IAM role provides Rekognition read permissions to the Kinesis stream. It also provides write permissions to an Amazon S3 bucket and Amazon Simple Notification Service topic for a connected home stream processor. This is required for both face search and connected home stream processors. For information about constraints, see the RoleArn section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-rolearn
     */
    public roleArn: string;

    /**
     * List of BoundingBox objects, each of which denotes a region of interest on screen. For more information, see the BoundingBox field of [RegionOfInterest](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_RegionOfInterest) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-boundingboxregionsofinterest
     */
    public boundingBoxRegionsOfInterest: Array<CfnStreamProcessor.BoundingBoxProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Connected home settings to use on a streaming video. You can use a stream processor for connected home features and select what you want the stream processor to detect, such as people or pets. When the stream processor has started, one notification is sent for each object class specified. For more information, see the ConnectedHome section of [StreamProcessorSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorSettings) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-connectedhomesettings
     */
    public connectedHomeSettings: CfnStreamProcessor.ConnectedHomeSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Allows you to opt in or opt out to share data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level this setting is ignored on individual streams. For more information, see [StreamProcessorDataSharingPreference](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorDataSharingPreference) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-datasharingpreference
     */
    public dataSharingPreference: CfnStreamProcessor.DataSharingPreferenceProperty | cdk.IResolvable | undefined;

    /**
     * The input parameters used to recognize faces in a streaming video analyzed by an Amazon Rekognition stream processor. For more information regarding the contents of the parameters, see [FaceSearchSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_FaceSearchSettings) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-facesearchsettings
     */
    public faceSearchSettings: CfnStreamProcessor.FaceSearchSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Amazon Rekognition's Video Stream Processor takes a Kinesis video stream as input. This is the Amazon Kinesis Data Streams instance to which the Amazon Rekognition stream processor streams the analysis results. This must be created within the constraints specified at [KinesisDataStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisDataStream) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kinesisdatastream
     */
    public kinesisDataStream: CfnStreamProcessor.KinesisDataStreamProperty | cdk.IResolvable | undefined;

    /**
     * The identifier for your Amazon Key Management Service key (Amazon KMS key). Optional parameter for connected home stream processors used to encrypt results and data published to your Amazon S3 bucket. For more information, see the KMSKeyId section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The Name attribute specifies the name of the stream processor and it must be within the constraints described in the Name section of [StreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessor) . If you don't specify a name, Amazon CloudFormation generates a unique ID and uses that ID for the stream processor name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-name
     */
    public name: string | undefined;

    /**
     * The Amazon Simple Notification Service topic to which Amazon Rekognition publishes the object detection results and completion status of a video analysis operation. Amazon Rekognition publishes a notification the first time an object of interest or a person is detected in the video stream. Amazon Rekognition also publishes an end-of-session notification with a summary when the stream processing session is complete. For more information, see [StreamProcessorNotificationChannel](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorNotificationChannel) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-notificationchannel
     */
    public notificationChannel: CfnStreamProcessor.NotificationChannelProperty | cdk.IResolvable | undefined;

    /**
     * A set of ordered lists of [Point](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_Point) objects. Each entry of the set contains a polygon denoting a region of interest on the screen. Each polygon is an ordered list of [Point](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_Point) objects. For more information, see the Polygon field of [RegionOfInterest](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_RegionOfInterest) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-polygonregionsofinterest
     */
    public polygonRegionsOfInterest: any | cdk.IResolvable | undefined;

    /**
     * The Amazon S3 bucket location to which Amazon Rekognition publishes the detailed inference results of a video analysis operation. For more information, see the S3Destination section of [StreamProcessorOutput](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorOutput) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-s3destination
     */
    public s3Destination: CfnStreamProcessor.S3DestinationProperty | cdk.IResolvable | undefined;

    /**
     * A set of tags (key-value pairs) that you want to attach to the stream processor. For more information, see the Tags section of [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rekognition-streamprocessor.html#cfn-rekognition-streamprocessor-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Rekognition::StreamProcessor`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamProcessorProps) {
        super(scope, id, { type: CfnStreamProcessor.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'kinesisVideoStream', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.attrStatusMessage = cdk.Token.asString(this.getAtt('StatusMessage', cdk.ResolutionTypeHint.STRING));

        this.kinesisVideoStream = props.kinesisVideoStream;
        this.roleArn = props.roleArn;
        this.boundingBoxRegionsOfInterest = props.boundingBoxRegionsOfInterest;
        this.connectedHomeSettings = props.connectedHomeSettings;
        this.dataSharingPreference = props.dataSharingPreference;
        this.faceSearchSettings = props.faceSearchSettings;
        this.kinesisDataStream = props.kinesisDataStream;
        this.kmsKeyId = props.kmsKeyId;
        this.name = props.name;
        this.notificationChannel = props.notificationChannel;
        this.polygonRegionsOfInterest = props.polygonRegionsOfInterest;
        this.s3Destination = props.s3Destination;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Rekognition::StreamProcessor", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamProcessor.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            kinesisVideoStream: this.kinesisVideoStream,
            roleArn: this.roleArn,
            boundingBoxRegionsOfInterest: this.boundingBoxRegionsOfInterest,
            connectedHomeSettings: this.connectedHomeSettings,
            dataSharingPreference: this.dataSharingPreference,
            faceSearchSettings: this.faceSearchSettings,
            kinesisDataStream: this.kinesisDataStream,
            kmsKeyId: this.kmsKeyId,
            name: this.name,
            notificationChannel: this.notificationChannel,
            polygonRegionsOfInterest: this.polygonRegionsOfInterest,
            s3Destination: this.s3Destination,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamProcessorPropsToCloudFormation(props);
    }
}

export namespace CfnStreamProcessor {
    /**
     * Identifies the bounding box around the label, face, text, or personal protective equipment. The `left` (x-coordinate) and `top` (y-coordinate) are coordinates representing the top and left sides of the bounding box. Note that the upper-left corner of the image is the origin (0,0).
     *
     * The `top` and `left` values returned are ratios of the overall image size. For example, if the input image is 700x200 pixels, and the top-left coordinate of the bounding box is 350x50 pixels, the API returns a `left` value of 0.5 (350/700) and a `top` value of 0.25 (50/200).
     *
     * The `width` and `height` values represent the dimensions of the bounding box as a ratio of the overall image dimension. For example, if the input image is 700x200 pixels, and the bounding box width is 70 pixels, the width returned is 0.1. For more information, see [BoundingBox](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_BoundingBox) .
     *
     * > The bounding box coordinates can have negative values. For example, if Amazon Rekognition is able to detect a face that is at the image edge and is only partially visible, the service can return coordinates that are outside the image bounds and, depending on the image edge, you might get negative values or values greater than 1 for the `left` or `top` values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-boundingbox.html
     */
    export interface BoundingBoxProperty {
        /**
         * Height of the bounding box as a ratio of the overall image height.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-boundingbox.html#cfn-rekognition-streamprocessor-boundingbox-height
         */
        readonly height: number;
        /**
         * Left coordinate of the bounding box as a ratio of overall image width.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-boundingbox.html#cfn-rekognition-streamprocessor-boundingbox-left
         */
        readonly left: number;
        /**
         * Top coordinate of the bounding box as a ratio of overall image height.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-boundingbox.html#cfn-rekognition-streamprocessor-boundingbox-top
         */
        readonly top: number;
        /**
         * Width of the bounding box as a ratio of the overall image width.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-boundingbox.html#cfn-rekognition-streamprocessor-boundingbox-width
         */
        readonly width: number;
    }
}

/**
 * Determine whether the given properties match those of a `BoundingBoxProperty`
 *
 * @param properties - the TypeScript properties of a `BoundingBoxProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_BoundingBoxPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('height', cdk.requiredValidator)(properties.height));
    errors.collect(cdk.propertyValidator('height', cdk.validateNumber)(properties.height));
    errors.collect(cdk.propertyValidator('left', cdk.requiredValidator)(properties.left));
    errors.collect(cdk.propertyValidator('left', cdk.validateNumber)(properties.left));
    errors.collect(cdk.propertyValidator('top', cdk.requiredValidator)(properties.top));
    errors.collect(cdk.propertyValidator('top', cdk.validateNumber)(properties.top));
    errors.collect(cdk.propertyValidator('width', cdk.requiredValidator)(properties.width));
    errors.collect(cdk.propertyValidator('width', cdk.validateNumber)(properties.width));
    return errors.wrap('supplied properties not correct for "BoundingBoxProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.BoundingBox` resource
 *
 * @param properties - the TypeScript properties of a `BoundingBoxProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.BoundingBox` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorBoundingBoxPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_BoundingBoxPropertyValidator(properties).assertSuccess();
    return {
        Height: cdk.numberToCloudFormation(properties.height),
        Left: cdk.numberToCloudFormation(properties.left),
        Top: cdk.numberToCloudFormation(properties.top),
        Width: cdk.numberToCloudFormation(properties.width),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorBoundingBoxPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.BoundingBoxProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.BoundingBoxProperty>();
    ret.addPropertyResult('height', 'Height', cfn_parse.FromCloudFormation.getNumber(properties.Height));
    ret.addPropertyResult('left', 'Left', cfn_parse.FromCloudFormation.getNumber(properties.Left));
    ret.addPropertyResult('top', 'Top', cfn_parse.FromCloudFormation.getNumber(properties.Top));
    ret.addPropertyResult('width', 'Width', cfn_parse.FromCloudFormation.getNumber(properties.Width));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * Connected home settings to use on a streaming video. Defining the settings is required in the request parameter for `CreateStreamProcessor` . Including this setting in the CreateStreamProcessor request lets you use the stream processor for connected home features. You can then select what you want the stream processor to detect, such as people or pets.
     *
     * When the stream processor has started, one notification is sent for each object class specified. For example, if packages and pets are selected, one SNS notification is published the first time a package is detected and one SNS notification is published the first time a pet is detected. An end-of-session summary is also published. For more information, see the ConnectedHome section of [StreamProcessorSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorSettings) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-connectedhomesettings.html
     */
    export interface ConnectedHomeSettingsProperty {
        /**
         * Specifies what you want to detect in the video, such as people, packages, or pets. The current valid labels you can include in this list are: "PERSON", "PET", "PACKAGE", and "ALL".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-connectedhomesettings.html#cfn-rekognition-streamprocessor-connectedhomesettings-labels
         */
        readonly labels: string[];
        /**
         * The minimum confidence required to label an object in the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-connectedhomesettings.html#cfn-rekognition-streamprocessor-connectedhomesettings-minconfidence
         */
        readonly minConfidence?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectedHomeSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectedHomeSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_ConnectedHomeSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('labels', cdk.requiredValidator)(properties.labels));
    errors.collect(cdk.propertyValidator('labels', cdk.listValidator(cdk.validateString))(properties.labels));
    errors.collect(cdk.propertyValidator('minConfidence', cdk.validateNumber)(properties.minConfidence));
    return errors.wrap('supplied properties not correct for "ConnectedHomeSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.ConnectedHomeSettings` resource
 *
 * @param properties - the TypeScript properties of a `ConnectedHomeSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.ConnectedHomeSettings` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorConnectedHomeSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_ConnectedHomeSettingsPropertyValidator(properties).assertSuccess();
    return {
        Labels: cdk.listMapper(cdk.stringToCloudFormation)(properties.labels),
        MinConfidence: cdk.numberToCloudFormation(properties.minConfidence),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorConnectedHomeSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.ConnectedHomeSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.ConnectedHomeSettingsProperty>();
    ret.addPropertyResult('labels', 'Labels', cfn_parse.FromCloudFormation.getStringArray(properties.Labels));
    ret.addPropertyResult('minConfidence', 'MinConfidence', properties.MinConfidence != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinConfidence) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * Allows you to opt in or opt out to share data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level, this setting is ignored on individual streams. For more information, see [StreamProcessorDataSharingPreference](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorDataSharingPreference) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-datasharingpreference.html
     */
    export interface DataSharingPreferenceProperty {
        /**
         * Describes the opt-in status applied to a stream processor's data sharing policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-datasharingpreference.html#cfn-rekognition-streamprocessor-datasharingpreference-optin
         */
        readonly optIn: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataSharingPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSharingPreferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_DataSharingPreferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('optIn', cdk.requiredValidator)(properties.optIn));
    errors.collect(cdk.propertyValidator('optIn', cdk.validateBoolean)(properties.optIn));
    return errors.wrap('supplied properties not correct for "DataSharingPreferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.DataSharingPreference` resource
 *
 * @param properties - the TypeScript properties of a `DataSharingPreferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.DataSharingPreference` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorDataSharingPreferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_DataSharingPreferencePropertyValidator(properties).assertSuccess();
    return {
        OptIn: cdk.booleanToCloudFormation(properties.optIn),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorDataSharingPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.DataSharingPreferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.DataSharingPreferenceProperty>();
    ret.addPropertyResult('optIn', 'OptIn', cfn_parse.FromCloudFormation.getBoolean(properties.OptIn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * The input parameters used to recognize faces in a streaming video analyzed by a Amazon Rekognition stream processor. `FaceSearchSettings` is a request parameter for [CreateStreamProcessor](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateStreamProcessor) . For more information, see [FaceSearchSettings](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_FaceSearchSettings) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-facesearchsettings.html
     */
    export interface FaceSearchSettingsProperty {
        /**
         * The ID of a collection that contains faces that you want to search for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-facesearchsettings.html#cfn-rekognition-streamprocessor-facesearchsettings-collectionid
         */
        readonly collectionId: string;
        /**
         * Minimum face match confidence score that must be met to return a result for a recognized face. The default is 80. 0 is the lowest confidence. 100 is the highest confidence. Values between 0 and 100 are accepted, and values lower than 80 are set to 80.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-facesearchsettings.html#cfn-rekognition-streamprocessor-facesearchsettings-facematchthreshold
         */
        readonly faceMatchThreshold?: number;
    }
}

/**
 * Determine whether the given properties match those of a `FaceSearchSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FaceSearchSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_FaceSearchSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('collectionId', cdk.requiredValidator)(properties.collectionId));
    errors.collect(cdk.propertyValidator('collectionId', cdk.validateString)(properties.collectionId));
    errors.collect(cdk.propertyValidator('faceMatchThreshold', cdk.validateNumber)(properties.faceMatchThreshold));
    return errors.wrap('supplied properties not correct for "FaceSearchSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.FaceSearchSettings` resource
 *
 * @param properties - the TypeScript properties of a `FaceSearchSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.FaceSearchSettings` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorFaceSearchSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_FaceSearchSettingsPropertyValidator(properties).assertSuccess();
    return {
        CollectionId: cdk.stringToCloudFormation(properties.collectionId),
        FaceMatchThreshold: cdk.numberToCloudFormation(properties.faceMatchThreshold),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorFaceSearchSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.FaceSearchSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.FaceSearchSettingsProperty>();
    ret.addPropertyResult('collectionId', 'CollectionId', cfn_parse.FromCloudFormation.getString(properties.CollectionId));
    ret.addPropertyResult('faceMatchThreshold', 'FaceMatchThreshold', properties.FaceMatchThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.FaceMatchThreshold) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * Amazon Rekognition Video Stream Processor take as input a Kinesis video stream (Input) and a Kinesis data stream (Output). This is the Amazon Kinesis Data Streams instance to which the Amazon Rekognition stream processor streams the analysis results. This must be created within the constraints specified at [KinesisDataStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisDataStream) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-kinesisdatastream.html
     */
    export interface KinesisDataStreamProperty {
        /**
         * ARN of the output Amazon Kinesis Data Streams stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-kinesisdatastream.html#cfn-rekognition-streamprocessor-kinesisdatastream-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisDataStreamProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisDataStreamProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_KinesisDataStreamPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "KinesisDataStreamProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.KinesisDataStream` resource
 *
 * @param properties - the TypeScript properties of a `KinesisDataStreamProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.KinesisDataStream` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorKinesisDataStreamPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_KinesisDataStreamPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorKinesisDataStreamPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.KinesisDataStreamProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.KinesisDataStreamProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * The Kinesis video stream that provides the source of the streaming video for an Amazon Rekognition Video stream processor. For more information, see [KinesisVideoStream](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_KinesisVideoStream) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-kinesisvideostream.html
     */
    export interface KinesisVideoStreamProperty {
        /**
         * ARN of the Kinesis video stream stream that streams the source video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-kinesisvideostream.html#cfn-rekognition-streamprocessor-kinesisvideostream-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisVideoStreamProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisVideoStreamProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_KinesisVideoStreamPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "KinesisVideoStreamProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.KinesisVideoStream` resource
 *
 * @param properties - the TypeScript properties of a `KinesisVideoStreamProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.KinesisVideoStream` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorKinesisVideoStreamPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_KinesisVideoStreamPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorKinesisVideoStreamPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.KinesisVideoStreamProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.KinesisVideoStreamProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * The Amazon Simple Notification Service topic to which Amazon Rekognition publishes the object detection results and completion status of a video analysis operation. Amazon Rekognition publishes a notification the first time an object of interest or a person is detected in the video stream. Amazon Rekognition also publishes an an end-of-session notification with a summary when the stream processing session is complete. For more information, see [StreamProcessorNotificationChannel](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_StreamProcessorNotificationChannel) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-notificationchannel.html
     */
    export interface NotificationChannelProperty {
        /**
         * The ARN of the SNS topic that receives notifications.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-notificationchannel.html#cfn-rekognition-streamprocessor-notificationchannel-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationChannelProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationChannelProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_NotificationChannelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "NotificationChannelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.NotificationChannel` resource
 *
 * @param properties - the TypeScript properties of a `NotificationChannelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.NotificationChannel` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorNotificationChannelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_NotificationChannelPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorNotificationChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.NotificationChannelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.NotificationChannelProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStreamProcessor {
    /**
     * The Amazon S3 bucket location to which Amazon Rekognition publishes the detailed inference results of a video analysis operation. These results include the name of the stream processor resource, the session ID of the stream processing session, and labeled timestamps and bounding boxes for detected labels. For more information, see [S3Destination](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_S3Destination) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-s3destination.html
     */
    export interface S3DestinationProperty {
        /**
         * Describes the destination Amazon Simple Storage Service (Amazon S3) bucket name of a stream processor's exports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-s3destination.html#cfn-rekognition-streamprocessor-s3destination-bucketname
         */
        readonly bucketName: string;
        /**
         * Describes the destination Amazon Simple Storage Service (Amazon S3) object keys of a stream processor's exports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rekognition-streamprocessor-s3destination.html#cfn-rekognition-streamprocessor-s3destination-objectkeyprefix
         */
        readonly objectKeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamProcessor_S3DestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('objectKeyPrefix', cdk.validateString)(properties.objectKeyPrefix));
    return errors.wrap('supplied properties not correct for "S3DestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.S3Destination` resource
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Rekognition::StreamProcessor.S3Destination` resource.
 */
// @ts-ignore TS6133
function cfnStreamProcessorS3DestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamProcessor_S3DestinationPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        ObjectKeyPrefix: cdk.stringToCloudFormation(properties.objectKeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnStreamProcessorS3DestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProcessor.S3DestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProcessor.S3DestinationProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('objectKeyPrefix', 'ObjectKeyPrefix', properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
