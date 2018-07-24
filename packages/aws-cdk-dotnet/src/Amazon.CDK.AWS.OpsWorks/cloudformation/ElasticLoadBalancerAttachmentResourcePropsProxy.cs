using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticLoadBalancerAttachmentResourceProps), "@aws-cdk/aws-opsworks.cloudformation.ElasticLoadBalancerAttachmentResourceProps")]
    internal class ElasticLoadBalancerAttachmentResourcePropsProxy : DeputyBase, IElasticLoadBalancerAttachmentResourceProps
    {
        private ElasticLoadBalancerAttachmentResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::OpsWorks::ElasticLoadBalancerAttachment.ElasticLoadBalancerName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-elbname </remarks>
        [JsiiProperty("elasticLoadBalancerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ElasticLoadBalancerName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::OpsWorks::ElasticLoadBalancerAttachment.LayerId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-layerid </remarks>
        [JsiiProperty("layerId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object LayerId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}