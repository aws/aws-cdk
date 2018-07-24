using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(LaunchTemplateLatestVersionNumber), "@aws-cdk/aws-ec2.LaunchTemplateLatestVersionNumber", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LaunchTemplateLatestVersionNumber : Token
    {
        public LaunchTemplateLatestVersionNumber(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LaunchTemplateLatestVersionNumber(ByRefValue reference): base(reference)
        {
        }

        protected LaunchTemplateLatestVersionNumber(DeputyProps props): base(props)
        {
        }
    }
}