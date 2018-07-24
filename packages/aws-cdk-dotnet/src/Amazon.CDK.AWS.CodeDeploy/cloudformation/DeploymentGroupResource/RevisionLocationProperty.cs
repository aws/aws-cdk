using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html </remarks>
    public class RevisionLocationProperty : DeputyBase, IRevisionLocationProperty
    {
        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.GitHubLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-githublocation </remarks>
        [JsiiProperty("gitHubLocation", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.GitHubLocationProperty\"}]},\"optional\":true}", true)]
        public object GitHubLocation
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.RevisionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-revisiontype </remarks>
        [JsiiProperty("revisionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RevisionType
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.RevisionLocationProperty.S3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html#cfn-properties-codedeploy-deploymentgroup-deployment-revision-s3location </remarks>
        [JsiiProperty("s3Location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.S3LocationProperty\"}]},\"optional\":true}", true)]
        public object S3Location
        {
            get;
            set;
        }
    }
}