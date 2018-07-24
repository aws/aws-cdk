using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SecurityGroupVpcId), "@aws-cdk/aws-ec2.SecurityGroupVpcId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SecurityGroupVpcId : Token
    {
        public SecurityGroupVpcId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SecurityGroupVpcId(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroupVpcId(DeputyProps props): base(props)
        {
        }
    }
}