using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Represents the ARN of a certificate</summary>
    [JsiiClass(typeof(CertificateArn), "@aws-cdk/aws-certificatemanager.CertificateArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CertificateArn : Arn
    {
        public CertificateArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CertificateArn(ByRefValue reference): base(reference)
        {
        }

        protected CertificateArn(DeputyProps props): base(props)
        {
        }
    }
}