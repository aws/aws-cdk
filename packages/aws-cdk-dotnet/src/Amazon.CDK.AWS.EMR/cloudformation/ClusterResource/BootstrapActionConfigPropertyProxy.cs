using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IBootstrapActionConfigProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.BootstrapActionConfigProperty")]
    internal class BootstrapActionConfigPropertyProxy : DeputyBase, IBootstrapActionConfigProperty
    {
        private BootstrapActionConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.BootstrapActionConfigProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.BootstrapActionConfigProperty.ScriptBootstrapAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-bootstrapactionconfig.html#cfn-elasticmapreduce-cluster-bootstrapactionconfig-scriptbootstrapaction </remarks>
        [JsiiProperty("scriptBootstrapAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ScriptBootstrapActionConfigProperty\"}]}}")]
        public virtual object ScriptBootstrapAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}