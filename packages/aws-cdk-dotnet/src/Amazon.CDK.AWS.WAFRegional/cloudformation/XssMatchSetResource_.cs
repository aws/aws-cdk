using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html </remarks>
    [JsiiClass(typeof(XssMatchSetResource_), "@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResourceProps\"}}]")]
    public class XssMatchSetResource_ : Resource
    {
        public XssMatchSetResource_(Construct parent, string name, IXssMatchSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected XssMatchSetResource_(ByRefValue reference): base(reference)
        {
        }

        protected XssMatchSetResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(XssMatchSetResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}