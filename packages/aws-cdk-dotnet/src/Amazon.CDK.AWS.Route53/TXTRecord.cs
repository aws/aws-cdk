using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>A DNS TXT record</summary>
    [JsiiClass(typeof(TXTRecord), "@aws-cdk/aws-route53.TXTRecord", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneRef\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.TXTRecordProps\"}}]")]
    public class TXTRecord : Construct
    {
        public TXTRecord(HostedZoneRef parent, string name, ITXTRecordProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected TXTRecord(ByRefValue reference): base(reference)
        {
        }

        protected TXTRecord(DeputyProps props): base(props)
        {
        }
    }
}