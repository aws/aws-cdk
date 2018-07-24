using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Returns true if each member in a list of strings matches at least one value in a second
    /// list of strings.
    /// </summary>
    [JsiiClass(typeof(FnEachMemberIn), "@aws-cdk/cdk.FnEachMemberIn", "[{\"name\":\"stringsToCheck\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"stringsToMatch\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnEachMemberIn : FnCondition
    {
        public FnEachMemberIn(object stringsToCheck, object stringsToMatch): base(new DeputyProps(new object[]{stringsToCheck, stringsToMatch}))
        {
        }

        protected FnEachMemberIn(ByRefValue reference): base(reference)
        {
        }

        protected FnEachMemberIn(DeputyProps props): base(props)
        {
        }
    }
}