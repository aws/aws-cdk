using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail
{
    [JsiiClass(typeof(TrailSnsTopicArn), "@aws-cdk/aws-cloudtrail.TrailSnsTopicArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TrailSnsTopicArn : Arn
    {
        public TrailSnsTopicArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TrailSnsTopicArn(ByRefValue reference): base(reference)
        {
        }

        protected TrailSnsTopicArn(DeputyProps props): base(props)
        {
        }
    }
}