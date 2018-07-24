using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Manual approval action</summary>
    [JsiiClass(typeof(ApprovalAction), "@aws-cdk/aws-codepipeline.ApprovalAction", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class ApprovalAction : Action
    {
        public ApprovalAction(Stage parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected ApprovalAction(ByRefValue reference): base(reference)
        {
        }

        protected ApprovalAction(DeputyProps props): base(props)
        {
        }
    }
}