using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    [JsiiClass(typeof(TableStreamArn), "@aws-cdk/aws-dynamodb.TableStreamArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TableStreamArn : Arn
    {
        public TableStreamArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TableStreamArn(ByRefValue reference): base(reference)
        {
        }

        protected TableStreamArn(DeputyProps props): base(props)
        {
        }
    }
}