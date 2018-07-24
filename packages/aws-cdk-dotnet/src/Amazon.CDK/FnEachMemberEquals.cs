using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Returns true if a specified string matches all values in a list.</summary>
    [JsiiClass(typeof(FnEachMemberEquals), "@aws-cdk/cdk.FnEachMemberEquals", "[{\"name\":\"listOfStrings\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnEachMemberEquals : FnCondition
    {
        public FnEachMemberEquals(object listOfStrings, string value): base(new DeputyProps(new object[]{listOfStrings, value}))
        {
        }

        protected FnEachMemberEquals(ByRefValue reference): base(reference)
        {
        }

        protected FnEachMemberEquals(DeputyProps props): base(props)
        {
        }
    }
}