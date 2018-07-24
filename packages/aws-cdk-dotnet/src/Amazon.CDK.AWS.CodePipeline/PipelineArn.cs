using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>The ARN of a pipeline</summary>
    [JsiiClass(typeof(PipelineArn), "@aws-cdk/aws-codepipeline.PipelineArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PipelineArn : Arn
    {
        public PipelineArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PipelineArn(ByRefValue reference): base(reference)
        {
        }

        protected PipelineArn(DeputyProps props): base(props)
        {
        }
    }
}