using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Properties for a private hosted zone.</summary>
    [JsiiInterface(typeof(IPrivateHostedZoneProps), "@aws-cdk/aws-route53.PrivateHostedZoneProps")]
    public interface IPrivateHostedZoneProps : IPublicHostedZoneProps
    {
        /// <summary>One VPC that you want to associate with this hosted zone.</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        VpcNetworkRef Vpc
        {
            get;
            set;
        }
    }
}