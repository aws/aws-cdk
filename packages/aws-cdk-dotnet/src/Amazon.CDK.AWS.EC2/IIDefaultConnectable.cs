using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>An object that has a Connections object as well as a default port range.</summary>
    [JsiiInterface(typeof(IIDefaultConnectable), "@aws-cdk/aws-ec2.IDefaultConnectable")]
    public interface IIDefaultConnectable : IIConnectable
    {
        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        IIPortRange DefaultPortRange
        {
            get;
        }
    }
}