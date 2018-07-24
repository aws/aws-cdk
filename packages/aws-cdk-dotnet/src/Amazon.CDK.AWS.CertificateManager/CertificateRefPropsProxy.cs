using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Reference to an existing Certificate</summary>
    [JsiiInterfaceProxy(typeof(ICertificateRefProps), "@aws-cdk/aws-certificatemanager.CertificateRefProps")]
    internal class CertificateRefPropsProxy : DeputyBase, ICertificateRefProps
    {
        private CertificateRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The certificate's ARN</summary>
        [JsiiProperty("certificateArn", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}")]
        public virtual CertificateArn CertificateArn
        {
            get => GetInstanceProperty<CertificateArn>();
            set => SetInstanceProperty(value);
        }
    }
}