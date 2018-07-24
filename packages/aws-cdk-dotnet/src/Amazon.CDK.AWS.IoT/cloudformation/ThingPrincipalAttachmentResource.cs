using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingprincipalattachment.html </remarks>
    [JsiiClass(typeof(ThingPrincipalAttachmentResource), "@aws-cdk/aws-iot.cloudformation.ThingPrincipalAttachmentResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.ThingPrincipalAttachmentResourceProps\"}}]")]
    public class ThingPrincipalAttachmentResource : Resource
    {
        public ThingPrincipalAttachmentResource(Construct parent, string name, IThingPrincipalAttachmentResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ThingPrincipalAttachmentResource(ByRefValue reference): base(reference)
        {
        }

        protected ThingPrincipalAttachmentResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ThingPrincipalAttachmentResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}