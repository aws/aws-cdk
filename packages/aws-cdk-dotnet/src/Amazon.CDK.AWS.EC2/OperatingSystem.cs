using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Abstraction of OS features we need to be aware of</summary>
    [JsiiClass(typeof(OperatingSystem), "@aws-cdk/aws-ec2.OperatingSystem", "[]")]
    public abstract class OperatingSystem : DeputyBase
    {
        protected OperatingSystem(): base(new DeputyProps(new object[]{}))
        {
        }

        protected OperatingSystem(ByRefValue reference): base(reference)
        {
        }

        protected OperatingSystem(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("type", "{\"fqn\":\"@aws-cdk/aws-ec2.OperatingSystemType\"}")]
        public virtual OperatingSystemType Type
        {
            get => GetInstanceProperty<OperatingSystemType>();
        }

        [JsiiMethod("createUserData", "{\"primitive\":\"string\"}", "[{\"name\":\"scripts\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public abstract string CreateUserData(string[] scripts);
    }
}