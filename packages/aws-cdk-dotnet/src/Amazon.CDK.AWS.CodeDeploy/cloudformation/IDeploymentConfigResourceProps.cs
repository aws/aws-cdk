using Amazon.CDK;
using Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentConfigResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html </remarks>
    [JsiiInterface(typeof(IDeploymentConfigResourceProps), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResourceProps")]
    public interface IDeploymentConfigResourceProps
    {
        /// <summary>``AWS::CodeDeploy::DeploymentConfig.DeploymentConfigName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-deploymentconfigname </remarks>
        [JsiiProperty("deploymentConfigName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeploymentConfigName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentConfig.MinimumHealthyHosts``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts </remarks>
        [JsiiProperty("minimumHealthyHosts", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResource.MinimumHealthyHostsProperty\"}]},\"optional\":true}")]
        object MinimumHealthyHosts
        {
            get;
            set;
        }
    }
}