using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Hosted zone identifier</summary>
    [JsiiClass(typeof(HostedZoneId), "@aws-cdk/aws-route53.HostedZoneId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class HostedZoneId : Token
    {
        public HostedZoneId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected HostedZoneId(ByRefValue reference): base(reference)
        {
        }

        protected HostedZoneId(DeputyProps props): base(props)
        {
        }
    }
}