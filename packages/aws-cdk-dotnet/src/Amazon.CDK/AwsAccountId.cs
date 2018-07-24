using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsAccountId), "@aws-cdk/cdk.AwsAccountId", "[]")]
    public class AwsAccountId : PseudoParameter
    {
        public AwsAccountId(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsAccountId(ByRefValue reference): base(reference)
        {
        }

        protected AwsAccountId(DeputyProps props): base(props)
        {
        }
    }
}