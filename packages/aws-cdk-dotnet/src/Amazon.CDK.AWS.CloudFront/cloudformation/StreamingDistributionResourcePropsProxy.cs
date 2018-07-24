using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront.cloudformation.StreamingDistributionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html </remarks>
    [JsiiInterfaceProxy(typeof(IStreamingDistributionResourceProps), "@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResourceProps")]
    internal class StreamingDistributionResourcePropsProxy : DeputyBase, IStreamingDistributionResourceProps
    {
        private StreamingDistributionResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CloudFront::StreamingDistribution.StreamingDistributionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig </remarks>
        [JsiiProperty("streamingDistributionConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource.StreamingDistributionConfigProperty\"}]}}")]
        public virtual object StreamingDistributionConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CloudFront::StreamingDistribution.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html#cfn-cloudfront-streamingdistribution-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]}}")]
        public virtual object Tags
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}