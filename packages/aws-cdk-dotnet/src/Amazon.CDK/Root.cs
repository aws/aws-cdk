using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Represents the root of a construct tree.
    /// No parent and no name.
    /// </summary>
    [JsiiClass(typeof(Root), "@aws-cdk/cdk.Root", "[]")]
    public class Root : Construct
    {
        public Root(): base(new DeputyProps(new object[]{}))
        {
        }

        protected Root(ByRefValue reference): base(reference)
        {
        }

        protected Root(DeputyProps props): base(props)
        {
        }
    }
}