using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html </remarks>
    [JsiiInterface(typeof(IGeoRestrictionProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.GeoRestrictionProperty")]
    public interface IGeoRestrictionProperty
    {
        /// <summary>``DistributionResource.GeoRestrictionProperty.Locations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-locations </remarks>
        [JsiiProperty("locations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Locations
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.GeoRestrictionProperty.RestrictionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-georestriction.html#cfn-cloudfront-distribution-georestriction-restrictiontype </remarks>
        [JsiiProperty("restrictionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RestrictionType
        {
            get;
            set;
        }
    }
}