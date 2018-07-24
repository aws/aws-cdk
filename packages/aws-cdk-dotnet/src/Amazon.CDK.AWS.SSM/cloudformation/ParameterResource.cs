using Amazon.CDK;
using Amazon.CDK.AWS.SSM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SSM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html </remarks>
    [JsiiClass(typeof(ParameterResource), "@aws-cdk/aws-ssm.cloudformation.ParameterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.ParameterResourceProps\"}}]")]
    public class ParameterResource : Resource
    {
        public ParameterResource(Construct parent, string name, IParameterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ParameterResource(ByRefValue reference): base(reference)
        {
        }

        protected ParameterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ParameterResource));
        /// <remarks>cloudformation_attribute: Type</remarks>
        [JsiiProperty("parameterType", "{\"fqn\":\"@aws-cdk/aws-ssm.ParameterType\"}")]
        public virtual ParameterType ParameterType
        {
            get => GetInstanceProperty<ParameterType>();
        }

        /// <remarks>cloudformation_attribute: Value</remarks>
        [JsiiProperty("parameterValue", "{\"fqn\":\"@aws-cdk/aws-ssm.ParameterValue\"}")]
        public virtual ParameterValue ParameterValue
        {
            get => GetInstanceProperty<ParameterValue>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}