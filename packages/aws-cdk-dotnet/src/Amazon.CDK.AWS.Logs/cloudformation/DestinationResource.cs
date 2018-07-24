using Amazon.CDK;
using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html </remarks>
    [JsiiClass(typeof(DestinationResource), "@aws-cdk/aws-logs.cloudformation.DestinationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.cloudformation.DestinationResourceProps\"}}]")]
    public class DestinationResource : Resource
    {
        public DestinationResource(Construct parent, string name, IDestinationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DestinationResource(ByRefValue reference): base(reference)
        {
        }

        protected DestinationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DestinationResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("destinationArn", "{\"fqn\":\"@aws-cdk/aws-logs.DestinationArn\"}")]
        public virtual DestinationArn DestinationArn
        {
            get => GetInstanceProperty<DestinationArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}