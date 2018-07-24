using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterface(typeof(IConditionProps), "@aws-cdk/cdk.ConditionProps")]
    public interface IConditionProps
    {
        [JsiiProperty("expression", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\",\"optional\":true}")]
        FnCondition Expression
        {
            get;
            set;
        }
    }
}