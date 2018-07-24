using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC subnet</summary>
    public class VpcSubnetProps : DeputyBase, IVpcSubnetProps
    {
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}", true)]
        public string AvailabilityZone
        {
            get;
            set;
        }

        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/cdk.Token\"}", true)]
        public Token VpcId
        {
            get;
            set;
        }

        [JsiiProperty("cidrBlock", "{\"primitive\":\"string\"}", true)]
        public string CidrBlock
        {
            get;
            set;
        }

        [JsiiProperty("mapPublicIpOnLaunch", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? MapPublicIpOnLaunch
        {
            get;
            set;
        }
    }
}