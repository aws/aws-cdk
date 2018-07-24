using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>OS features specialized for Windows</summary>
    [JsiiClass(typeof(WindowsOS), "@aws-cdk/aws-ec2.WindowsOS", "[]")]
    public class WindowsOS : OperatingSystem
    {
        public WindowsOS(): base(new DeputyProps(new object[]{}))
        {
        }

        protected WindowsOS(ByRefValue reference): base(reference)
        {
        }

        protected WindowsOS(DeputyProps props): base(props)
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