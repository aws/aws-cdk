using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>URL of a queue</summary>
    [JsiiClass(typeof(QueueUrl), "@aws-cdk/aws-sqs.QueueUrl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class QueueUrl : Token
    {
        public QueueUrl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected QueueUrl(ByRefValue reference): base(reference)
        {
        }

        protected QueueUrl(DeputyProps props): base(props)
        {
        }
    }
}