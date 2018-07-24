using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html </remarks>
    public class LinuxParametersProperty : DeputyBase, ILinuxParametersProperty
    {
        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.Capabilities``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-capabilities </remarks>
        [JsiiProperty("capabilities", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.KernelCapabilitiesProperty\"}]},\"optional\":true}", true)]
        public object Capabilities
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.Devices``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-devices </remarks>
        [JsiiProperty("devices", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.DeviceProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Devices
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.LinuxParametersProperty.InitProcessEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-initprocessenabled </remarks>
        [JsiiProperty("initProcessEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InitProcessEnabled
        {
            get;
            set;
        }
    }
}