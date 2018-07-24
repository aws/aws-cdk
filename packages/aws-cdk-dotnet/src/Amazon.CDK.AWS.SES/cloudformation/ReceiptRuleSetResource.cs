using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html </remarks>
    [JsiiClass(typeof(ReceiptRuleSetResource), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleSetResourceProps\",\"optional\":true}}]")]
    public class ReceiptRuleSetResource : Resource
    {
        public ReceiptRuleSetResource(Construct parent, string name, IReceiptRuleSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReceiptRuleSetResource(ByRefValue reference): base(reference)
        {
        }

        protected ReceiptRuleSetResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReceiptRuleSetResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}