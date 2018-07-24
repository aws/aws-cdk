using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks
{
    [JsiiClass(typeof(InstancePrivateDnsName), "@aws-cdk/aws-opsworks.InstancePrivateDnsName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstancePrivateDnsName : Token
    {
        public InstancePrivateDnsName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstancePrivateDnsName(ByRefValue reference): base(reference)
        {
        }

        protected InstancePrivateDnsName(DeputyProps props): base(props)
        {
        }
    }
}