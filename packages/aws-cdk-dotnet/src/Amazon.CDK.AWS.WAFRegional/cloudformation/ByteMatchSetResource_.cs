using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html </remarks>
    [JsiiClass(typeof(ByteMatchSetResource_), "@aws-cdk/aws-wafregional.cloudformation.ByteMatchSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.ByteMatchSetResourceProps\"}}]")]
    public class ByteMatchSetResource_ : Resource
    {
        public ByteMatchSetResource_(Construct parent, string name, IByteMatchSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ByteMatchSetResource_(ByRefValue reference): base(reference)
        {
        }

        protected ByteMatchSetResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ByteMatchSetResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}