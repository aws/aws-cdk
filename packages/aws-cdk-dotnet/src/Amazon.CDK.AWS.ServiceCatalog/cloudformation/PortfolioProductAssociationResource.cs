using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html </remarks>
    [JsiiClass(typeof(PortfolioProductAssociationResource), "@aws-cdk/aws-servicecatalog.cloudformation.PortfolioProductAssociationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.PortfolioProductAssociationResourceProps\"}}]")]
    public class PortfolioProductAssociationResource : Resource
    {
        public PortfolioProductAssociationResource(Construct parent, string name, IPortfolioProductAssociationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PortfolioProductAssociationResource(ByRefValue reference): base(reference)
        {
        }

        protected PortfolioProductAssociationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PortfolioProductAssociationResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}