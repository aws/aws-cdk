using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Select the latest version of the indicated Windows version
    /// 
    /// The AMI ID is selected using the values published to the SSM parameter store.
    /// 
    /// https://aws.amazon.com/blogs/mt/query-for-the-latest-windows-ami-using-systems-manager-parameter-store/
    /// </summary>
    [JsiiClass(typeof(WindowsImage), "@aws-cdk/aws-ec2.WindowsImage", "[{\"name\":\"version\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.WindowsVersion\"}}]")]
    public class WindowsImage : DeputyBase, IIMachineImageSource
    {
        public WindowsImage(WindowsVersion version): base(new DeputyProps(new object[]{version}))
        {
        }

        protected WindowsImage(ByRefValue reference): base(reference)
        {
        }

        protected WindowsImage(DeputyProps props): base(props)
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