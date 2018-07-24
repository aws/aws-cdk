using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-volumesfrom.html </remarks>
    [JsiiInterfaceProxy(typeof(IVolumeFromProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.VolumeFromProperty")]
    internal class VolumeFromPropertyProxy : DeputyBase, IVolumeFromProperty
    {
        private VolumeFromPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TaskDefinitionResource.VolumeFromProperty.ReadOnly``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-volumesfrom.html#cfn-ecs-taskdefinition-containerdefinition-volumesfrom-readonly </remarks>
        [JsiiProperty("readOnly", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ReadOnly
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TaskDefinitionResource.VolumeFromProperty.SourceContainer``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-volumesfrom.html#cfn-ecs-taskdefinition-containerdefinition-volumesfrom-sourcecontainer </remarks>
        [JsiiProperty("sourceContainer", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SourceContainer
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}