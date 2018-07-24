using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html </remarks>
    [JsiiInterfaceProxy(typeof(IRevisionLocationProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.RevisionLocationProperty")]
    internal class RevisionLocationPropertyProxy : DeputyBase, IRevisionLocationProperty
    {
        private RevisionLocationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.GitHubLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-githublocation </remarks>
        [JsiiProperty("gitHubLocation", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.GitHubLocationProperty\"}]},\"optional\":true}")]
        public virtual object GitHubLocation
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.RevisionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-revisiontype </remarks>
        [JsiiProperty("revisionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RevisionType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.S3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-s3location </remarks>
        [JsiiProperty("s3Location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.S3LocationProperty\"}]},\"optional\":true}")]
        public virtual object S3Location
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}