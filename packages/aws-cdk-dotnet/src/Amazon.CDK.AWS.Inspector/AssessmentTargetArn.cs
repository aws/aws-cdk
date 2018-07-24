using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Inspector
{
    [JsiiClass(typeof(AssessmentTargetArn), "@aws-cdk/aws-inspector.AssessmentTargetArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class AssessmentTargetArn : Arn
    {
        public AssessmentTargetArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected AssessmentTargetArn(ByRefValue reference): base(reference)
        {
        }

        protected AssessmentTargetArn(DeputyProps props): base(props)
        {
        }
    }
}