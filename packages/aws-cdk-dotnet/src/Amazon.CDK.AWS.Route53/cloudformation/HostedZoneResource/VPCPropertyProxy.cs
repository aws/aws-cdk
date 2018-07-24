using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone-hostedzonevpcs.html </remarks>
    [JsiiInterfaceProxy(typeof(IVPCProperty), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource.VPCProperty")]
    internal class VPCPropertyProxy : DeputyBase, IVPCProperty
    {
        private VPCPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``HostedZoneResource.VPCProperty.VPCId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone-hostedzonevpcs.html#cfn-route53-hostedzone-hostedzonevpcs-vpcid </remarks>
        [JsiiProperty("vpcId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object VpcId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``HostedZoneResource.VPCProperty.VPCRegion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone-hostedzonevpcs.html#cfn-route53-hostedzone-hostedzonevpcs-vpcregion </remarks>
        [JsiiProperty("vpcRegion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object VpcRegion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}