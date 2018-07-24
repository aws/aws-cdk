using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront.cloudformation.CloudFrontOriginAccessIdentityResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html </remarks>
    public class CloudFrontOriginAccessIdentityResourceProps : DeputyBase, ICloudFrontOriginAccessIdentityResourceProps
    {
        /// <summary>``AWS::CloudFront::CloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig </remarks>
        [JsiiProperty("cloudFrontOriginAccessIdentityConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource.CloudFrontOriginAccessIdentityConfigProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object CloudFrontOriginAccessIdentityConfig
        {
            get;
            set;
        }
    }
}