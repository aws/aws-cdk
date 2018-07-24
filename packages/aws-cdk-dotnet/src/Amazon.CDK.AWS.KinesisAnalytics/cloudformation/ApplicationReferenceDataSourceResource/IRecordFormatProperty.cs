using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html </remarks>
    [JsiiInterface(typeof(IRecordFormatProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.RecordFormatProperty")]
    public interface IRecordFormatProperty
    {
        /// <summary>``ApplicationReferenceDataSourceResource.RecordFormatProperty.MappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-mappingparameters </remarks>
        [JsiiProperty("mappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.MappingParametersProperty\"}]},\"optional\":true}")]
        object MappingParameters
        {
            get;
            set;
        }

        /// <summary>``ApplicationReferenceDataSourceResource.RecordFormatProperty.RecordFormatType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-recordformattype </remarks>
        [JsiiProperty("recordFormatType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RecordFormatType
        {
            get;
            set;
        }
    }
}