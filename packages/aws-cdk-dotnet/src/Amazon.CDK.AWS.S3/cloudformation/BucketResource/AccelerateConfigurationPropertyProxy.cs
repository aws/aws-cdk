using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IAccelerateConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.AccelerateConfigurationProperty")]
    internal class AccelerateConfigurationPropertyProxy : DeputyBase, IAccelerateConfigurationProperty
    {
        private AccelerateConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.AccelerateConfigurationProperty.AccelerationStatus``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html#cfn-s3-bucket-accelerateconfiguration-accelerationstatus </remarks>
        [JsiiProperty("accelerationStatus", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AccelerationStatus
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}