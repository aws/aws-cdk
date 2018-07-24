using Amazon.CDK.AWS.CodePipeline;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>CodePipeline Source that is provided by an AWS CodeCommit repository.</summary>
    [JsiiClass(typeof(PipelineSource), "@aws-cdk/aws-codecommit.PipelineSource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.PipelineSourceProps\"}}]")]
    public class PipelineSource : Source
    {
        public PipelineSource(Stage parent, string name, IPipelineSourceProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected PipelineSource(ByRefValue reference): base(reference)
        {
        }

        protected PipelineSource(DeputyProps props): base(props)
        {
        }
    }
}