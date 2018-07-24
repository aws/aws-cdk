using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html </remarks>
    public class DeploymentConfigurationProperty : DeputyBase, IDeploymentConfigurationProperty
    {
        /// <summary>``ServiceResource.DeploymentConfigurationProperty.MaximumPercent``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-maximumpercent </remarks>
        [JsiiProperty("maximumPercent", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaximumPercent
        {
            get;
            set;
        }

        /// <summary>``ServiceResource.DeploymentConfigurationProperty.MinimumHealthyPercent``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-minimumhealthypercent </remarks>
        [JsiiProperty("minimumHealthyPercent", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MinimumHealthyPercent
        {
            get;
            set;
        }
    }
}