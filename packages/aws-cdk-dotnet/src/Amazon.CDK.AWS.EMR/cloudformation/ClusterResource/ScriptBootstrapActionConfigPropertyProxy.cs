using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IScriptBootstrapActionConfigProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.ScriptBootstrapActionConfigProperty")]
    internal class ScriptBootstrapActionConfigPropertyProxy : DeputyBase, IScriptBootstrapActionConfigProperty
    {
        private ScriptBootstrapActionConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.ScriptBootstrapActionConfigProperty.Args``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html#cfn-elasticmapreduce-cluster-scriptbootstrapactionconfig-args </remarks>
        [JsiiProperty("args", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Args
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.ScriptBootstrapActionConfigProperty.Path``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-scriptbootstrapactionconfig.html#cfn-elasticmapreduce-cluster-scriptbootstrapactionconfig-path </remarks>
        [JsiiProperty("path", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Path
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}