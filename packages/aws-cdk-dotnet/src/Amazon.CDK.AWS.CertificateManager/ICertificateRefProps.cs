using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Reference to an existing Certificate</summary>
    [JsiiInterface(typeof(ICertificateRefProps), "@aws-cdk/aws-certificatemanager.CertificateRefProps")]
    public interface ICertificateRefProps
    {
        /// <summary>The certificate's ARN</summary>
        [JsiiProperty("certificateArn", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}")]
        CertificateArn CertificateArn
        {
            get;
            set;
        }
    }
}