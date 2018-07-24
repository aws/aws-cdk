using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html </remarks>
    [JsiiClass(typeof(SizeConstraintSetResource_), "@aws-cdk/aws-wafregional.cloudformation.SizeConstraintSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SizeConstraintSetResourceProps\"}}]")]
    public class SizeConstraintSetResource_ : Resource
    {
        public SizeConstraintSetResource_(Construct parent, string name, ISizeConstraintSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SizeConstraintSetResource_(ByRefValue reference): base(reference)
        {
        }

        protected SizeConstraintSetResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SizeConstraintSetResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}