using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>OS features specialized for Linux</summary>
    [JsiiClass(typeof(LinuxOS), "@aws-cdk/aws-ec2.LinuxOS", "[]")]
    public class LinuxOS : OperatingSystem
    {
        public LinuxOS(): base(new DeputyProps(new object[]{}))
        {
        }

        protected LinuxOS(ByRefValue reference): base(reference)
        {
        }

        protected LinuxOS(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("type", "{\"fqn\":\"@aws-cdk/aws-ec2.OperatingSystemType\"}")]
        public override OperatingSystemType Type
        {
            get => GetInstanceProperty<OperatingSystemType>();
        }

        [JsiiMethod("createUserData", "{\"primitive\":\"string\"}", "[{\"name\":\"scripts\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public override string CreateUserData(string[] scripts)
        {
            return InvokeInstanceMethod<string>(new object[]{scripts});
        }
    }
}