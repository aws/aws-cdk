using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html </remarks>
    [JsiiInterface(typeof(IDataExportProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.DataExportProperty")]
    public interface IDataExportProperty
    {
        /// <summary>``BucketResource.DataExportProperty.Destination``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-destination </remarks>
        [JsiiProperty("destination", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.DestinationProperty\"}]}}")]
        object Destination
        {
            get;
            set;
        }

        /// <summary>``BucketResource.DataExportProperty.OutputSchemaVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-outputschemaversion </remarks>
        [JsiiProperty("outputSchemaVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object OutputSchemaVersion
        {
            get;
            set;
        }
    }
}