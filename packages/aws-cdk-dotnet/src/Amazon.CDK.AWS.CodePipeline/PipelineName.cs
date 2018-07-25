using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>The name of the pipeline.</summary>
    [JsiiClass(typeof(PipelineName), "@aws-cdk/aws-codepipeline.PipelineName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PipelineName : Token
    {
        public PipelineName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PipelineName(ByRefValue reference): base(reference)
        {
        }

        protected PipelineName(DeputyProps props): base(props)
        {
        }
    }
}