using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS
{
    [JsiiClass(typeof(ClusterEndpoint), "@aws-cdk/aws-eks.ClusterEndpoint", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterEndpoint : Token
    {
        public ClusterEndpoint(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterEndpoint(ByRefValue reference): base(reference)
        {
        }

        protected ClusterEndpoint(DeputyProps props): base(props)
        {
        }
    }
}