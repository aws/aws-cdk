using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>The pipeline version.</summary>
    [JsiiClass(typeof(PipelineVersion), "@aws-cdk/aws-codepipeline.PipelineVersion", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PipelineVersion : Token
    {
        public PipelineVersion(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PipelineVersion(ByRefValue reference): base(reference)
        {
        }

        protected PipelineVersion(DeputyProps props): base(props)
        {
        }
    }
}