using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsStackName), "@aws-cdk/cdk.AwsStackName", "[]")]
    public class AwsStackName : PseudoParameter
    {
        public AwsStackName(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsStackName(ByRefValue reference): base(reference)
        {
        }

        protected AwsStackName(DeputyProps props): base(props)
        {
        }
    }
}