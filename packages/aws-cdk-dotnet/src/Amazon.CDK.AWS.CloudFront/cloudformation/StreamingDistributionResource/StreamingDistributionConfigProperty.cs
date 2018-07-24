using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.StreamingDistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html </remarks>
    public class StreamingDistributionConfigProperty : DeputyBase, IStreamingDistributionConfigProperty
    {
        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.Aliases``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-aliases </remarks>
        [JsiiProperty("aliases", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object Aliases
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Comment
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Enabled
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.Logging``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-logging </remarks>
        [JsiiProperty("logging", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource.LoggingProperty\"}]},\"optional\":true}", true)]
        public object Logging
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.PriceClass``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-priceclass </remarks>
        [JsiiProperty("priceClass", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PriceClass
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.S3Origin``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-s3origin </remarks>
        [JsiiProperty("s3Origin", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource.S3OriginProperty\"}]}}", true)]
        public object S3Origin
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.StreamingDistributionConfigProperty.TrustedSigners``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-streamingdistributionconfig.html#cfn-cloudfront-streamingdistribution-streamingdistributionconfig-trustedsigners </remarks>
        [JsiiProperty("trustedSigners", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource.TrustedSignersProperty\"}]}}", true)]
        public object TrustedSigners
        {
            get;
            set;
        }
    }
}