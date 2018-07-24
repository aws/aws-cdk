using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Route53.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-healthcheck.html </remarks>
    [JsiiClass(typeof(HealthCheckResource_), "@aws-cdk/aws-route53.cloudformation.HealthCheckResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HealthCheckResourceProps\"}}]")]
    public class HealthCheckResource_ : Resource
    {
        public HealthCheckResource_(Construct parent, string name, IHealthCheckResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected HealthCheckResource_(ByRefValue reference): base(reference)
        {
        }

        protected HealthCheckResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(HealthCheckResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}