using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Create a Route53 public hosted zone.</summary>
    [JsiiClass(typeof(PublicHostedZone), "@aws-cdk/aws-route53.PublicHostedZone", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.PublicHostedZoneProps\"}}]")]
    public class PublicHostedZone : HostedZoneRef
    {
        public PublicHostedZone(Construct parent, string name, IPublicHostedZoneProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected PublicHostedZone(ByRefValue reference): base(reference)
        {
        }

        protected PublicHostedZone(DeputyProps props): base(props)
        {
        }

        /// <summary>Identifier of this hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        public override HostedZoneId HostedZoneId
        {
            get => GetInstanceProperty<HostedZoneId>();
        }

        /// <summary>Fully qualified domain name for the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public override string ZoneName
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Nameservers for this public hosted zone</summary>
        [JsiiProperty("nameServers", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneNameServers\"}")]
        public virtual HostedZoneNameServers NameServers
        {
            get => GetInstanceProperty<HostedZoneNameServers>();
        }
    }
}