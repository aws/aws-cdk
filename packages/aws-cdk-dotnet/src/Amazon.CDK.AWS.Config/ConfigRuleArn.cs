using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config
{
    [JsiiClass(typeof(ConfigRuleArn), "@aws-cdk/aws-config.ConfigRuleArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ConfigRuleArn : Arn
    {
        public ConfigRuleArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ConfigRuleArn(ByRefValue reference): base(reference)
        {
        }

        protected ConfigRuleArn(DeputyProps props): base(props)
        {
        }
    }
}