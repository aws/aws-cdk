using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html </remarks>
    [JsiiInterface(typeof(IRevisionLocationProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.RevisionLocationProperty")]
    public interface IRevisionLocationProperty
    {
        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.GitHubLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-githublocation </remarks>
        [JsiiProperty("gitHubLocation", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.GitHubLocationProperty\"}]},\"optional\":true}")]
        object GitHubLocation
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.RevisionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-revisiontype </remarks>
        [JsiiProperty("revisionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RevisionType
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.S3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-s3location </remarks>
        [JsiiProperty("s3Location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.S3LocationProperty\"}]},\"optional\":true}")]
        object S3Location
        {
            get;
            set;
        }
    }
}