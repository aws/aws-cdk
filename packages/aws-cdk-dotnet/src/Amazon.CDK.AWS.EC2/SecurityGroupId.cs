using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SecurityGroupId), "@aws-cdk/aws-ec2.SecurityGroupId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SecurityGroupId : Token
    {
        public SecurityGroupId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SecurityGroupId(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroupId(DeputyProps props): base(props)
        {
        }
    }
}