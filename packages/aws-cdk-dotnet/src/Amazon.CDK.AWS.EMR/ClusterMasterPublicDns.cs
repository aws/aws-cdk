using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR
{
    [JsiiClass(typeof(ClusterMasterPublicDns), "@aws-cdk/aws-emr.ClusterMasterPublicDns", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterMasterPublicDns : Token
    {
        public ClusterMasterPublicDns(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterMasterPublicDns(ByRefValue reference): base(reference)
        {
        }

        protected ClusterMasterPublicDns(DeputyProps props): base(props)
        {
        }
    }
}