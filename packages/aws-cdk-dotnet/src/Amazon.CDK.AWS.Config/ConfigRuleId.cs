using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config
{
    [JsiiClass(typeof(ConfigRuleId), "@aws-cdk/aws-config.ConfigRuleId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ConfigRuleId : Token
    {
        public ConfigRuleId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ConfigRuleId(ByRefValue reference): base(reference)
        {
        }

        protected ConfigRuleId(DeputyProps props): base(props)
        {
        }
    }
}