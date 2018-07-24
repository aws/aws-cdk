using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>
    /// A certificate managed by Amazon Certificate Manager
    /// 
    /// IMPORTANT: if you are creating a certificate as part of your stack, the stack
    /// will not complete creating until you read and follow the instructions in the
    /// email that you will receive.
    /// 
    /// ACM will send validation emails to the following addresses:
    /// 
    ///     admin@domain.com
    ///     administrator@domain.com
    ///     hostmaster@domain.com
    ///     postmaster@domain.com
    ///     webmaster@domain.com
    /// 
    /// For every domain that you register.
    /// </summary>
    [JsiiClass(typeof(Certificate), "@aws-cdk/aws-certificatemanager.Certificate", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateProps\"}}]")]
    public class Certificate : CertificateRef
    {
        public Certificate(Construct parent, string name, ICertificateProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Certificate(ByRefValue reference): base(reference)
        {
        }

        protected Certificate(DeputyProps props): base(props)
        {
        }

        /// <summary>The certificate's ARN</summary>
        [JsiiProperty("certificateArn", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}")]
        public override CertificateArn CertificateArn
        {
            get => GetInstanceProperty<CertificateArn>();
        }
    }
}