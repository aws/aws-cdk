using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html </remarks>
    [JsiiClass(typeof(UsagePlanResource_), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.UsagePlanResourceProps\",\"optional\":true}}]")]
    public class UsagePlanResource_ : Amazon.CDK.Resource
    {
        public UsagePlanResource_(Construct parent, string name, IUsagePlanResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UsagePlanResource_(ByRefValue reference): base(reference)
        {
        }

        protected UsagePlanResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UsagePlanResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}