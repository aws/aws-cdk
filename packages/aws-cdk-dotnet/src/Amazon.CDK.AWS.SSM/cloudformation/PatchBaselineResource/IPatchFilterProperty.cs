using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.PatchBaselineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html </remarks>
    [JsiiInterface(typeof(IPatchFilterProperty), "@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.PatchFilterProperty")]
    public interface IPatchFilterProperty
    {
        /// <summary>``PatchBaselineResource.PatchFilterProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Key
        {
            get;
            set;
        }

        /// <summary>``PatchBaselineResource.PatchFilterProperty.Values``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-values </remarks>
        [JsiiProperty("values", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Values
        {
            get;
            set;
        }
    }
}