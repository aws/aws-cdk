using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html </remarks>
    [JsiiInterface(typeof(ICustomErrorResponseProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomErrorResponseProperty")]
    public interface ICustomErrorResponseProperty
    {
        /// <summary>``DistributionResource.CustomErrorResponseProperty.ErrorCachingMinTTL``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcachingminttl </remarks>
        [JsiiProperty("errorCachingMinTtl", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ErrorCachingMinTtl
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomErrorResponseProperty.ErrorCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcode </remarks>
        [JsiiProperty("errorCode", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ErrorCode
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomErrorResponseProperty.ResponseCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsecode </remarks>
        [JsiiProperty("responseCode", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResponseCode
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomErrorResponseProperty.ResponsePagePath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-responsepagepath </remarks>
        [JsiiProperty("responsePagePath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResponsePagePath
        {
            get;
            set;
        }
    }
}