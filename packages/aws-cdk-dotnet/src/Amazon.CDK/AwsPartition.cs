using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AwsPartition), "@aws-cdk/cdk.AwsPartition", "[]")]
    public class AwsPartition : PseudoParameter
    {
        public AwsPartition(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AwsPartition(ByRefValue reference): base(reference)
        {
        }

        protected AwsPartition(DeputyProps props): base(props)
        {
        }
    }
}