using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    [JsiiClass(typeof(DBClusterEndpointAddress), "@aws-cdk/aws-rds.DBClusterEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DBClusterEndpointAddress : Token
    {
        public DBClusterEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DBClusterEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected DBClusterEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}