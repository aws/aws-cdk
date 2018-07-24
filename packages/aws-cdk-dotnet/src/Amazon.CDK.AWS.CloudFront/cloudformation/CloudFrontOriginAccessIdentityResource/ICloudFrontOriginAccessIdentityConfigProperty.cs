using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.CloudFrontOriginAccessIdentityResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html </remarks>
    [JsiiInterface(typeof(ICloudFrontOriginAccessIdentityConfigProperty), "@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource.CloudFrontOriginAccessIdentityConfigProperty")]
    public interface ICloudFrontOriginAccessIdentityConfigProperty
    {
        /// <summary>``CloudFrontOriginAccessIdentityResource.CloudFrontOriginAccessIdentityConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig.html#cfn-cloudfront-cloudfrontoriginaccessidentity-cloudfrontoriginaccessidentityconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Comment
        {
            get;
            set;
        }
    }
}