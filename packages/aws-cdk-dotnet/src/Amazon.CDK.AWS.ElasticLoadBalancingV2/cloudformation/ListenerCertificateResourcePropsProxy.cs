using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerCertificateResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html </remarks>
    [JsiiInterfaceProxy(typeof(IListenerCertificateResourceProps), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerCertificateResourceProps")]
    internal class ListenerCertificateResourcePropsProxy : DeputyBase, IListenerCertificateResourceProps
    {
        private ListenerCertificateResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerCertificate.Certificates``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificates </remarks>
        [JsiiProperty("certificates", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerCertificateResource.CertificateProperty\"}]}}}}]}}")]
        public virtual object Certificates
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerCertificate.ListenerArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-listenerarn </remarks>
        [JsiiProperty("listenerArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ListenerArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}