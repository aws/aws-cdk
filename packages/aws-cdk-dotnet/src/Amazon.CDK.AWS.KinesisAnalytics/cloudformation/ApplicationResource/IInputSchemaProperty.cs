using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html </remarks>
    [JsiiInterface(typeof(IInputSchemaProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputSchemaProperty")]
    public interface IInputSchemaProperty
    {
        /// <summary>``ApplicationResource.InputSchemaProperty.RecordColumns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordcolumns </remarks>
        [JsiiProperty("recordColumns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.RecordColumnProperty\"}]}}}}]}}")]
        object RecordColumns
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputSchemaProperty.RecordEncoding``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordencoding </remarks>
        [JsiiProperty("recordEncoding", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RecordEncoding
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputSchemaProperty.RecordFormat``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordformat </remarks>
        [JsiiProperty("recordFormat", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.RecordFormatProperty\"}]}}")]
        object RecordFormat
        {
            get;
            set;
        }
    }
}