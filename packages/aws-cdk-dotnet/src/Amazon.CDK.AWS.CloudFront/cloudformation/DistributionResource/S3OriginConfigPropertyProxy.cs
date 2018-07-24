using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IS3OriginConfigProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.S3OriginConfigProperty")]
    internal class S3OriginConfigPropertyProxy : DeputyBase, IS3OriginConfigProperty
    {
        private S3OriginConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DistributionResource.S3OriginConfigProperty.OriginAccessIdentity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html#cfn-cloudfront-distribution-s3originconfig-originaccessidentity </remarks>
        [JsiiProperty("originAccessIdentity", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object OriginAccessIdentity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}