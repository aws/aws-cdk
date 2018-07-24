using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    [JsiiClass(typeof(TableArn), "@aws-cdk/aws-dynamodb.TableArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TableArn : Arn
    {
        public TableArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TableArn(ByRefValue reference): base(reference)
        {
        }

        protected TableArn(DeputyProps props): base(props)
        {
        }
    }
}