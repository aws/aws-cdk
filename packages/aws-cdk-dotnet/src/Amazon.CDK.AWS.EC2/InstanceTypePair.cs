using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Instance type for EC2 instances
    /// 
    /// This class takes a combination of a class and size.
    /// 
    /// Be aware that not all combinations of class and size are available, and not all
    /// classes are available in all regions.
    /// </summary>
    [JsiiClass(typeof(InstanceTypePair), "@aws-cdk/aws-ec2.InstanceTypePair", "[{\"name\":\"instanceClass\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.InstanceClass\"}},{\"name\":\"instanceSize\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.InstanceSize\"}}]")]
    public class InstanceTypePair : InstanceType
    {
        public InstanceTypePair(InstanceClass instanceClass, InstanceSize instanceSize): base(new DeputyProps(new object[]{instanceClass, instanceSize}))
        {
        }

        protected InstanceTypePair(ByRefValue reference): base(reference)
        {
        }

        protected InstanceTypePair(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("instanceClass", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceClass\"}")]
        public virtual InstanceClass InstanceClass
        {
            get => GetInstanceProperty<InstanceClass>();
        }

        [JsiiProperty("instanceSize", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceSize\"}")]
        public virtual InstanceSize InstanceSize
        {
            get => GetInstanceProperty<InstanceSize>();
        }
    }
}