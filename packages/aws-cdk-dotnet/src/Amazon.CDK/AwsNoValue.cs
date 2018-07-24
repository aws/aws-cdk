using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsNoValue), "@aws-cdk/cdk.AwsNoValue", "[]")]
    public class AwsNoValue : PseudoParameter
    {
        public AwsNoValue(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsNoValue(ByRefValue reference): base(reference)
        {
        }

        protected AwsNoValue(DeputyProps props): base(props)
        {
        }
    }
}