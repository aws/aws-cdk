using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerCertificateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html </remarks>
    [JsiiInterfaceProxy(typeof(ICertificateProperty), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerCertificateResource.CertificateProperty")]
    internal class CertificatePropertyProxy : DeputyBase, Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerCertificateResource.ICertificateProperty
    {
        private CertificatePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ListenerCertificateResource.CertificateProperty.CertificateArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html#cfn-elasticloadbalancingv2-listener-certificates-certificatearn </remarks>
        [JsiiProperty("certificateArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CertificateArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}