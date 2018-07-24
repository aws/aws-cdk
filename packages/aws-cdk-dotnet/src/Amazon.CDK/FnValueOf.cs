using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Returns an attribute value or list of values for a specific parameter and attribute.</summary>
    [JsiiClass(typeof(FnValueOf), "@aws-cdk/cdk.FnValueOf", "[{\"name\":\"parameterOrLogicalId\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"attribute\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnValueOf : FnCondition
    {
        public FnValueOf(string parameterOrLogicalId, string attribute): base(new DeputyProps(new object[]{parameterOrLogicalId, attribute}))
        {
        }

        protected FnValueOf(ByRefValue reference): base(reference)
        {
        }

        protected FnValueOf(DeputyProps props): base(props)
        {
        }
    }
}