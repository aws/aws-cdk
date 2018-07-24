using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Imported or created hosted zone</summary>
    [JsiiClass(typeof(HostedZoneRef), "@aws-cdk/aws-route53.HostedZoneRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class HostedZoneRef : Construct
    {
        protected HostedZoneRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected HostedZoneRef(ByRefValue reference): base(reference)
        {
        }

        protected HostedZoneRef(DeputyProps props): base(props)
        {
        }

        /// <summary>ID of this hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        public virtual HostedZoneId HostedZoneId
        {
            get => GetInstanceProperty<HostedZoneId>();
        }

        /// <summary>FQDN of this hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public virtual string ZoneName
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRefProps\"}}]")]
        public static HostedZoneRef Import(Construct parent, string name, IHostedZoneRefProps props)
        {
            return InvokeStaticMethod<HostedZoneRef>(typeof(HostedZoneRef), new object[]{parent, name, props});
        }

        /// <summary>Export the hosted zone</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRefProps\"}", "[]")]
        public virtual IHostedZoneRefProps Export()
        {
            return InvokeInstanceMethod<IHostedZoneRefProps>(new object[]{});
        }
    }
}