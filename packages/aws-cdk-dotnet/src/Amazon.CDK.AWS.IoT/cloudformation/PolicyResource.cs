using Amazon.CDK;
using Amazon.CDK.AWS.IoT;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html </remarks>
    [JsiiClass(typeof(PolicyResource), "@aws-cdk/aws-iot.cloudformation.PolicyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.PolicyResourceProps\"}}]")]
    public class PolicyResource : Resource
    {
        public PolicyResource(Construct parent, string name, IPolicyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PolicyResource(ByRefValue reference): base(reference)
        {
        }

        protected PolicyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PolicyResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("policyArn", "{\"fqn\":\"@aws-cdk/aws-iot.PolicyArn\"}")]
        public virtual PolicyArn PolicyArn
        {
            get => GetInstanceProperty<PolicyArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}