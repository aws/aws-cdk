using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(DataSourceName), "@aws-cdk/aws-appsync.DataSourceName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DataSourceName : Token
    {
        public DataSourceName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DataSourceName(ByRefValue reference): base(reference)
        {
        }

        protected DataSourceName(DeputyProps props): base(props)
        {
        }
    }
}