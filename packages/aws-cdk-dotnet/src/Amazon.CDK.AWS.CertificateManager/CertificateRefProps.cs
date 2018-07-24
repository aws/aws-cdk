using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Reference to an existing Certificate</summary>
    public class CertificateRefProps : DeputyBase, ICertificateRefProps
    {
        /// <summary>The certificate's ARN</summary>
        [JsiiProperty("certificateArn", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}", true)]
        public CertificateArn CertificateArn
        {
            get;
            set;
        }
    }
}