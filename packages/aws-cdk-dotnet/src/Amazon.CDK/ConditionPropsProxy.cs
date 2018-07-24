using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterfaceProxy(typeof(IConditionProps), "@aws-cdk/cdk.ConditionProps")]
    internal class ConditionPropsProxy : DeputyBase, IConditionProps
    {
        private ConditionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("expression", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\",\"optional\":true}")]
        public virtual FnCondition Expression
        {
            get => GetInstanceProperty<FnCondition>();
            set => SetInstanceProperty(value);
        }
    }
}