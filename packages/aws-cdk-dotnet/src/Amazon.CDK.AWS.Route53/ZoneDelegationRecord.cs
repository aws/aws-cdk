using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>A record to delegate further lookups to a different set of name servers</summary>
    [JsiiClass(typeof(ZoneDelegationRecord), "@aws-cdk/aws-route53.ZoneDelegationRecord", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRef\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.ZoneDelegationRecordProps\"}}]")]
    public class ZoneDelegationRecord : Construct
    {
        public ZoneDelegationRecord(HostedZoneRef parent, string name, IZoneDelegationRecordProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected ZoneDelegationRecord(ByRefValue reference): base(reference)
        {
        }

        protected ZoneDelegationRecord(DeputyProps props): base(props)
        {
        }
    }
}