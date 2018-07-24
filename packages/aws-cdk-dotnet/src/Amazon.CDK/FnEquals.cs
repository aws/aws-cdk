using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Compares if two values are equal. Returns true if the two values are equal or false
    /// if they aren't.
    /// </summary>
    [JsiiClass(typeof(FnEquals), "@aws-cdk/cdk.FnEquals", "[{\"name\":\"lhs\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"rhs\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnEquals : FnCondition
    {
        public FnEquals(object lhs, object rhs): base(new DeputyProps(new object[]{lhs, rhs}))
        {
        }

        protected FnEquals(ByRefValue reference): base(reference)
        {
        }

        protected FnEquals(DeputyProps props): base(props)
        {
        }
    }
}