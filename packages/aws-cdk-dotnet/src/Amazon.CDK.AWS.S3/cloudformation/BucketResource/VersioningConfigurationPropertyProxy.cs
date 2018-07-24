using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IVersioningConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.VersioningConfigurationProperty")]
    internal class VersioningConfigurationPropertyProxy : DeputyBase, IVersioningConfigurationProperty
    {
        private VersioningConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.VersioningConfigurationProperty.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html#cfn-s3-bucket-versioningconfig-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Status
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}