using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    [JsiiClass(typeof(QueueName), "@aws-cdk/aws-sqs.QueueName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class QueueName : Token
    {
        public QueueName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected QueueName(ByRefValue reference): base(reference)
        {
        }

        protected QueueName(DeputyProps props): base(props)
        {
        }
    }
}