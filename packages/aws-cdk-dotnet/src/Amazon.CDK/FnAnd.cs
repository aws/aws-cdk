using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Returns true if all the specified conditions evaluate to true, or returns false if any one
    ///   of the conditions evaluates to false. Fn::And acts as an AND operator. The minimum number of
    /// conditions that you can include is 2, and the maximum is 10.
    /// </summary>
    [JsiiClass(typeof(FnAnd), "@aws-cdk/cdk.FnAnd", "[{\"name\":\"condition\",\"type\":{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}}]")]
    public class FnAnd : FnCondition
    {
        public FnAnd(FnCondition condition): base(new DeputyProps(new object[]{condition}))
        {
        }

        protected FnAnd(ByRefValue reference): base(reference)
        {
        }

        protected FnAnd(DeputyProps props): base(props)
        {
        }
    }
}