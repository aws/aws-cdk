using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html </remarks>
    [JsiiClass(typeof(WebACLAssociationResource), "@aws-cdk/aws-wafregional.cloudformation.WebACLAssociationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.WebACLAssociationResourceProps\"}}]")]
    public class WebACLAssociationResource : Resource
    {
        public WebACLAssociationResource(Construct parent, string name, IWebACLAssociationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected WebACLAssociationResource(ByRefValue reference): base(reference)
        {
        }

        protected WebACLAssociationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(WebACLAssociationResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}