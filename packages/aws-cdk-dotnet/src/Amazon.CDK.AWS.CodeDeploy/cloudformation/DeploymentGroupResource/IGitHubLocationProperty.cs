using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision-githublocation.html </remarks>
    [JsiiInterface(typeof(IGitHubLocationProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.GitHubLocationProperty")]
    public interface IGitHubLocationProperty
    {
        /// <summary>``DeploymentGroupResource.GitHubLocationProperty.CommitId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision-githublocation.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-githublocation-commitid </remarks>
        [JsiiProperty("commitId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object CommitId
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.GitHubLocationProperty.Repository``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision-githublocation.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-githublocation-repository </remarks>
        [JsiiProperty("repository", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Repository
        {
            get;
            set;
        }
    }
}