using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(LaunchTemplateDefaultVersionNumber), "@aws-cdk/aws-ec2.LaunchTemplateDefaultVersionNumber", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LaunchTemplateDefaultVersionNumber : Token
    {
        public LaunchTemplateDefaultVersionNumber(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LaunchTemplateDefaultVersionNumber(ByRefValue reference): base(reference)
        {
        }

        protected LaunchTemplateDefaultVersionNumber(DeputyProps props): base(props)
        {
        }
    }
}