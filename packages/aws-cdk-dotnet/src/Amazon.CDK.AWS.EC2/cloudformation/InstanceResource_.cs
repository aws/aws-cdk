using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html </remarks>
    [JsiiClass(typeof(InstanceResource_), "@aws-cdk/aws-ec2.cloudformation.InstanceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResourceProps\",\"optional\":true}}]")]
    public class InstanceResource_ : Resource
    {
        public InstanceResource_(Construct parent, string name, IInstanceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected InstanceResource_(ByRefValue reference): base(reference)
        {
        }

        protected InstanceResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(InstanceResource_));
        /// <remarks>cloudformation_attribute: AvailabilityZone</remarks>
        [JsiiProperty("instanceAvailabilityZone", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceAvailabilityZone\"}")]
        public virtual InstanceAvailabilityZone InstanceAvailabilityZone
        {
            get => GetInstanceProperty<InstanceAvailabilityZone>();
        }

        /// <remarks>cloudformation_attribute: PrivateDnsName</remarks>
        [JsiiProperty("instancePrivateDnsName", "{\"fqn\":\"@aws-cdk/aws-ec2.InstancePrivateDnsName\"}")]
        public virtual InstancePrivateDnsName InstancePrivateDnsName
        {
            get => GetInstanceProperty<InstancePrivateDnsName>();
        }

        /// <remarks>cloudformation_attribute: PrivateIp</remarks>
        [JsiiProperty("instancePrivateIp", "{\"fqn\":\"@aws-cdk/aws-ec2.InstancePrivateIp\"}")]
        public virtual InstancePrivateIp InstancePrivateIp
        {
            get => GetInstanceProperty<InstancePrivateIp>();
        }

        /// <remarks>cloudformation_attribute: PublicDnsName</remarks>
        [JsiiProperty("instancePublicDnsName", "{\"fqn\":\"@aws-cdk/aws-ec2.InstancePublicDnsName\"}")]
        public virtual InstancePublicDnsName InstancePublicDnsName
        {
            get => GetInstanceProperty<InstancePublicDnsName>();
        }

        /// <remarks>cloudformation_attribute: PublicIp</remarks>
        [JsiiProperty("instancePublicIp", "{\"fqn\":\"@aws-cdk/aws-ec2.InstancePublicIp\"}")]
        public virtual InstancePublicIp InstancePublicIp
        {
            get => GetInstanceProperty<InstancePublicIp>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}