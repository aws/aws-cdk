using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html </remarks>
    [JsiiInterface(typeof(IDeploymentStyleProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.DeploymentStyleProperty")]
    public interface IDeploymentStyleProperty
    {
        /// <summary>``DeploymentGroupResource.DeploymentStyleProperty.DeploymentOption``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html#cfn-codedeploy-deploymentgroup-deploymentstyle-deploymentoption </remarks>
        [JsiiProperty("deploymentOption", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeploymentOption
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.DeploymentStyleProperty.DeploymentType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html#cfn-codedeploy-deploymentgroup-deploymentstyle-deploymenttype </remarks>
        [JsiiProperty("deploymentType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeploymentType
        {
            get;
            set;
        }
    }
}