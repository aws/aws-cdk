using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-mountpoints.html </remarks>
    [JsiiInterface(typeof(IMountPointProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.MountPointProperty")]
    public interface IMountPointProperty
    {
        /// <summary>``TaskDefinitionResource.MountPointProperty.ContainerPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-mountpoints.html#cfn-ecs-taskdefinition-containerdefinition-mountpoints-containerpath </remarks>
        [JsiiProperty("containerPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ContainerPath
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.MountPointProperty.ReadOnly``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-mountpoints.html#cfn-ecs-taskdefinition-containerdefinition-mountpoints-readonly </remarks>
        [JsiiProperty("readOnly", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadOnly
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.MountPointProperty.SourceVolume``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-mountpoints.html#cfn-ecs-taskdefinition-containerdefinition-mountpoints-sourcevolume </remarks>
        [JsiiProperty("sourceVolume", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SourceVolume
        {
            get;
            set;
        }
    }
}