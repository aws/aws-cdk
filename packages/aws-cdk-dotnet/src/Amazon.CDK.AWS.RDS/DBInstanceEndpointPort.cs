using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    [JsiiClass(typeof(DBInstanceEndpointPort), "@aws-cdk/aws-rds.DBInstanceEndpointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DBInstanceEndpointPort : Token
    {
        public DBInstanceEndpointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DBInstanceEndpointPort(ByRefValue reference): base(reference)
        {
        }

        protected DBInstanceEndpointPort(DeputyProps props): base(props)
        {
        }
    }
}