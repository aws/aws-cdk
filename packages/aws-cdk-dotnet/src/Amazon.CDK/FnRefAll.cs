using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Returns all values for a specified parameter type.</summary>
    [JsiiClass(typeof(FnRefAll), "@aws-cdk/cdk.FnRefAll", "[{\"name\":\"parameterType\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnRefAll : FnCondition
    {
        public FnRefAll(string parameterType): base(new DeputyProps(new object[]{parameterType}))
        {
        }

        protected FnRefAll(ByRefValue reference): base(reference)
        {
        }

        protected FnRefAll(DeputyProps props): base(props)
        {
        }
    }
}