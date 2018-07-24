using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.StepFunctions
{
    [JsiiClass(typeof(ActivityName), "@aws-cdk/aws-stepfunctions.ActivityName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ActivityName : Token
    {
        public ActivityName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ActivityName(ByRefValue reference): base(reference)
        {
        }

        protected ActivityName(DeputyProps props): base(props)
        {
        }
    }
}