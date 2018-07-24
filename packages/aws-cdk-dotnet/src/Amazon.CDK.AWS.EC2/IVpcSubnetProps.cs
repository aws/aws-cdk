using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC subnet</summary>
    [JsiiInterface(typeof(IVpcSubnetProps), "@aws-cdk/aws-ec2.VpcSubnetProps")]
    public interface IVpcSubnetProps
    {
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        string AvailabilityZone
        {
            get;
            set;
        }

        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        Token VpcId
        {
            get;
            set;
        }

        [JsiiProperty("cidrBlock", "{\"primitive\":\"string\"}")]
        string CidrBlock
        {
            get;
            set;
        }

        [JsiiProperty("mapPublicIpOnLaunch", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? MapPublicIpOnLaunch
        {
            get;
            set;
        }
    }
}