using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(DataSourceArn), "@aws-cdk/aws-appsync.DataSourceArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DataSourceArn : Arn
    {
        public DataSourceArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DataSourceArn(ByRefValue reference): base(reference)
        {
        }

        protected DataSourceArn(DeputyProps props): base(props)
        {
        }
    }
}