using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes-host.html </remarks>
    [JsiiInterface(typeof(IHostVolumePropertiesProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HostVolumePropertiesProperty")]
    public interface IHostVolumePropertiesProperty
    {
        /// <summary>``TaskDefinitionResource.HostVolumePropertiesProperty.SourcePath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes-host.html#cfn-ecs-taskdefinition-volumes-host-sourcepath </remarks>
        [JsiiProperty("sourcePath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SourcePath
        {
            get;
            set;
        }
    }
}