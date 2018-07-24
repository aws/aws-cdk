using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks
{
    [JsiiClass(typeof(InstancePublicIp), "@aws-cdk/aws-opsworks.InstancePublicIp", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstancePublicIp : Token
    {
        public InstancePublicIp(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstancePublicIp(ByRefValue reference): base(reference)
        {
        }

        protected InstancePublicIp(DeputyProps props): base(props)
        {
        }
    }
}