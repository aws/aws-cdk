using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsRegion), "@aws-cdk/cdk.AwsRegion", "[]")]
    public class AwsRegion : PseudoParameter
    {
        public AwsRegion(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsRegion(ByRefValue reference): base(reference)
        {
        }

        protected AwsRegion(DeputyProps props): base(props)
        {
        }
    }
}