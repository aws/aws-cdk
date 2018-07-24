using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html </remarks>
    [JsiiInterfaceProxy(typeof(IDataExportProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.DataExportProperty")]
    internal class DataExportPropertyProxy : DeputyBase, IDataExportProperty
    {
        private DataExportPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.DataExportProperty.Destination``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-destination </remarks>
        [JsiiProperty("destination", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.DestinationProperty\"}]}}")]
        public virtual object Destination
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.DataExportProperty.OutputSchemaVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-outputschemaversion </remarks>
        [JsiiProperty("outputSchemaVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object OutputSchemaVersion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}