using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html </remarks>
    [JsiiClass(typeof(ReceiptRuleResource_), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResourceProps\"}}]")]
    public class ReceiptRuleResource_ : Resource
    {
        public ReceiptRuleResource_(Construct parent, string name, IReceiptRuleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReceiptRuleResource_(ByRefValue reference): base(reference)
        {
        }

        protected ReceiptRuleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReceiptRuleResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}