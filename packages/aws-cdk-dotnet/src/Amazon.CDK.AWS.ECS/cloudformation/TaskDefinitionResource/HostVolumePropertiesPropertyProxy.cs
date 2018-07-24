using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes-host.html </remarks>
    [JsiiInterfaceProxy(typeof(IHostVolumePropertiesProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HostVolumePropertiesProperty")]
    internal class HostVolumePropertiesPropertyProxy : DeputyBase, IHostVolumePropertiesProperty
    {
        private HostVolumePropertiesPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TaskDefinitionResource.HostVolumePropertiesProperty.SourcePath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumes-host.html#cfn-ecs-taskdefinition-volumes-host-sourcepath </remarks>
        [JsiiProperty("sourcePath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SourcePath
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}