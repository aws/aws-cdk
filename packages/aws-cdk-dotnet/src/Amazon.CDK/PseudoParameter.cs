using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(PseudoParameter), "@aws-cdk/cdk.PseudoParameter", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class PseudoParameter : Token
    {
        public PseudoParameter(string name): base(new DeputyProps(new object[]{name}))
        {
        }

        protected PseudoParameter(ByRefValue reference): base(reference)
        {
        }

        protected PseudoParameter(DeputyProps props): base(props)
        {
        }
    }
}