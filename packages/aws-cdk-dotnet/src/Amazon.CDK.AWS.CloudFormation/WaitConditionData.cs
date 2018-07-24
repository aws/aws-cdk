using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFormation
{
    [JsiiClass(typeof(WaitConditionData), "@aws-cdk/aws-cloudformation.WaitConditionData", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class WaitConditionData : Token
    {
        public WaitConditionData(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected WaitConditionData(ByRefValue reference): base(reference)
        {
        }

        protected WaitConditionData(DeputyProps props): base(props)
        {
        }
    }
}