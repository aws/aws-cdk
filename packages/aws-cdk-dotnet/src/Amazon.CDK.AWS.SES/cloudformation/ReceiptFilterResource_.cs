using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html </remarks>
    [JsiiClass(typeof(ReceiptFilterResource_), "@aws-cdk/aws-ses.cloudformation.ReceiptFilterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptFilterResourceProps\"}}]")]
    public class ReceiptFilterResource_ : Resource
    {
        public ReceiptFilterResource_(Construct parent, string name, IReceiptFilterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReceiptFilterResource_(ByRefValue reference): base(reference)
        {
        }

        protected ReceiptFilterResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReceiptFilterResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}