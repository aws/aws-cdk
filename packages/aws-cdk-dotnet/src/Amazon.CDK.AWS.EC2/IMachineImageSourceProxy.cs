using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface for classes that can select an appropriate machine image to use</summary>
    [JsiiInterfaceProxy(typeof(IIMachineImageSource), "@aws-cdk/aws-ec2.IMachineImageSource")]
    internal class IMachineImageSourceProxy : DeputyBase, IIMachineImageSource
    {
        private IMachineImageSourceProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Return the image to use in the given context</summary>
        [JsiiMethod("getImage", "{\"fqn\":\"@aws-cdk/aws-ec2.MachineImage\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
        public virtual MachineImage GetImage(Construct parent)
        {
            return InvokeInstanceMethod<MachineImage>(new object[]{parent});
        }
    }
}