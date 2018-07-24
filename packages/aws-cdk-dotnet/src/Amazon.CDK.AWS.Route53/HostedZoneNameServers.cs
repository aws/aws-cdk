using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    [JsiiClass(typeof(HostedZoneNameServers), "@aws-cdk/aws-route53.HostedZoneNameServers", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class HostedZoneNameServers : Token
    {
        public HostedZoneNameServers(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected HostedZoneNameServers(ByRefValue reference): base(reference)
        {
        }

        protected HostedZoneNameServers(DeputyProps props): base(props)
        {
        }
    }
}