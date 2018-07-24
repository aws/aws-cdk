using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Inspector.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html </remarks>
    [JsiiInterface(typeof(IResourceGroupResourceProps), "@aws-cdk/aws-inspector.cloudformation.ResourceGroupResourceProps")]
    public interface IResourceGroupResourceProps
    {
        /// <summary>``AWS::Inspector::ResourceGroup.ResourceGroupTags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html#cfn-inspector-resourcegroup-resourcegrouptags </remarks>
        [JsiiProperty("resourceGroupTags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]}}")]
        object ResourceGroupTags
        {
            get;
            set;
        }
    }
}