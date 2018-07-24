using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html </remarks>
    [JsiiInterface(typeof(ICertificateResourceProps), "@aws-cdk/aws-dms.cloudformation.CertificateResourceProps")]
    public interface ICertificateResourceProps
    {
        /// <summary>``AWS::DMS::Certificate.CertificateIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificateidentifier </remarks>
        [JsiiProperty("certificateIdentifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CertificateIdentifier
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Certificate.CertificatePem``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatepem </remarks>
        [JsiiProperty("certificatePem", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CertificatePem
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Certificate.CertificateWallet``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatewallet </remarks>
        [JsiiProperty("certificateWallet", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CertificateWallet
        {
            get;
            set;
        }
    }
}