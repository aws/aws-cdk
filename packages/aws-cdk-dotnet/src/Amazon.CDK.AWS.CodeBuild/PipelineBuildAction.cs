using Amazon.CDK.AWS.CodePipeline;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>CodePipeline build Action that uses AWS CodeBuild.</summary>
    [JsiiClass(typeof(PipelineBuildAction), "@aws-cdk/aws-codebuild.PipelineBuildAction", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.PipelineBuildActionProps\"}}]")]
    public class PipelineBuildAction : BuildAction
    {
        public PipelineBuildAction(Stage parent, string name, IPipelineBuildActionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected PipelineBuildAction(ByRefValue reference): base(reference)
        {
        }

        protected PipelineBuildAction(DeputyProps props): base(props)
        {
        }
    }
}