using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html </remarks>
    [JsiiInterfaceProxy(typeof(ICertificateResourceProps), "@aws-cdk/aws-dms.cloudformation.CertificateResourceProps")]
    internal class CertificateResourcePropsProxy : DeputyBase, ICertificateResourceProps
    {
        private CertificateResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::DMS::Certificate.CertificateIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificateidentifier </remarks>
        [JsiiProperty("certificateIdentifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CertificateIdentifier
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DMS::Certificate.CertificatePem``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatepem </remarks>
        [JsiiProperty("certificatePem", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CertificatePem
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DMS::Certificate.CertificateWallet``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatewallet </remarks>
        [JsiiProperty("certificateWallet", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CertificateWallet
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}