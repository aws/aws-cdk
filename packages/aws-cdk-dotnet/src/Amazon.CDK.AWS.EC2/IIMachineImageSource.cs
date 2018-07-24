using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface for classes that can select an appropriate machine image to use</summary>
    [JsiiInterface(typeof(IIMachineImageSource), "@aws-cdk/aws-ec2.IMachineImageSource")]
    public interface IIMachineImageSource
    {
        /// <summary>Return the image to use in the given context</summary>
        [JsiiMethod("getImage", "{\"fqn\":\"@aws-cdk/aws-ec2.MachineImage\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
        MachineImage GetImage(Construct parent);
    }
}