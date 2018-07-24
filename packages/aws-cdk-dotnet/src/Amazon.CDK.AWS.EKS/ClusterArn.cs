using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS
{
    [JsiiClass(typeof(ClusterArn), "@aws-cdk/aws-eks.ClusterArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterArn : Arn
    {
        public ClusterArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterArn(ByRefValue reference): base(reference)
        {
        }

        protected ClusterArn(DeputyProps props): base(props)
        {
        }
    }
}