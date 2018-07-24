using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    public class ConditionProps : DeputyBase, IConditionProps
    {
        [JsiiProperty("expression", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\",\"optional\":true}", true)]
        public FnCondition Expression
        {
            get;
            set;
        }
    }
}