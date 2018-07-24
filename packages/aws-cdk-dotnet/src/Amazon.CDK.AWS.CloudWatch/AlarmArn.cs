using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    [JsiiClass(typeof(AlarmArn), "@aws-cdk/aws-cloudwatch.AlarmArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class AlarmArn : Arn
    {
        public AlarmArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected AlarmArn(ByRefValue reference): base(reference)
        {
        }

        protected AlarmArn(DeputyProps props): base(props)
        {
        }
    }
}