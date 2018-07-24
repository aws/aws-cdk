using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html </remarks>
    [JsiiInterfaceProxy(typeof(IProjectTriggersProperty), "@aws-cdk/aws-codebuild.cloudformation.ProjectResource.ProjectTriggersProperty")]
    internal class ProjectTriggersPropertyProxy : DeputyBase, IProjectTriggersProperty
    {
        private ProjectTriggersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ProjectResource.ProjectTriggersProperty.Webhook``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html#cfn-codebuild-project-projecttriggers-webhook </remarks>
        [JsiiProperty("webhook", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Webhook
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}