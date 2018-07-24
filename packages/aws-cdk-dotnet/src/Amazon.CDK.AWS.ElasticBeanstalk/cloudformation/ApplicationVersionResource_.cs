using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-version.html </remarks>
    [JsiiClass(typeof(ApplicationVersionResource_), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationVersionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationVersionResourceProps\"}}]")]
    public class ApplicationVersionResource_ : Resource
    {
        public ApplicationVersionResource_(Construct parent, string name, IApplicationVersionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ApplicationVersionResource_(ByRefValue reference): base(reference)
        {
        }

        protected ApplicationVersionResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ApplicationVersionResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}