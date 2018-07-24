using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail
{
    [JsiiClass(typeof(TrailArn), "@aws-cdk/aws-cloudtrail.TrailArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TrailArn : Arn
    {
        public TrailArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TrailArn(ByRefValue reference): base(reference)
        {
        }

        protected TrailArn(DeputyProps props): base(props)
        {
        }
    }
}