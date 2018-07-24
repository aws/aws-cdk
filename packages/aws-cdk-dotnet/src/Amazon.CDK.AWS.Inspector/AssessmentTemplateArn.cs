using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Inspector
{
    [JsiiClass(typeof(AssessmentTemplateArn), "@aws-cdk/aws-inspector.AssessmentTemplateArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class AssessmentTemplateArn : Arn
    {
        public AssessmentTemplateArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected AssessmentTemplateArn(ByRefValue reference): base(reference)
        {
        }

        protected AssessmentTemplateArn(DeputyProps props): base(props)
        {
        }
    }
}