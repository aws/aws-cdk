using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift
{
    [JsiiClass(typeof(ClusterEndpointAddress), "@aws-cdk/aws-redshift.ClusterEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterEndpointAddress : Token
    {
        public ClusterEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected ClusterEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}