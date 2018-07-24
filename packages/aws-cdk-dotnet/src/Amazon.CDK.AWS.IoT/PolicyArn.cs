using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT
{
    [JsiiClass(typeof(PolicyArn), "@aws-cdk/aws-iot.PolicyArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PolicyArn : Arn
    {
        public PolicyArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PolicyArn(ByRefValue reference): base(reference)
        {
        }

        protected PolicyArn(DeputyProps props): base(props)
        {
        }
    }
}