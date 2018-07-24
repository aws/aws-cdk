using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiEnum(typeof(LoadBalancingProtocol), "@aws-cdk/aws-ec2.LoadBalancingProtocol")]
    public enum LoadBalancingProtocol
    {
        [JsiiEnumMember("Tcp")]
        Tcp,
        [JsiiEnumMember("Ssl")]
        Ssl,
        [JsiiEnumMember("Http")]
        Http,
        [JsiiEnumMember("Https")]
        Https
    }
}