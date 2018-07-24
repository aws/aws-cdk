using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html </remarks>
    [JsiiInterface(typeof(IContainerPropertiesProperty), "@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.ContainerPropertiesProperty")]
    public interface IContainerPropertiesProperty
    {
        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Command``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-command </remarks>
        [JsiiProperty("command", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Command
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Environment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-environment </remarks>
        [JsiiProperty("environment", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.EnvironmentProperty\"}]}}}}]},\"optional\":true}")]
        object Environment
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Image``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-image </remarks>
        [JsiiProperty("image", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Image
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.JobRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-jobrolearn </remarks>
        [JsiiProperty("jobRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object JobRoleArn
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Memory``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-memory </remarks>
        [JsiiProperty("memory", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Memory
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.MountPoints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-mountpoints </remarks>
        [JsiiProperty("mountPoints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.MountPointsProperty\"}]}}}}]},\"optional\":true}")]
        object MountPoints
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Privileged``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-privileged </remarks>
        [JsiiProperty("privileged", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Privileged
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.ReadonlyRootFilesystem``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-readonlyrootfilesystem </remarks>
        [JsiiProperty("readonlyRootFilesystem", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadonlyRootFilesystem
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Ulimits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-ulimits </remarks>
        [JsiiProperty("ulimits", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.UlimitProperty\"}]}}}}]},\"optional\":true}")]
        object Ulimits
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.User``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-user </remarks>
        [JsiiProperty("user", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object User
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Vcpus``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-vcpus </remarks>
        [JsiiProperty("vcpus", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Vcpus
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.ContainerPropertiesProperty.Volumes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-volumes </remarks>
        [JsiiProperty("volumes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.VolumesProperty\"}]}}}}]},\"optional\":true}")]
        object Volumes
        {
            get;
            set;
        }
    }
}