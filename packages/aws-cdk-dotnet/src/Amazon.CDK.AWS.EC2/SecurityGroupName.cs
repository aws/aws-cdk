using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SecurityGroupName), "@aws-cdk/aws-ec2.SecurityGroupName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SecurityGroupName : Token
    {
        public SecurityGroupName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SecurityGroupName(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroupName(DeputyProps props): base(props)
        {
        }
    }
}