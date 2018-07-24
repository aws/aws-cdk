using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift
{
    [JsiiClass(typeof(ClusterEndpointPort), "@aws-cdk/aws-redshift.ClusterEndpointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterEndpointPort : Token
    {
        public ClusterEndpointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterEndpointPort(ByRefValue reference): base(reference)
        {
        }

        protected ClusterEndpointPort(DeputyProps props): base(props)
        {
        }
    }
}