using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html </remarks>
    [JsiiInterface(typeof(ILinuxParametersProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.LinuxParametersProperty")]
    public interface ILinuxParametersProperty
    {
        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.Capabilities``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-capabilities </remarks>
        [JsiiProperty("capabilities", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.KernelCapabilitiesProperty\"}]},\"optional\":true}")]
        object Capabilities
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.Devices``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-devices </remarks>
        [JsiiProperty("devices", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.DeviceProperty\"}]}}}}]},\"optional\":true}")]
        object Devices
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.InitProcessEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-initprocessenabled </remarks>
        [JsiiProperty("initProcessEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InitProcessEnabled
        {
            get;
            set;
        }
    }
}