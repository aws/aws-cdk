using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(NetworkInterfacePrimaryPrivateIpAddress), "@aws-cdk/aws-ec2.NetworkInterfacePrimaryPrivateIpAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class NetworkInterfacePrimaryPrivateIpAddress : Token
    {
        public NetworkInterfacePrimaryPrivateIpAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected NetworkInterfacePrimaryPrivateIpAddress(ByRefValue reference): base(reference)
        {
        }

        protected NetworkInterfacePrimaryPrivateIpAddress(DeputyProps props): base(props)
        {
        }
    }
}