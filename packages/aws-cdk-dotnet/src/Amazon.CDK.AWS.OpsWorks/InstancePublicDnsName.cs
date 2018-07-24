using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks
{
    [JsiiClass(typeof(InstancePublicDnsName), "@aws-cdk/aws-opsworks.InstancePublicDnsName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstancePublicDnsName : Token
    {
        public InstancePublicDnsName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstancePublicDnsName(ByRefValue reference): base(reference)
        {
        }

        protected InstancePublicDnsName(DeputyProps props): base(props)
        {
        }
    }
}