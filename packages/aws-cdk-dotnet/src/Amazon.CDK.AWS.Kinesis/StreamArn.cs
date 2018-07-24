using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    [JsiiClass(typeof(StreamArn), "@aws-cdk/aws-kinesis.StreamArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class StreamArn : Arn
    {
        public StreamArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected StreamArn(ByRefValue reference): base(reference)
        {
        }

        protected StreamArn(DeputyProps props): base(props)
        {
        }
    }
}