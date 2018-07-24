using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Representation of a machine to be launched
    /// 
    /// Combines an AMI ID with an OS.
    /// </summary>
    [JsiiClass(typeof(MachineImage), "@aws-cdk/aws-ec2.MachineImage", "[{\"name\":\"imageId\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"os\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.OperatingSystem\"}}]")]
    public class MachineImage : DeputyBase
    {
        public MachineImage(string imageId, OperatingSystem os): base(new DeputyProps(new object[]{imageId, os}))
        {
        }

        protected MachineImage(ByRefValue reference): base(reference)
        {
        }

        protected MachineImage(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("imageId", "{\"primitive\":\"string\"}")]
        public virtual string ImageId
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("os", "{\"fqn\":\"@aws-cdk/aws-ec2.OperatingSystem\"}")]
        public virtual OperatingSystem Os
        {
            get => GetInstanceProperty<OperatingSystem>();
        }
    }
}