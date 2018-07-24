using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.CloudFrontOriginAccessIdentityResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(ICloudFrontOriginAccessIdentityConfigProperty), "@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource.CloudFrontOriginAccessIdentityConfigProperty")]
    internal class CloudFrontOriginAccessIdentityConfigPropertyProxy : DeputyBase, ICloudFrontOriginAccessIdentityConfigProperty
    {
        private CloudFrontOriginAccessIdentityConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CloudFrontOriginAccessIdentityResource.CloudFrontOriginAccessIdentityConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Comment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}