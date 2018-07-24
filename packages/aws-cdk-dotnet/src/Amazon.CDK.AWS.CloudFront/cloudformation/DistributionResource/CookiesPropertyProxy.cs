using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html </remarks>
    [JsiiInterfaceProxy(typeof(ICookiesProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CookiesProperty")]
    internal class CookiesPropertyProxy : DeputyBase, ICookiesProperty
    {
        private CookiesPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DistributionResource.CookiesProperty.Forward``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-forward </remarks>
        [JsiiProperty("forward", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Forward
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DistributionResource.CookiesProperty.WhitelistedNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-whitelistednames </remarks>
        [JsiiProperty("whitelistedNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object WhitelistedNames
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}