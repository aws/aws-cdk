using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    [JsiiClass(typeof(QueueArn), "@aws-cdk/aws-sqs.QueueArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class QueueArn : Arn
    {
        public QueueArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected QueueArn(ByRefValue reference): base(reference)
        {
        }

        protected QueueArn(DeputyProps props): base(props)
        {
        }
    }
}