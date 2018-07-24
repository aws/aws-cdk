using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html </remarks>
    [JsiiClass(typeof(ConfigurationTemplateResource_), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResourceProps\"}}]")]
    public class ConfigurationTemplateResource_ : Resource
    {
        public ConfigurationTemplateResource_(Construct parent, string name, IConfigurationTemplateResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ConfigurationTemplateResource_(ByRefValue reference): base(reference)
        {
        }

        protected ConfigurationTemplateResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ConfigurationTemplateResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}