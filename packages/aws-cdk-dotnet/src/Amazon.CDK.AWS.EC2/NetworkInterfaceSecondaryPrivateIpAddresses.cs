using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(NetworkInterfaceSecondaryPrivateIpAddresses), "@aws-cdk/aws-ec2.NetworkInterfaceSecondaryPrivateIpAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class NetworkInterfaceSecondaryPrivateIpAddresses : Token
    {
        public NetworkInterfaceSecondaryPrivateIpAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected NetworkInterfaceSecondaryPrivateIpAddresses(ByRefValue reference): base(reference)
        {
        }

        protected NetworkInterfaceSecondaryPrivateIpAddresses(DeputyProps props): base(props)
        {
        }
    }
}