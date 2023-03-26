// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:52.126Z","fingerprint":"ghDj0fSDlFeKZh2jUPHlbA65RiZJI+emNgkwxAoerYk="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html
 */
export interface CfnApplicationProps {

    /**
     * Use this parameter to configure the application input.
     *
     * You can configure your application to receive input from a single streaming source. In this configuration, you map this streaming source to an in-application stream that is created. Your application code can then query the in-application stream like a table (you can think of it as a constantly updating table).
     *
     * For the streaming source, you provide its Amazon Resource Name (ARN) and format of data on the stream (for example, JSON, CSV, etc.). You also must provide an IAM role that Amazon Kinesis Analytics can assume to read this stream on your behalf.
     *
     * To create the in-application stream, you need to specify a schema to transform your data into a schematized version used in SQL. In the schema, you provide the necessary mapping of the data elements in the streaming source to record columns in the in-app stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-inputs
     */
    readonly inputs: Array<CfnApplication.InputProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * One or more SQL statements that read input data, transform it, and generate output. For example, you can write a SQL statement that reads data from one in-application stream, generates a running average of the number of advertisement clicks by vendor, and insert resulting rows in another in-application stream using pumps. For more information about the typical pattern, see [Application Code](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-app-code.html) .
     *
     * You can provide such series of SQL statements, where output of one statement can be used as the input for the next statement. You store intermediate results by creating in-application streams and pumps.
     *
     * Note that the application code must create the streams with names specified in the `Outputs` . For example, if your `Outputs` defines output streams named `ExampleOutputStream1` and `ExampleOutputStream2` , then your application code must create these streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationcode
     */
    readonly applicationCode?: string;

    /**
     * Summary description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationdescription
     */
    readonly applicationDescription?: string;

    /**
     * Name of your Amazon Kinesis Analytics application (for example, `sample-app` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationname
     */
    readonly applicationName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationCode', cdk.validateString)(properties.applicationCode));
    errors.collect(cdk.propertyValidator('applicationDescription', cdk.validateString)(properties.applicationDescription));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('inputs', cdk.requiredValidator)(properties.inputs));
    errors.collect(cdk.propertyValidator('inputs', cdk.listValidator(CfnApplication_InputPropertyValidator))(properties.inputs));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        Inputs: cdk.listMapper(cfnApplicationInputPropertyToCloudFormation)(properties.inputs),
        ApplicationCode: cdk.stringToCloudFormation(properties.applicationCode),
        ApplicationDescription: cdk.stringToCloudFormation(properties.applicationDescription),
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('inputs', 'Inputs', cfn_parse.FromCloudFormation.getArray(CfnApplicationInputPropertyFromCloudFormation)(properties.Inputs));
    ret.addPropertyResult('applicationCode', 'ApplicationCode', properties.ApplicationCode != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationCode) : undefined);
    ret.addPropertyResult('applicationDescription', 'ApplicationDescription', properties.ApplicationDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationDescription) : undefined);
    ret.addPropertyResult('applicationName', 'ApplicationName', properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalytics::Application`
 *
 * The `AWS::KinesisAnalytics::Application` resource creates an Amazon Kinesis Data Analytics application. For more information, see the [Amazon Kinesis Data Analytics Developer Guide](https://docs.aws.amazon.com//kinesisanalytics/latest/dev/what-is.html) .
 *
 * @cloudformationResource AWS::KinesisAnalytics::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalytics::Application";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Use this parameter to configure the application input.
     *
     * You can configure your application to receive input from a single streaming source. In this configuration, you map this streaming source to an in-application stream that is created. Your application code can then query the in-application stream like a table (you can think of it as a constantly updating table).
     *
     * For the streaming source, you provide its Amazon Resource Name (ARN) and format of data on the stream (for example, JSON, CSV, etc.). You also must provide an IAM role that Amazon Kinesis Analytics can assume to read this stream on your behalf.
     *
     * To create the in-application stream, you need to specify a schema to transform your data into a schematized version used in SQL. In the schema, you provide the necessary mapping of the data elements in the streaming source to record columns in the in-app stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-inputs
     */
    public inputs: Array<CfnApplication.InputProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * One or more SQL statements that read input data, transform it, and generate output. For example, you can write a SQL statement that reads data from one in-application stream, generates a running average of the number of advertisement clicks by vendor, and insert resulting rows in another in-application stream using pumps. For more information about the typical pattern, see [Application Code](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-app-code.html) .
     *
     * You can provide such series of SQL statements, where output of one statement can be used as the input for the next statement. You store intermediate results by creating in-application streams and pumps.
     *
     * Note that the application code must create the streams with names specified in the `Outputs` . For example, if your `Outputs` defines output streams named `ExampleOutputStream1` and `ExampleOutputStream2` , then your application code must create these streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationcode
     */
    public applicationCode: string | undefined;

    /**
     * Summary description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationdescription
     */
    public applicationDescription: string | undefined;

    /**
     * Name of your Amazon Kinesis Analytics application (for example, `sample-app` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationname
     */
    public applicationName: string | undefined;

    /**
     * Create a new `AWS::KinesisAnalytics::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'inputs', this);

        this.inputs = props.inputs;
        this.applicationCode = props.applicationCode;
        this.applicationDescription = props.applicationDescription;
        this.applicationName = props.applicationName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            inputs: this.inputs,
            applicationCode: this.applicationCode,
            applicationDescription: this.applicationDescription,
            applicationName: this.applicationName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * Provides additional mapping information when the record format uses delimiters, such as CSV. For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
     *
     * `"name1", "address1"`
     *
     * `"name2", "address2"`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html
     */
    export interface CSVMappingParametersProperty {
        /**
         * Column delimiter. For example, in a CSV format, a comma (",") is the typical column delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordcolumndelimiter
         */
        readonly recordColumnDelimiter: string;
        /**
         * Row delimiter. For example, in a CSV format, *'\n'* is the typical row delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordrowdelimiter
         */
        readonly recordRowDelimiter: string;
    }
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.requiredValidator)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.validateString)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.requiredValidator)(properties.recordRowDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.validateString)(properties.recordRowDelimiter));
    return errors.wrap('supplied properties not correct for "CSVMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.CSVMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.CSVMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCSVMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CSVMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordColumnDelimiter: cdk.stringToCloudFormation(properties.recordColumnDelimiter),
        RecordRowDelimiter: cdk.stringToCloudFormation(properties.recordRowDelimiter),
    };
}

// @ts-ignore TS6133
function CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CSVMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CSVMappingParametersProperty>();
    ret.addPropertyResult('recordColumnDelimiter', 'RecordColumnDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter));
    ret.addPropertyResult('recordRowDelimiter', 'RecordRowDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * When you configure the application input, you specify the streaming source, the in-application stream name that is created, and the mapping between the two. For more information, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html
     */
    export interface InputProperty {
        /**
         * Describes the number of in-application streams to create.
         *
         * Data from your source is routed to these in-application input streams.
         *
         * See [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputparallelism
         */
        readonly inputParallelism?: CfnApplication.InputParallelismProperty | cdk.IResolvable;
        /**
         * The [InputProcessingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html) for the input. An input processor transforms records as they are received from the stream, before the application's SQL code executes. Currently, the only input processing configuration available is [InputLambdaProcessor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputprocessingconfiguration
         */
        readonly inputProcessingConfiguration?: CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable;
        /**
         * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created.
         *
         * Also used to describe the format of the reference data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputschema
         */
        readonly inputSchema: CfnApplication.InputSchemaProperty | cdk.IResolvable;
        /**
         * If the streaming source is an Amazon Kinesis Firehose delivery stream, identifies the delivery stream's ARN and an IAM role that enables Amazon Kinesis Analytics to access the stream on your behalf.
         *
         * Note: Either `KinesisStreamsInput` or `KinesisFirehoseInput` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisfirehoseinput
         */
        readonly kinesisFirehoseInput?: CfnApplication.KinesisFirehoseInputProperty | cdk.IResolvable;
        /**
         * If the streaming source is an Amazon Kinesis stream, identifies the stream's Amazon Resource Name (ARN) and an IAM role that enables Amazon Kinesis Analytics to access the stream on your behalf.
         *
         * Note: Either `KinesisStreamsInput` or `KinesisFirehoseInput` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisstreamsinput
         */
        readonly kinesisStreamsInput?: CfnApplication.KinesisStreamsInputProperty | cdk.IResolvable;
        /**
         * Name prefix to use when creating an in-application stream. Suppose that you specify a prefix "MyInApplicationStream." Amazon Kinesis Analytics then creates one or more (as per the `InputParallelism` count you specified) in-application streams with names "MyInApplicationStream_001," "MyInApplicationStream_002," and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-nameprefix
         */
        readonly namePrefix: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputProperty`
 *
 * @param properties - the TypeScript properties of a `InputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputParallelism', CfnApplication_InputParallelismPropertyValidator)(properties.inputParallelism));
    errors.collect(cdk.propertyValidator('inputProcessingConfiguration', CfnApplication_InputProcessingConfigurationPropertyValidator)(properties.inputProcessingConfiguration));
    errors.collect(cdk.propertyValidator('inputSchema', cdk.requiredValidator)(properties.inputSchema));
    errors.collect(cdk.propertyValidator('inputSchema', CfnApplication_InputSchemaPropertyValidator)(properties.inputSchema));
    errors.collect(cdk.propertyValidator('kinesisFirehoseInput', CfnApplication_KinesisFirehoseInputPropertyValidator)(properties.kinesisFirehoseInput));
    errors.collect(cdk.propertyValidator('kinesisStreamsInput', CfnApplication_KinesisStreamsInputPropertyValidator)(properties.kinesisStreamsInput));
    errors.collect(cdk.propertyValidator('namePrefix', cdk.requiredValidator)(properties.namePrefix));
    errors.collect(cdk.propertyValidator('namePrefix', cdk.validateString)(properties.namePrefix));
    return errors.wrap('supplied properties not correct for "InputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.Input` resource
 *
 * @param properties - the TypeScript properties of a `InputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.Input` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputPropertyValidator(properties).assertSuccess();
    return {
        InputParallelism: cfnApplicationInputParallelismPropertyToCloudFormation(properties.inputParallelism),
        InputProcessingConfiguration: cfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties.inputProcessingConfiguration),
        InputSchema: cfnApplicationInputSchemaPropertyToCloudFormation(properties.inputSchema),
        KinesisFirehoseInput: cfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties.kinesisFirehoseInput),
        KinesisStreamsInput: cfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties.kinesisStreamsInput),
        NamePrefix: cdk.stringToCloudFormation(properties.namePrefix),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProperty>();
    ret.addPropertyResult('inputParallelism', 'InputParallelism', properties.InputParallelism != null ? CfnApplicationInputParallelismPropertyFromCloudFormation(properties.InputParallelism) : undefined);
    ret.addPropertyResult('inputProcessingConfiguration', 'InputProcessingConfiguration', properties.InputProcessingConfiguration != null ? CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties.InputProcessingConfiguration) : undefined);
    ret.addPropertyResult('inputSchema', 'InputSchema', CfnApplicationInputSchemaPropertyFromCloudFormation(properties.InputSchema));
    ret.addPropertyResult('kinesisFirehoseInput', 'KinesisFirehoseInput', properties.KinesisFirehoseInput != null ? CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties.KinesisFirehoseInput) : undefined);
    ret.addPropertyResult('kinesisStreamsInput', 'KinesisStreamsInput', properties.KinesisStreamsInput != null ? CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties.KinesisStreamsInput) : undefined);
    ret.addPropertyResult('namePrefix', 'NamePrefix', cfn_parse.FromCloudFormation.getString(properties.NamePrefix));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * An object that contains the Amazon Resource Name (ARN) of the [AWS Lambda](https://docs.aws.amazon.com/lambda/) function that is used to preprocess records in the stream, and the ARN of the IAM role that is used to access the AWS Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html
     */
    export interface InputLambdaProcessorProperty {
        /**
         * The ARN of the [AWS Lambda](https://docs.aws.amazon.com/lambda/) function that operates on records in the stream.
         *
         * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: AWS Lambda](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html#cfn-kinesisanalytics-application-inputlambdaprocessor-resourcearn
         */
        readonly resourceArn: string;
        /**
         * The ARN of the IAM role that is used to access the AWS Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html#cfn-kinesisanalytics-application-inputlambdaprocessor-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputLambdaProcessorProperty`
 *
 * @param properties - the TypeScript properties of a `InputLambdaProcessorProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputLambdaProcessorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "InputLambdaProcessorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputLambdaProcessor` resource
 *
 * @param properties - the TypeScript properties of a `InputLambdaProcessorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputLambdaProcessor` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputLambdaProcessorPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputLambdaProcessorProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the number of in-application streams to create for a given streaming source. For information about parallelism, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html
     */
    export interface InputParallelismProperty {
        /**
         * Number of in-application streams to create. For more information, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html#cfn-kinesisanalytics-application-inputparallelism-count
         */
        readonly count?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InputParallelismProperty`
 *
 * @param properties - the TypeScript properties of a `InputParallelismProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputParallelismPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    return errors.wrap('supplied properties not correct for "InputParallelismProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputParallelism` resource
 *
 * @param properties - the TypeScript properties of a `InputParallelismProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputParallelism` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputParallelismPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputParallelismPropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.numberToCloudFormation(properties.count),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputParallelismPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputParallelismProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputParallelismProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Provides a description of a processor that is used to preprocess the records in the stream before being processed by your application code. Currently, the only input processor available is [AWS Lambda](https://docs.aws.amazon.com/lambda/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html
     */
    export interface InputProcessingConfigurationProperty {
        /**
         * The [InputLambdaProcessor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html) that is used to preprocess the records in the stream before being processed by your application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html#cfn-kinesisanalytics-application-inputprocessingconfiguration-inputlambdaprocessor
         */
        readonly inputLambdaProcessor?: CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputProcessingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InputProcessingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputProcessingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputLambdaProcessor', CfnApplication_InputLambdaProcessorPropertyValidator)(properties.inputLambdaProcessor));
    return errors.wrap('supplied properties not correct for "InputProcessingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputProcessingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `InputProcessingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputProcessingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputProcessingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        InputLambdaProcessor: cfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties.inputLambdaProcessor),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProcessingConfigurationProperty>();
    ret.addPropertyResult('inputLambdaProcessor', 'InputLambdaProcessor', properties.InputLambdaProcessor != null ? CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties.InputLambdaProcessor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created.
     *
     * Also used to describe the format of the reference data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html
     */
    export interface InputSchemaProperty {
        /**
         * A list of `RecordColumn` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordcolumns
         */
        readonly recordColumns: Array<CfnApplication.RecordColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the encoding of the records in the streaming source. For example, UTF-8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordencoding
         */
        readonly recordEncoding?: string;
        /**
         * Specifies the format of the records on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordformat
         */
        readonly recordFormat: CfnApplication.RecordFormatProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `InputSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumns', cdk.requiredValidator)(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordColumns', cdk.listValidator(CfnApplication_RecordColumnPropertyValidator))(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordEncoding', cdk.validateString)(properties.recordEncoding));
    errors.collect(cdk.propertyValidator('recordFormat', cdk.requiredValidator)(properties.recordFormat));
    errors.collect(cdk.propertyValidator('recordFormat', CfnApplication_RecordFormatPropertyValidator)(properties.recordFormat));
    return errors.wrap('supplied properties not correct for "InputSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputSchema` resource
 *
 * @param properties - the TypeScript properties of a `InputSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.InputSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordColumns: cdk.listMapper(cfnApplicationRecordColumnPropertyToCloudFormation)(properties.recordColumns),
        RecordEncoding: cdk.stringToCloudFormation(properties.recordEncoding),
        RecordFormat: cfnApplicationRecordFormatPropertyToCloudFormation(properties.recordFormat),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputSchemaProperty>();
    ret.addPropertyResult('recordColumns', 'RecordColumns', cfn_parse.FromCloudFormation.getArray(CfnApplicationRecordColumnPropertyFromCloudFormation)(properties.RecordColumns));
    ret.addPropertyResult('recordEncoding', 'RecordEncoding', properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined);
    ret.addPropertyResult('recordFormat', 'RecordFormat', CfnApplicationRecordFormatPropertyFromCloudFormation(properties.RecordFormat));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html
     */
    export interface JSONMappingParametersProperty {
        /**
         * Path to the top-level parent that contains the records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html#cfn-kinesisanalytics-application-jsonmappingparameters-recordrowpath
         */
        readonly recordRowPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_JSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.requiredValidator)(properties.recordRowPath));
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.validateString)(properties.recordRowPath));
    return errors.wrap('supplied properties not correct for "JSONMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.JSONMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.JSONMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationJSONMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_JSONMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordRowPath: cdk.stringToCloudFormation(properties.recordRowPath),
    };
}

// @ts-ignore TS6133
function CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.JSONMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.JSONMappingParametersProperty>();
    ret.addPropertyResult('recordRowPath', 'RecordRowPath', cfn_parse.FromCloudFormation.getString(properties.RecordRowPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Identifies an Amazon Kinesis Firehose delivery stream as the streaming source. You provide the delivery stream's Amazon Resource Name (ARN) and an IAM role ARN that enables Amazon Kinesis Analytics to access the stream on your behalf.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html
     */
    export interface KinesisFirehoseInputProperty {
        /**
         * ARN of the input delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html#cfn-kinesisanalytics-application-kinesisfirehoseinput-resourcearn
         */
        readonly resourceArn: string;
        /**
         * ARN of the IAM role that Amazon Kinesis Analytics can assume to access the stream on your behalf. You need to make sure that the role has the necessary permissions to access the stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html#cfn-kinesisanalytics-application-kinesisfirehoseinput-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_KinesisFirehoseInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.KinesisFirehoseInput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.KinesisFirehoseInput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_KinesisFirehoseInputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.KinesisFirehoseInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisFirehoseInputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Identifies an Amazon Kinesis stream as the streaming source. You provide the stream's Amazon Resource Name (ARN) and an IAM role ARN that enables Amazon Kinesis Analytics to access the stream on your behalf.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html
     */
    export interface KinesisStreamsInputProperty {
        /**
         * ARN of the input Amazon Kinesis stream to read.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html#cfn-kinesisanalytics-application-kinesisstreamsinput-resourcearn
         */
        readonly resourceArn: string;
        /**
         * ARN of the IAM role that Amazon Kinesis Analytics can assume to access the stream on your behalf. You need to grant the necessary permissions to this role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html#cfn-kinesisanalytics-application-kinesisstreamsinput-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_KinesisStreamsInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamsInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.KinesisStreamsInput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.KinesisStreamsInput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_KinesisStreamsInputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.KinesisStreamsInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisStreamsInputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html
     */
    export interface MappingParametersProperty {
        /**
         * Provides additional mapping information when the record format uses delimiters (for example, CSV).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-csvmappingparameters
         */
        readonly csvMappingParameters?: CfnApplication.CSVMappingParametersProperty | cdk.IResolvable;
        /**
         * Provides additional mapping information when JSON is the record format on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-jsonmappingparameters
         */
        readonly jsonMappingParameters?: CfnApplication.JSONMappingParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csvMappingParameters', CfnApplication_CSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
    errors.collect(cdk.propertyValidator('jsonMappingParameters', CfnApplication_JSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
    return errors.wrap('supplied properties not correct for "MappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.MappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.MappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MappingParametersPropertyValidator(properties).assertSuccess();
    return {
        CSVMappingParameters: cfnApplicationCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
        JSONMappingParameters: cfnApplicationJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters),
    };
}

// @ts-ignore TS6133
function CfnApplicationMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MappingParametersProperty>();
    ret.addPropertyResult('csvMappingParameters', 'CSVMappingParameters', properties.CSVMappingParameters != null ? CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined);
    ret.addPropertyResult('jsonMappingParameters', 'JSONMappingParameters', properties.JSONMappingParameters != null ? CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
     *
     * Also used to describe the format of the reference data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html
     */
    export interface RecordColumnProperty {
        /**
         * Reference to the data element in the streaming input or the reference data source. This element is required if the [RecordFormatType](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_RecordFormat.html#analytics-Type-RecordFormat-RecordFormatTypel) is `JSON` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-mapping
         */
        readonly mapping?: string;
        /**
         * Name of the column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-name
         */
        readonly name: string;
        /**
         * Type of column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-sqltype
         */
        readonly sqlType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_RecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mapping', cdk.validateString)(properties.mapping));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlType', cdk.requiredValidator)(properties.sqlType));
    errors.collect(cdk.propertyValidator('sqlType', cdk.validateString)(properties.sqlType));
    return errors.wrap('supplied properties not correct for "RecordColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.RecordColumn` resource
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.RecordColumn` resource.
 */
// @ts-ignore TS6133
function cfnApplicationRecordColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_RecordColumnPropertyValidator(properties).assertSuccess();
    return {
        Mapping: cdk.stringToCloudFormation(properties.mapping),
        Name: cdk.stringToCloudFormation(properties.name),
        SqlType: cdk.stringToCloudFormation(properties.sqlType),
    };
}

// @ts-ignore TS6133
function CfnApplicationRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.RecordColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordColumnProperty>();
    ret.addPropertyResult('mapping', 'Mapping', properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlType', 'SqlType', cfn_parse.FromCloudFormation.getString(properties.SqlType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html
     */
    export interface RecordFormatProperty {
        /**
         * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-mappingparameters
         */
        readonly mappingParameters?: CfnApplication.MappingParametersProperty | cdk.IResolvable;
        /**
         * The type of record format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-recordformattype
         */
        readonly recordFormatType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_RecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mappingParameters', CfnApplication_MappingParametersPropertyValidator)(properties.mappingParameters));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.requiredValidator)(properties.recordFormatType));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "RecordFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.RecordFormat` resource
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::Application.RecordFormat` resource.
 */
// @ts-ignore TS6133
function cfnApplicationRecordFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_RecordFormatPropertyValidator(properties).assertSuccess();
    return {
        MappingParameters: cfnApplicationMappingParametersPropertyToCloudFormation(properties.mappingParameters),
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.RecordFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordFormatProperty>();
    ret.addPropertyResult('mappingParameters', 'MappingParameters', properties.MappingParameters != null ? CfnApplicationMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined);
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', cfn_parse.FromCloudFormation.getString(properties.RecordFormatType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationOutput`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html
 */
export interface CfnApplicationOutputProps {

    /**
     * Name of the application to which you want to add the output configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-applicationname
     */
    readonly applicationName: string;

    /**
     * An array of objects, each describing one output configuration. In the output configuration, you specify the name of an in-application stream, a destination (that is, an Amazon Kinesis stream, an Amazon Kinesis Firehose delivery stream, or an AWS Lambda function), and record the formation to use when writing to the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-output
     */
    readonly output: CfnApplicationOutput.OutputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationOutputProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutputPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('output', cdk.requiredValidator)(properties.output));
    errors.collect(cdk.propertyValidator('output', CfnApplicationOutput_OutputPropertyValidator)(properties.output));
    return errors.wrap('supplied properties not correct for "CfnApplicationOutputProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationOutputProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutputPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        Output: cfnApplicationOutputOutputPropertyToCloudFormation(properties.output),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutputProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutputProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('output', 'Output', CfnApplicationOutputOutputPropertyFromCloudFormation(properties.Output));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalytics::ApplicationOutput`
 *
 * Adds an external destination to your Amazon Kinesis Analytics application.
 *
 * If you want Amazon Kinesis Analytics to deliver data from an in-application stream within your application to an external destination (such as an Amazon Kinesis stream, an Amazon Kinesis Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to your application using this operation. You can configure one or more outputs for your application. Each output configuration maps an in-application stream and an external destination.
 *
 * You can use one of the output configurations to deliver data from your in-application error stream to an external destination so that you can analyze the errors. For more information, see [Understanding Application Output (Destination)](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
 *
 * Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the `DescribeApplication` operation to find the current application version.
 *
 * For the limits on the number of application inputs and outputs you can configure, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 *
 * @cloudformationResource AWS::KinesisAnalytics::ApplicationOutput
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html
 */
export class CfnApplicationOutput extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalytics::ApplicationOutput";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationOutput {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationOutputPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationOutput(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Name of the application to which you want to add the output configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-applicationname
     */
    public applicationName: string;

    /**
     * An array of objects, each describing one output configuration. In the output configuration, you specify the name of an in-application stream, a destination (that is, an Amazon Kinesis stream, an Amazon Kinesis Firehose delivery stream, or an AWS Lambda function), and record the formation to use when writing to the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-output
     */
    public output: CfnApplicationOutput.OutputProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::KinesisAnalytics::ApplicationOutput`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationOutputProps) {
        super(scope, id, { type: CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'output', this);

        this.applicationName = props.applicationName;
        this.output = props.output;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            output: this.output,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationOutputPropsToCloudFormation(props);
    }
}

export namespace CfnApplicationOutput {
    /**
     * Describes the data format when records are written to the destination. For more information, see [Configuring Application Output](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html
     */
    export interface DestinationSchemaProperty {
        /**
         * Specifies the format of the records on the output stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html#cfn-kinesisanalytics-applicationoutput-destinationschema-recordformattype
         */
        readonly recordFormatType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_DestinationSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "DestinationSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.DestinationSchema` resource
 *
 * @param properties - the TypeScript properties of a `DestinationSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.DestinationSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_DestinationSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.DestinationSchemaProperty>();
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', properties.RecordFormatType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordFormatType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * When configuring application output, identifies an Amazon Kinesis Firehose delivery stream as the destination. You provide the stream Amazon Resource Name (ARN) and an IAM role that enables Amazon Kinesis Analytics to write to the stream on your behalf.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html
     */
    export interface KinesisFirehoseOutputProperty {
        /**
         * ARN of the destination Amazon Kinesis Firehose delivery stream to write to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisfirehoseoutput-resourcearn
         */
        readonly resourceArn: string;
        /**
         * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination stream on your behalf. You need to grant the necessary permissions to this role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisfirehoseoutput-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.KinesisFirehoseOutput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.KinesisFirehoseOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.KinesisFirehoseOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisFirehoseOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * When configuring application output, identifies an Amazon Kinesis stream as the destination. You provide the stream Amazon Resource Name (ARN) and also an IAM role ARN that Amazon Kinesis Analytics can use to write to the stream on your behalf.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html
     */
    export interface KinesisStreamsOutputProperty {
        /**
         * ARN of the destination Amazon Kinesis stream to write to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisstreamsoutput-resourcearn
         */
        readonly resourceArn: string;
        /**
         * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination stream on your behalf. You need to grant the necessary permissions to this role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisstreamsoutput-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_KinesisStreamsOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamsOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.KinesisStreamsOutput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.KinesisStreamsOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_KinesisStreamsOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.KinesisStreamsOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisStreamsOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * When configuring application output, identifies an AWS Lambda function as the destination. You provide the function Amazon Resource Name (ARN) and also an IAM role ARN that Amazon Kinesis Analytics can use to write to the function on your behalf.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html
     */
    export interface LambdaOutputProperty {
        /**
         * Amazon Resource Name (ARN) of the destination Lambda function to write to.
         *
         * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: AWS Lambda](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html#cfn-kinesisanalytics-applicationoutput-lambdaoutput-resourcearn
         */
        readonly resourceArn: string;
        /**
         * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination function on your behalf. You need to grant the necessary permissions to this role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html#cfn-kinesisanalytics-applicationoutput-lambdaoutput-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaOutputProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_LambdaOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "LambdaOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.LambdaOutput` resource
 *
 * @param properties - the TypeScript properties of a `LambdaOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.LambdaOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_LambdaOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.LambdaOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.LambdaOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * Describes application output configuration in which you identify an in-application stream and a destination where you want the in-application stream data to be written. The destination can be an Amazon Kinesis stream or an Amazon Kinesis Firehose delivery stream.
     *
     * For limits on how many destinations an application can write and other limitations, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html
     */
    export interface OutputProperty {
        /**
         * Describes the data format when records are written to the destination. For more information, see [Configuring Application Output](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-destinationschema
         */
        readonly destinationSchema: CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable;
        /**
         * Identifies an Amazon Kinesis Firehose delivery stream as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisfirehoseoutput
         */
        readonly kinesisFirehoseOutput?: CfnApplicationOutput.KinesisFirehoseOutputProperty | cdk.IResolvable;
        /**
         * Identifies an Amazon Kinesis stream as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisstreamsoutput
         */
        readonly kinesisStreamsOutput?: CfnApplicationOutput.KinesisStreamsOutputProperty | cdk.IResolvable;
        /**
         * Identifies an AWS Lambda function as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-lambdaoutput
         */
        readonly lambdaOutput?: CfnApplicationOutput.LambdaOutputProperty | cdk.IResolvable;
        /**
         * Name of the in-application stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputProperty`
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_OutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationSchema', cdk.requiredValidator)(properties.destinationSchema));
    errors.collect(cdk.propertyValidator('destinationSchema', CfnApplicationOutput_DestinationSchemaPropertyValidator)(properties.destinationSchema));
    errors.collect(cdk.propertyValidator('kinesisFirehoseOutput', CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator)(properties.kinesisFirehoseOutput));
    errors.collect(cdk.propertyValidator('kinesisStreamsOutput', CfnApplicationOutput_KinesisStreamsOutputPropertyValidator)(properties.kinesisStreamsOutput));
    errors.collect(cdk.propertyValidator('lambdaOutput', CfnApplicationOutput_LambdaOutputPropertyValidator)(properties.lambdaOutput));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "OutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.Output` resource
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationOutput.Output` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_OutputPropertyValidator(properties).assertSuccess();
    return {
        DestinationSchema: cfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties.destinationSchema),
        KinesisFirehoseOutput: cfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties.kinesisFirehoseOutput),
        KinesisStreamsOutput: cfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties.kinesisStreamsOutput),
        LambdaOutput: cfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties.lambdaOutput),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.OutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.OutputProperty>();
    ret.addPropertyResult('destinationSchema', 'DestinationSchema', CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties.DestinationSchema));
    ret.addPropertyResult('kinesisFirehoseOutput', 'KinesisFirehoseOutput', properties.KinesisFirehoseOutput != null ? CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties.KinesisFirehoseOutput) : undefined);
    ret.addPropertyResult('kinesisStreamsOutput', 'KinesisStreamsOutput', properties.KinesisStreamsOutput != null ? CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties.KinesisStreamsOutput) : undefined);
    ret.addPropertyResult('lambdaOutput', 'LambdaOutput', properties.LambdaOutput != null ? CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties.LambdaOutput) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationReferenceDataSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html
 */
export interface CfnApplicationReferenceDataSourceProps {

    /**
     * Name of an existing application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-applicationname
     */
    readonly applicationName: string;

    /**
     * The reference data source can be an object in your Amazon S3 bucket. Amazon Kinesis Analytics reads the object and copies the data into the in-application table that is created. You provide an S3 bucket, object key name, and the resulting in-application table that is created. You must also provide an IAM role with the necessary permissions that Amazon Kinesis Analytics can assume to read the object from your S3 bucket on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource
     */
    readonly referenceDataSource: CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationReferenceDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationReferenceDataSourceProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('referenceDataSource', cdk.requiredValidator)(properties.referenceDataSource));
    errors.collect(cdk.propertyValidator('referenceDataSource', CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator)(properties.referenceDataSource));
    return errors.wrap('supplied properties not correct for "CfnApplicationReferenceDataSourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationReferenceDataSourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSourcePropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        ReferenceDataSource: cfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties.referenceDataSource),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSourceProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('referenceDataSource', 'ReferenceDataSource', CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties.ReferenceDataSource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalytics::ApplicationReferenceDataSource`
 *
 * Adds a reference data source to an existing application.
 *
 * Amazon Kinesis Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in Amazon S3 object maps to columns in the resulting in-application table.
 *
 * For conceptual information, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) . For the limits on data sources you can add to your application, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 *
 * @cloudformationResource AWS::KinesisAnalytics::ApplicationReferenceDataSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html
 */
export class CfnApplicationReferenceDataSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalytics::ApplicationReferenceDataSource";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationReferenceDataSource {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationReferenceDataSourcePropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationReferenceDataSource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Name of an existing application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-applicationname
     */
    public applicationName: string;

    /**
     * The reference data source can be an object in your Amazon S3 bucket. Amazon Kinesis Analytics reads the object and copies the data into the in-application table that is created. You provide an S3 bucket, object key name, and the resulting in-application table that is created. You must also provide an IAM role with the necessary permissions that Amazon Kinesis Analytics can assume to read the object from your S3 bucket on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource
     */
    public referenceDataSource: CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::KinesisAnalytics::ApplicationReferenceDataSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationReferenceDataSourceProps) {
        super(scope, id, { type: CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'referenceDataSource', this);

        this.applicationName = props.applicationName;
        this.referenceDataSource = props.referenceDataSource;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            referenceDataSource: this.referenceDataSource,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationReferenceDataSourcePropsToCloudFormation(props);
    }
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Provides additional mapping information when the record format uses delimiters, such as CSV. For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
     *
     * `"name1", "address1"`
     *
     * `"name2", "address2"`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html
     */
    export interface CSVMappingParametersProperty {
        /**
         * Column delimiter. For example, in a CSV format, a comma (",") is the typical column delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordcolumndelimiter
         */
        readonly recordColumnDelimiter: string;
        /**
         * Row delimiter. For example, in a CSV format, *'\n'* is the typical row delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordrowdelimiter
         */
        readonly recordRowDelimiter: string;
    }
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.requiredValidator)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.validateString)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.requiredValidator)(properties.recordRowDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.validateString)(properties.recordRowDelimiter));
    return errors.wrap('supplied properties not correct for "CSVMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.CSVMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.CSVMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordColumnDelimiter: cdk.stringToCloudFormation(properties.recordColumnDelimiter),
        RecordRowDelimiter: cdk.stringToCloudFormation(properties.recordRowDelimiter),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.CSVMappingParametersProperty>();
    ret.addPropertyResult('recordColumnDelimiter', 'RecordColumnDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter));
    ret.addPropertyResult('recordRowDelimiter', 'RecordRowDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters.html
     */
    export interface JSONMappingParametersProperty {
        /**
         * Path to the top-level parent that contains the records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters-recordrowpath
         */
        readonly recordRowPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.requiredValidator)(properties.recordRowPath));
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.validateString)(properties.recordRowPath));
    return errors.wrap('supplied properties not correct for "JSONMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.JSONMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.JSONMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordRowPath: cdk.stringToCloudFormation(properties.recordRowPath),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.JSONMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.JSONMappingParametersProperty>();
    ret.addPropertyResult('recordRowPath', 'RecordRowPath', cfn_parse.FromCloudFormation.getString(properties.RecordRowPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html
     */
    export interface MappingParametersProperty {
        /**
         * Provides additional mapping information when the record format uses delimiters (for example, CSV).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-mappingparameters-csvmappingparameters
         */
        readonly csvMappingParameters?: CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable;
        /**
         * Provides additional mapping information when JSON is the record format on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-mappingparameters-jsonmappingparameters
         */
        readonly jsonMappingParameters?: CfnApplicationReferenceDataSource.JSONMappingParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_MappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csvMappingParameters', CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
    errors.collect(cdk.propertyValidator('jsonMappingParameters', CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
    return errors.wrap('supplied properties not correct for "MappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.MappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.MappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_MappingParametersPropertyValidator(properties).assertSuccess();
    return {
        CSVMappingParameters: cfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
        JSONMappingParameters: cfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.MappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.MappingParametersProperty>();
    ret.addPropertyResult('csvMappingParameters', 'CSVMappingParameters', properties.CSVMappingParameters != null ? CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined);
    ret.addPropertyResult('jsonMappingParameters', 'JSONMappingParameters', properties.JSONMappingParameters != null ? CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
     *
     * Also used to describe the format of the reference data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html
     */
    export interface RecordColumnProperty {
        /**
         * Reference to the data element in the streaming input or the reference data source. This element is required if the [RecordFormatType](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_RecordFormat.html#analytics-Type-RecordFormat-RecordFormatTypel) is `JSON` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-mapping
         */
        readonly mapping?: string;
        /**
         * Name of the column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-name
         */
        readonly name: string;
        /**
         * Type of column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-sqltype
         */
        readonly sqlType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_RecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mapping', cdk.validateString)(properties.mapping));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlType', cdk.requiredValidator)(properties.sqlType));
    errors.collect(cdk.propertyValidator('sqlType', cdk.validateString)(properties.sqlType));
    return errors.wrap('supplied properties not correct for "RecordColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.RecordColumn` resource
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.RecordColumn` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_RecordColumnPropertyValidator(properties).assertSuccess();
    return {
        Mapping: cdk.stringToCloudFormation(properties.mapping),
        Name: cdk.stringToCloudFormation(properties.name),
        SqlType: cdk.stringToCloudFormation(properties.sqlType),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.RecordColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordColumnProperty>();
    ret.addPropertyResult('mapping', 'Mapping', properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlType', 'SqlType', cfn_parse.FromCloudFormation.getString(properties.SqlType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html
     */
    export interface RecordFormatProperty {
        /**
         * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-mappingparameters
         */
        readonly mappingParameters?: CfnApplicationReferenceDataSource.MappingParametersProperty | cdk.IResolvable;
        /**
         * The type of record format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-recordformattype
         */
        readonly recordFormatType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_RecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mappingParameters', CfnApplicationReferenceDataSource_MappingParametersPropertyValidator)(properties.mappingParameters));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.requiredValidator)(properties.recordFormatType));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "RecordFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.RecordFormat` resource
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.RecordFormat` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_RecordFormatPropertyValidator(properties).assertSuccess();
    return {
        MappingParameters: cfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties.mappingParameters),
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.RecordFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordFormatProperty>();
    ret.addPropertyResult('mappingParameters', 'MappingParameters', properties.MappingParameters != null ? CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined);
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', cfn_parse.FromCloudFormation.getString(properties.RecordFormatType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Describes the reference data source by providing the source information (S3 bucket name and object key name), the resulting in-application table name that is created, and the necessary schema to map the data elements in the Amazon S3 object to the in-application table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html
     */
    export interface ReferenceDataSourceProperty {
        /**
         * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-referenceschema
         */
        readonly referenceSchema: CfnApplicationReferenceDataSource.ReferenceSchemaProperty | cdk.IResolvable;
        /**
         * Identifies the S3 bucket and object that contains the reference data. Also identifies the IAM role Amazon Kinesis Analytics can assume to read this object on your behalf. An Amazon Kinesis Analytics application loads reference data only once. If the data changes, you call the `UpdateApplication` operation to trigger reloading of data into your application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-s3referencedatasource
         */
        readonly s3ReferenceDataSource?: CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty | cdk.IResolvable;
        /**
         * Name of the in-application table to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-tablename
         */
        readonly tableName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('referenceSchema', cdk.requiredValidator)(properties.referenceSchema));
    errors.collect(cdk.propertyValidator('referenceSchema', CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator)(properties.referenceSchema));
    errors.collect(cdk.propertyValidator('s3ReferenceDataSource', CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator)(properties.s3ReferenceDataSource));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "ReferenceDataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.ReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceDataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.ReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator(properties).assertSuccess();
    return {
        ReferenceSchema: cfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties.referenceSchema),
        S3ReferenceDataSource: cfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties.s3ReferenceDataSource),
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceDataSourceProperty>();
    ret.addPropertyResult('referenceSchema', 'ReferenceSchema', CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties.ReferenceSchema));
    ret.addPropertyResult('s3ReferenceDataSource', 'S3ReferenceDataSource', properties.S3ReferenceDataSource != null ? CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties.S3ReferenceDataSource) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * The ReferenceSchema property type specifies the format of the data in the reference source for a SQL-based Amazon Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html
     */
    export interface ReferenceSchemaProperty {
        /**
         * A list of RecordColumn objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordcolumns
         */
        readonly recordColumns: Array<CfnApplicationReferenceDataSource.RecordColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the encoding of the records in the reference source. For example, UTF-8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordencoding
         */
        readonly recordEncoding?: string;
        /**
         * Specifies the format of the records on the reference source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordformat
         */
        readonly recordFormat: CfnApplicationReferenceDataSource.RecordFormatProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumns', cdk.requiredValidator)(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordColumns', cdk.listValidator(CfnApplicationReferenceDataSource_RecordColumnPropertyValidator))(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordEncoding', cdk.validateString)(properties.recordEncoding));
    errors.collect(cdk.propertyValidator('recordFormat', cdk.requiredValidator)(properties.recordFormat));
    errors.collect(cdk.propertyValidator('recordFormat', CfnApplicationReferenceDataSource_RecordFormatPropertyValidator)(properties.recordFormat));
    return errors.wrap('supplied properties not correct for "ReferenceSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.ReferenceSchema` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.ReferenceSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordColumns: cdk.listMapper(cfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation)(properties.recordColumns),
        RecordEncoding: cdk.stringToCloudFormation(properties.recordEncoding),
        RecordFormat: cfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties.recordFormat),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.ReferenceSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceSchemaProperty>();
    ret.addPropertyResult('recordColumns', 'RecordColumns', cfn_parse.FromCloudFormation.getArray(CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation)(properties.RecordColumns));
    ret.addPropertyResult('recordEncoding', 'RecordEncoding', properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined);
    ret.addPropertyResult('recordFormat', 'RecordFormat', CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties.RecordFormat));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * Identifies the S3 bucket and object that contains the reference data. Also identifies the IAM role Amazon Kinesis Analytics can assume to read this object on your behalf.
     *
     * An Amazon Kinesis Analytics application loads reference data only once. If the data changes, you call the [UpdateApplication](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_UpdateApplication.html) operation to trigger reloading of data into your application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html
     */
    export interface S3ReferenceDataSourceProperty {
        /**
         * Amazon Resource Name (ARN) of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-bucketarn
         */
        readonly bucketArn: string;
        /**
         * Object key name containing reference data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-filekey
         */
        readonly fileKey: string;
        /**
         * ARN of the IAM role that the service can assume to read data on your behalf. This role must have permission for the `s3:GetObject` action on the object and trust policy that allows Amazon Kinesis Analytics service principal to assume this role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-referencerolearn
         */
        readonly referenceRoleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `S3ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketArn', cdk.requiredValidator)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('fileKey', cdk.requiredValidator)(properties.fileKey));
    errors.collect(cdk.propertyValidator('fileKey', cdk.validateString)(properties.fileKey));
    errors.collect(cdk.propertyValidator('referenceRoleArn', cdk.requiredValidator)(properties.referenceRoleArn));
    errors.collect(cdk.propertyValidator('referenceRoleArn', cdk.validateString)(properties.referenceRoleArn));
    return errors.wrap('supplied properties not correct for "S3ReferenceDataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.S3ReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `S3ReferenceDataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalytics::ApplicationReferenceDataSource.S3ReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator(properties).assertSuccess();
    return {
        BucketARN: cdk.stringToCloudFormation(properties.bucketArn),
        FileKey: cdk.stringToCloudFormation(properties.fileKey),
        ReferenceRoleARN: cdk.stringToCloudFormation(properties.referenceRoleArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty>();
    ret.addPropertyResult('bucketArn', 'BucketARN', cfn_parse.FromCloudFormation.getString(properties.BucketARN));
    ret.addPropertyResult('fileKey', 'FileKey', cfn_parse.FromCloudFormation.getString(properties.FileKey));
    ret.addPropertyResult('referenceRoleArn', 'ReferenceRoleARN', cfn_parse.FromCloudFormation.getString(properties.ReferenceRoleARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
