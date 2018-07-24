using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    [JsiiClass(typeof(DBClusterReadEndpointAddress), "@aws-cdk/aws-rds.DBClusterReadEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DBClusterReadEndpointAddress : Token
    {
        public DBClusterReadEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DBClusterReadEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected DBClusterReadEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}