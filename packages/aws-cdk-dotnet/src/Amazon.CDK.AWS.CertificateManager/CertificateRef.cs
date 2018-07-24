using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Interface for certificate-like objects</summary>
    [JsiiClass(typeof(CertificateRef), "@aws-cdk/aws-certificatemanager.CertificateRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class CertificateRef : Construct
    {
        protected CertificateRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected CertificateRef(ByRefValue reference): base(reference)
        {
        }

        protected CertificateRef(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("certificateArn", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}")]
        public virtual CertificateArn CertificateArn
        {
            get => GetInstanceProperty<CertificateArn>();
        }

        /// <summary>Import a certificate</summary>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateRefProps\"}}]")]
        public static CertificateRef Import(Construct parent, string name, ICertificateRefProps props)
        {
            return InvokeStaticMethod<CertificateRef>(typeof(CertificateRef), new object[]{parent, name, props});
        }

        /// <summary>Export this certificate from the stack</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateRefProps\"}", "[]")]
        public virtual ICertificateRefProps Export()
        {
            return InvokeInstanceMethod<ICertificateRefProps>(new object[]{});
        }
    }
}