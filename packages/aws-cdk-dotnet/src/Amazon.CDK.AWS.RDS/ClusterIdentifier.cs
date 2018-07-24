using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Identifier of a cluster</summary>
    [JsiiClass(typeof(ClusterIdentifier), "@aws-cdk/aws-rds.ClusterIdentifier", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterIdentifier : Token
    {
        public ClusterIdentifier(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterIdentifier(ByRefValue reference): base(reference)
        {
        }

        protected ClusterIdentifier(DeputyProps props): base(props)
        {
        }
    }
}