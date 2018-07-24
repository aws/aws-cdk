using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsStackId), "@aws-cdk/cdk.AwsStackId", "[]")]
    public class AwsStackId : PseudoParameter
    {
        public AwsStackId(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsStackId(ByRefValue reference): base(reference)
        {
        }

        protected AwsStackId(DeputyProps props): base(props)
        {
        }
    }
}