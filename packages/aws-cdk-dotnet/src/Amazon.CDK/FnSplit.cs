using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// To split a string into a list of string values so that you can select an element from the
    /// resulting string list, use the Fn::Split intrinsic function. Specify the location of splits
    /// with a delimiter, such as , (a comma). After you split a string, use the Fn::Select function
    /// to pick a specific element.
    /// </summary>
    [JsiiClass(typeof(FnSplit), "@aws-cdk/cdk.FnSplit", "[{\"name\":\"delimiter\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"source\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnSplit : Fn
    {
        public FnSplit(string delimiter, object source): base(new DeputyProps(new object[]{delimiter, source}))
        {
        }

        protected FnSplit(ByRefValue reference): base(reference)
        {
        }

        protected FnSplit(DeputyProps props): base(props)
        {
        }
    }
}