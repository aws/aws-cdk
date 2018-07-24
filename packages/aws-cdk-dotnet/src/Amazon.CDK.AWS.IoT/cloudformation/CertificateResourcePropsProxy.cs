using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html </remarks>
    [JsiiInterfaceProxy(typeof(ICertificateResourceProps), "@aws-cdk/aws-iot.cloudformation.CertificateResourceProps")]
    internal class CertificateResourcePropsProxy : DeputyBase, ICertificateResourceProps
    {
        private CertificateResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::IoT::Certificate.CertificateSigningRequest``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-certificatesigningrequest </remarks>
        [JsiiProperty("certificateSigningRequest", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object CertificateSigningRequest
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IoT::Certificate.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Status
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}