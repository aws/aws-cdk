using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(InstancePrivateIp), "@aws-cdk/aws-ec2.InstancePrivateIp", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstancePrivateIp : Token
    {
        public InstancePrivateIp(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstancePrivateIp(ByRefValue reference): base(reference)
        {
        }

        protected InstancePrivateIp(DeputyProps props): base(props)
        {
        }
    }
}