using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes.html </remarks>
    [JsiiInterface(typeof(IVolumeProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.VolumeProperty")]
    public interface IVolumeProperty
    {
        /// <summary>``TaskDefinitionResource.VolumeProperty.Host``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes.html#cfn-ecs-taskdefinition-volumes-host </remarks>
        [JsiiProperty("host", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HostVolumePropertiesProperty\"}]},\"optional\":true}")]
        object Host
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.VolumeProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes.html#cfn-ecs-taskdefinition-volumes-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Name
        {
            get;
            set;
        }
    }
}