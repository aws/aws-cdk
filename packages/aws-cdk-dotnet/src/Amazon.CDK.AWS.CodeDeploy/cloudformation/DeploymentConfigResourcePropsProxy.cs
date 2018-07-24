using Amazon.CDK;
using Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentConfigResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IDeploymentConfigResourceProps), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResourceProps")]
    internal class DeploymentConfigResourcePropsProxy : DeputyBase, IDeploymentConfigResourceProps
    {
        private DeploymentConfigResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CodeDeploy::DeploymentConfig.DeploymentConfigName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-deploymentconfigname </remarks>
        [JsiiProperty("deploymentConfigName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DeploymentConfigName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CodeDeploy::DeploymentConfig.MinimumHealthyHosts``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts </remarks>
        [JsiiProperty("minimumHealthyHosts", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResource.MinimumHealthyHostsProperty\"}]},\"optional\":true}")]
        public virtual object MinimumHealthyHosts
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}