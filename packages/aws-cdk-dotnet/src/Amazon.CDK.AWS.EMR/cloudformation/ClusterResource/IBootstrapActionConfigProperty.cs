using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html </remarks>
    [JsiiInterface(typeof(IBootstrapActionConfigProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.BootstrapActionConfigProperty")]
    public interface IBootstrapActionConfigProperty
    {
        /// <summary>``ClusterResource.BootstrapActionConfigProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Name
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.BootstrapActionConfigProperty.ScriptBootstrapAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-scriptbootstrapaction </remarks>
        [JsiiProperty("scriptBootstrapAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ScriptBootstrapActionConfigProperty\"}]}}")]
        object ScriptBootstrapAction
        {
            get;
            set;
        }
    }
}