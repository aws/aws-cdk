using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html </remarks>
    [JsiiInterface(typeof(IDistributionResourceProps), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResourceProps")]
    public interface IDistributionResourceProps
    {
        /// <summary>``AWS::CloudFront::Distribution.DistributionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-distributionconfig </remarks>
        [JsiiProperty("distributionConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.DistributionConfigProperty\"}]}}")]
        object DistributionConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudFront::Distribution.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html#cfn-cloudfront-distribution-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }
    }
}