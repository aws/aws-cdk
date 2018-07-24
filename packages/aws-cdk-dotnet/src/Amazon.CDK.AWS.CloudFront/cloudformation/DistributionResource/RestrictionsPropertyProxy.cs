using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html </remarks>
    [JsiiInterfaceProxy(typeof(IRestrictionsProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.RestrictionsProperty")]
    internal class RestrictionsPropertyProxy : DeputyBase, IRestrictionsProperty
    {
        private RestrictionsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DistributionResource.RestrictionsProperty.GeoRestriction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-restrictions.html#cfn-cloudfront-distribution-restrictions-georestriction </remarks>
        [JsiiProperty("geoRestriction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.GeoRestrictionProperty\"}]}}")]
        public virtual object GeoRestriction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}