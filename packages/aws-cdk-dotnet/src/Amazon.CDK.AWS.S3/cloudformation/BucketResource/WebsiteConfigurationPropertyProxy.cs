using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IWebsiteConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.WebsiteConfigurationProperty")]
    internal class WebsiteConfigurationPropertyProxy : DeputyBase, IWebsiteConfigurationProperty
    {
        private WebsiteConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.WebsiteConfigurationProperty.ErrorDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-errordocument </remarks>
        [JsiiProperty("errorDocument", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ErrorDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.WebsiteConfigurationProperty.IndexDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-indexdocument </remarks>
        [JsiiProperty("indexDocument", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object IndexDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.WebsiteConfigurationProperty.RedirectAllRequestsTo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-redirectallrequeststo </remarks>
        [JsiiProperty("redirectAllRequestsTo", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.RedirectAllRequestsToProperty\"}]},\"optional\":true}")]
        public virtual object RedirectAllRequestsTo
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.WebsiteConfigurationProperty.RoutingRules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-routingrules </remarks>
        [JsiiProperty("routingRules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.RoutingRuleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object RoutingRules
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}