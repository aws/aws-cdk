using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DAX
{
    [JsiiClass(typeof(ClusterDiscoveryEndpoint), "@aws-cdk/aws-dax.ClusterDiscoveryEndpoint", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterDiscoveryEndpoint : Token
    {
        public ClusterDiscoveryEndpoint(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterDiscoveryEndpoint(ByRefValue reference): base(reference)
        {
        }

        protected ClusterDiscoveryEndpoint(DeputyProps props): base(props)
        {
        }
    }
}