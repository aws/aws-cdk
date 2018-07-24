using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    [JsiiClass(typeof(DBClusterEndpointPort), "@aws-cdk/aws-rds.DBClusterEndpointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DBClusterEndpointPort : Token
    {
        public DBClusterEndpointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DBClusterEndpointPort(ByRefValue reference): base(reference)
        {
        }

        protected DBClusterEndpointPort(DeputyProps props): base(props)
        {
        }
    }
}