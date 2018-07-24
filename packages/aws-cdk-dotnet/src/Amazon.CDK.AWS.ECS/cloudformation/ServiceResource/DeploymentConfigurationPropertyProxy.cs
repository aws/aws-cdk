using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IDeploymentConfigurationProperty), "@aws-cdk/aws-ecs.cloudformation.ServiceResource.DeploymentConfigurationProperty")]
    internal class DeploymentConfigurationPropertyProxy : DeputyBase, IDeploymentConfigurationProperty
    {
        private DeploymentConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ServiceResource.DeploymentConfigurationProperty.MaximumPercent``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-maximumpercent </remarks>
        [JsiiProperty("maximumPercent", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MaximumPercent
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ServiceResource.DeploymentConfigurationProperty.MinimumHealthyPercent``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-minimumhealthypercent </remarks>
        [JsiiProperty("minimumHealthyPercent", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MinimumHealthyPercent
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}