using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html </remarks>
    [JsiiInterface(typeof(IMountPointsProperty), "@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.MountPointsProperty")]
    public interface IMountPointsProperty
    {
        /// <summary>``JobDefinitionResource.MountPointsProperty.ContainerPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-containerpath </remarks>
        [JsiiProperty("containerPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ContainerPath
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.MountPointsProperty.ReadOnly``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-readonly </remarks>
        [JsiiProperty("readOnly", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadOnly
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.MountPointsProperty.SourceVolume``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-sourcevolume </remarks>
        [JsiiProperty("sourceVolume", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SourceVolume
        {
            get;
            set;
        }
    }
}