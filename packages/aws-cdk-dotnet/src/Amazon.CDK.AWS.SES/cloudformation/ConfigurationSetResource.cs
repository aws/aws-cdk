using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html </remarks>
    [JsiiClass(typeof(ConfigurationSetResource), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ConfigurationSetResourceProps\",\"optional\":true}}]")]
    public class ConfigurationSetResource : Resource
    {
        public ConfigurationSetResource(Construct parent, string name, IConfigurationSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ConfigurationSetResource(ByRefValue reference): base(reference)
        {
        }

        protected ConfigurationSetResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ConfigurationSetResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}