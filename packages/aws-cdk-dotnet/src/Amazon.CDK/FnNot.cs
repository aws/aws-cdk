using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Returns true for a condition that evaluates to false or returns false for a condition that evaluates to true.
    /// Fn::Not acts as a NOT operator.
    /// </summary>
    [JsiiClass(typeof(FnNot), "@aws-cdk/cdk.FnNot", "[{\"name\":\"condition\",\"type\":{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}}]")]
    public class FnNot : FnCondition
    {
        public FnNot(FnCondition condition): base(new DeputyProps(new object[]{condition}))
        {
        }

        protected FnNot(ByRefValue reference): base(reference)
        {
        }

        protected FnNot(DeputyProps props): base(props)
        {
        }
    }
}