using Amazon.CDK;
using Amazon.CDK.AWS.ServiceCatalog;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html </remarks>
    [JsiiClass(typeof(PortfolioResource), "@aws-cdk/aws-servicecatalog.cloudformation.PortfolioResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.PortfolioResourceProps\"}}]")]
    public class PortfolioResource : Resource
    {
        public PortfolioResource(Construct parent, string name, IPortfolioResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PortfolioResource(ByRefValue reference): base(reference)
        {
        }

        protected PortfolioResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PortfolioResource));
        /// <remarks>cloudformation_attribute: PortfolioName</remarks>
        [JsiiProperty("portfolioName", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.PortfolioName\"}")]
        public virtual PortfolioName PortfolioName
        {
            get => GetInstanceProperty<PortfolioName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}