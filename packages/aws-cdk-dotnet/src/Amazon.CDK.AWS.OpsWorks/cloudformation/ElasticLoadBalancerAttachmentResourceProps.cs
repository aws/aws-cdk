using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html </remarks>
    public class ElasticLoadBalancerAttachmentResourceProps : DeputyBase, IElasticLoadBalancerAttachmentResourceProps
    {
        /// <summary>``AWS::OpsWorks::ElasticLoadBalancerAttachment.ElasticLoadBalancerName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-elbname </remarks>
        [JsiiProperty("elasticLoadBalancerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ElasticLoadBalancerName
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::ElasticLoadBalancerAttachment.LayerId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-layerid </remarks>
        [JsiiProperty("layerId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object LayerId
        {
            get;
            set;
        }
    }
}