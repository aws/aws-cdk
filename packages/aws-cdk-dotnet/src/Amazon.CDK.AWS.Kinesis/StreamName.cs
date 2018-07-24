using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>The name of the stream.</summary>
    [JsiiClass(typeof(StreamName), "@aws-cdk/aws-kinesis.StreamName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class StreamName : Token
    {
        public StreamName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected StreamName(ByRefValue reference): base(reference)
        {
        }

        protected StreamName(DeputyProps props): base(props)
        {
        }
    }
}