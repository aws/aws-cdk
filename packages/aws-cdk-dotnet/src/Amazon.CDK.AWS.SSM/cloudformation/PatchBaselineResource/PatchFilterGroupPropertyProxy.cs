using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.PatchBaselineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html </remarks>
    [JsiiInterfaceProxy(typeof(IPatchFilterGroupProperty), "@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.PatchFilterGroupProperty")]
    internal class PatchFilterGroupPropertyProxy : DeputyBase, IPatchFilterGroupProperty
    {
        private PatchFilterGroupPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PatchBaselineResource.PatchFilterGroupProperty.PatchFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html#cfn-ssm-patchbaseline-patchfiltergroup-patchfilters </remarks>
        [JsiiProperty("patchFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.PatchFilterProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object PatchFilters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}