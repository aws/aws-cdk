using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    [JsiiClass(typeof(DBInstanceEndpointAddress), "@aws-cdk/aws-rds.DBInstanceEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DBInstanceEndpointAddress : Token
    {
        public DBInstanceEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DBInstanceEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected DBInstanceEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}