using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Selects the latest version of Amazon Linux
    /// 
    /// The AMI ID is selected using the values published to the SSM parameter store.
    /// </summary>
    [JsiiClass(typeof(AmazonLinuxImage), "@aws-cdk/aws-ec2.AmazonLinuxImage", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxImageProps\",\"optional\":true}}]")]
    public class AmazonLinuxImage : DeputyBase, IIMachineImageSource
    {
        public AmazonLinuxImage(IAmazonLinuxImageProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected AmazonLinuxImage(ByRefValue reference): base(reference)
        {
        }

        protected AmazonLinuxImage(DeputyProps props): base(props)
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