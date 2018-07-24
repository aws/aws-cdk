using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.PatchBaselineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html </remarks>
    [JsiiInterface(typeof(IPatchFilterGroupProperty), "@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.PatchFilterGroupProperty")]
    public interface IPatchFilterGroupProperty
    {
        /// <summary>``PatchBaselineResource.PatchFilterGroupProperty.PatchFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html#cfn-ssm-patchbaseline-patchfiltergroup-patchfilters </remarks>
        [JsiiProperty("patchFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.PatchFilterProperty\"}]}}}}]},\"optional\":true}")]
        object PatchFilters
        {
            get;
            set;
        }
    }
}