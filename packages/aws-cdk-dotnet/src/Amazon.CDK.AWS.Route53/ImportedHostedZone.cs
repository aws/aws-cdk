using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Imported hosted zone</summary>
    [JsiiClass(typeof(ImportedHostedZone), "@aws-cdk/aws-route53.ImportedHostedZone", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRefProps\"}}]")]
    public class ImportedHostedZone : HostedZoneRef
    {
        public ImportedHostedZone(Construct parent, string name, IHostedZoneRefProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected ImportedHostedZone(ByRefValue reference): base(reference)
        {
        }

        protected ImportedHostedZone(DeputyProps props): base(props)
        {
        }

        /// <summary>ID of this hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        public override HostedZoneId HostedZoneId
        {
            get => GetInstanceProperty<HostedZoneId>();
        }

        /// <summary>FQDN of this hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public override string ZoneName
        {
            get => GetInstanceProperty<string>();
        }
    }
}