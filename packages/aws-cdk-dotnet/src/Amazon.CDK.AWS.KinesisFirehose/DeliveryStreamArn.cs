using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose
{
    [JsiiClass(typeof(DeliveryStreamArn), "@aws-cdk/aws-kinesisfirehose.DeliveryStreamArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DeliveryStreamArn : Arn
    {
        public DeliveryStreamArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DeliveryStreamArn(ByRefValue reference): base(reference)
        {
        }

        protected DeliveryStreamArn(DeputyProps props): base(props)
        {
        }
    }
}