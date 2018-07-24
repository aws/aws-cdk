using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html </remarks>
    [JsiiClass(typeof(AcceptedPortfolioShareResource), "@aws-cdk/aws-servicecatalog.cloudformation.AcceptedPortfolioShareResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.AcceptedPortfolioShareResourceProps\"}}]")]
    public class AcceptedPortfolioShareResource : Resource
    {
        public AcceptedPortfolioShareResource(Construct parent, string name, IAcceptedPortfolioShareResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected AcceptedPortfolioShareResource(ByRefValue reference): base(reference)
        {
        }

        protected AcceptedPortfolioShareResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(AcceptedPortfolioShareResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}