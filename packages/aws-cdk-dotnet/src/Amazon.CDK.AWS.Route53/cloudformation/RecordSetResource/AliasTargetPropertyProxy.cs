using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html </remarks>
    [JsiiInterfaceProxy(typeof(IAliasTargetProperty), "@aws-cdk/aws-route53.cloudformation.RecordSetResource.AliasTargetProperty")]
    internal class AliasTargetPropertyProxy : DeputyBase, Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource.IAliasTargetProperty
    {
        private AliasTargetPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RecordSetResource.AliasTargetProperty.DNSName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-dnshostname </remarks>
        [JsiiProperty("dnsName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DnsName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RecordSetResource.AliasTargetProperty.EvaluateTargetHealth``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-evaluatetargethealth </remarks>
        [JsiiProperty("evaluateTargetHealth", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EvaluateTargetHealth
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RecordSetResource.AliasTargetProperty.HostedZoneId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid </remarks>
        [JsiiProperty("hostedZoneId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object HostedZoneId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}