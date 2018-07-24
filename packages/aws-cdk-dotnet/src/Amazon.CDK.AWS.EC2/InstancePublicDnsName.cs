using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(InstancePublicDnsName), "@aws-cdk/aws-ec2.InstancePublicDnsName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
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