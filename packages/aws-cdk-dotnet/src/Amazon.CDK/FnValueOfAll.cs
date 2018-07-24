using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Returns a list of all attribute values for a given parameter type and attribute.</summary>
    [JsiiClass(typeof(FnValueOfAll), "@aws-cdk/cdk.FnValueOfAll", "[{\"name\":\"parameterType\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"attribute\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnValueOfAll : FnCondition
    {
        public FnValueOfAll(string parameterType, string attribute): base(new DeputyProps(new object[]{parameterType, attribute}))
        {
        }

        protected FnValueOfAll(ByRefValue reference): base(reference)
        {
        }

        protected FnValueOfAll(DeputyProps props): base(props)
        {
        }
    }
}