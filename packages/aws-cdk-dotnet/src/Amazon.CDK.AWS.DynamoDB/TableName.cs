using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    [JsiiClass(typeof(TableName), "@aws-cdk/aws-dynamodb.TableName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TableName : Token
    {
        public TableName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TableName(ByRefValue reference): base(reference)
        {
        }

        protected TableName(DeputyProps props): base(props)
        {
        }
    }
}