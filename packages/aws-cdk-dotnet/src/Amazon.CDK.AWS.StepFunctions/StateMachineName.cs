using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.StepFunctions
{
    [JsiiClass(typeof(StateMachineName), "@aws-cdk/aws-stepfunctions.StateMachineName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class StateMachineName : Token
    {
        public StateMachineName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected StateMachineName(ByRefValue reference): base(reference)
        {
        }

        protected StateMachineName(DeputyProps props): base(props)
        {
        }
    }
}