using Amazon.CDK;
using Amazon.CDK.AWS.ElasticBeanstalk;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-environment.html </remarks>
    [JsiiClass(typeof(EnvironmentResource_), "@aws-cdk/aws-elasticbeanstalk.cloudformation.EnvironmentResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.EnvironmentResourceProps\"}}]")]
    public class EnvironmentResource_ : Resource
    {
        public EnvironmentResource_(Construct parent, string name, IEnvironmentResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EnvironmentResource_(ByRefValue reference): base(reference)
        {
        }

        protected EnvironmentResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EnvironmentResource_));
        /// <remarks>cloudformation_attribute: EndpointURL</remarks>
        [JsiiProperty("environmentEndpointUrl", "{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.EnvironmentEndpointUrl\"}")]
        public virtual EnvironmentEndpointUrl EnvironmentEndpointUrl
        {
            get => GetInstanceProperty<EnvironmentEndpointUrl>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}