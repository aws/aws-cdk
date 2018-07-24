using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html </remarks>
    [JsiiInterface(typeof(IRecordFormatProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.RecordFormatProperty")]
    public interface IRecordFormatProperty
    {
        /// <summary>``ApplicationResource.RecordFormatProperty.MappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-mappingparameters </remarks>
        [JsiiProperty("mappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.MappingParametersProperty\"}]},\"optional\":true}")]
        object MappingParameters
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.RecordFormatProperty.RecordFormatType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-recordformattype </remarks>
        [JsiiProperty("recordFormatType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RecordFormatType
        {
            get;
            set;
        }
    }
}