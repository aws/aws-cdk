using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config
{
    [JsiiClass(typeof(ConfigRuleComplianceType), "@aws-cdk/aws-config.ConfigRuleComplianceType", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ConfigRuleComplianceType : Token
    {
        public ConfigRuleComplianceType(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ConfigRuleComplianceType(ByRefValue reference): base(reference)
        {
        }

        protected ConfigRuleComplianceType(DeputyProps props): base(props)
        {
        }
    }
}