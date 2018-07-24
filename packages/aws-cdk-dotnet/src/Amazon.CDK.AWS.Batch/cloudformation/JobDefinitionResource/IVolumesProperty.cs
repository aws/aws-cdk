using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html </remarks>
    [JsiiInterface(typeof(IVolumesProperty), "@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.VolumesProperty")]
    public interface IVolumesProperty
    {
        /// <summary>``JobDefinitionResource.VolumesProperty.Host``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html#cfn-batch-jobdefinition-volumes-host </remarks>
        [JsiiProperty("host", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.VolumesHostProperty\"}]},\"optional\":true}")]
        object Host
        {
            get;
            set;
        }

        /// <summary>``JobDefinitionResource.VolumesProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html#cfn-batch-jobdefinition-volumes-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Name
        {
            get;
            set;
        }
    }
}