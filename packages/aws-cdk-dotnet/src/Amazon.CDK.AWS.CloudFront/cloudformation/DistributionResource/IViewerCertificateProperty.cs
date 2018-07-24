using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html </remarks>
    [JsiiInterface(typeof(IViewerCertificateProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.ViewerCertificateProperty")]
    public interface IViewerCertificateProperty
    {
        /// <summary>``DistributionResource.ViewerCertificateProperty.AcmCertificateArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-acmcertificatearn </remarks>
        [JsiiProperty("acmCertificateArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AcmCertificateArn
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.ViewerCertificateProperty.CloudFrontDefaultCertificate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-cloudfrontdefaultcertificate </remarks>
        [JsiiProperty("cloudFrontDefaultCertificate", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CloudFrontDefaultCertificate
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.ViewerCertificateProperty.IamCertificateId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-iamcertificateid </remarks>
        [JsiiProperty("iamCertificateId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object IamCertificateId
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.ViewerCertificateProperty.MinimumProtocolVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-minimumprotocolversion </remarks>
        [JsiiProperty("minimumProtocolVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MinimumProtocolVersion
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.ViewerCertificateProperty.SslSupportMethod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-viewercertificate.html#cfn-cloudfront-distribution-viewercertificate-sslsupportmethod </remarks>
        [JsiiProperty("sslSupportMethod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SslSupportMethod
        {
            get;
            set;
        }
    }
}