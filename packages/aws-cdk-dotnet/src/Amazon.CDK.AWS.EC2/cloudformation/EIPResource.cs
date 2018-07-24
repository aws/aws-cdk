using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-eip.html </remarks>
    [JsiiClass(typeof(EIPResource), "@aws-cdk/aws-ec2.cloudformation.EIPResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.EIPResourceProps\",\"optional\":true}}]")]
    public class EIPResource : Resource
    {
        public EIPResource(Construct parent, string name, IEIPResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EIPResource(ByRefValue reference): base(reference)
        {
        }

        protected EIPResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EIPResource));
        /// <remarks>cloudformation_attribute: AllocationId</remarks>
        [JsiiProperty("eipAllocationId", "{\"fqn\":\"@aws-cdk/aws-ec2.EIPAllocationId\"}")]
        public virtual EIPAllocationId EipAllocationId
        {
            get => GetInstanceProperty<EIPAllocationId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}