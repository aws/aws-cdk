using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <remarks>link: https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html </remarks>
    [JsiiClass(typeof(InvokeLambdaAction), "@aws-cdk/aws-codepipeline.InvokeLambdaAction", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.InvokeLambdaProps\"}}]")]
    public class InvokeLambdaAction : Action
    {
        public InvokeLambdaAction(Stage parent, string name, IInvokeLambdaProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected InvokeLambdaAction(ByRefValue reference): base(reference)
        {
        }

        protected InvokeLambdaAction(DeputyProps props): base(props)
        {
        }

        /// <summary>Add an input artifact</summary>
        [JsiiMethod("addInputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Action\"}", "[{\"name\":\"artifact\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}}]")]
        protected override Action AddInputArtifact(Artifact artifact)
        {
            return InvokeInstanceMethod<Action>(new object[]{artifact});
        }
    }
}