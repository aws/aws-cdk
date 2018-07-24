using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html </remarks>
    [JsiiClass(typeof(DomainNameResource_), "@aws-cdk/aws-apigateway.cloudformation.DomainNameResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.DomainNameResourceProps\"}}]")]
    public class DomainNameResource_ : Amazon.CDK.Resource
    {
        public DomainNameResource_(Construct parent, string name, IDomainNameResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DomainNameResource_(ByRefValue reference): base(reference)
        {
        }

        protected DomainNameResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DomainNameResource_));
        /// <remarks>cloudformation_attribute: DistributionDomainName</remarks>
        [JsiiProperty("domainNameDistributionDomainName", "{\"fqn\":\"@aws-cdk/aws-apigateway.DomainNameDistributionDomainName\"}")]
        public virtual DomainNameDistributionDomainName DomainNameDistributionDomainName
        {
            get => GetInstanceProperty<DomainNameDistributionDomainName>();
        }

        /// <remarks>cloudformation_attribute: DistributionHostedZoneId</remarks>
        [JsiiProperty("domainNameDistributionHostedZoneId", "{\"fqn\":\"@aws-cdk/aws-apigateway.DomainNameDistributionHostedZoneId\"}")]
        public virtual DomainNameDistributionHostedZoneId DomainNameDistributionHostedZoneId
        {
            get => GetInstanceProperty<DomainNameDistributionHostedZoneId>();
        }

        /// <remarks>cloudformation_attribute: RegionalDomainName</remarks>
        [JsiiProperty("domainNameRegionalDomainName", "{\"fqn\":\"@aws-cdk/aws-apigateway.DomainNameRegionalDomainName\"}")]
        public virtual DomainNameRegionalDomainName DomainNameRegionalDomainName
        {
            get => GetInstanceProperty<DomainNameRegionalDomainName>();
        }

        /// <remarks>cloudformation_attribute: RegionalHostedZoneId</remarks>
        [JsiiProperty("domainNameRegionalHostedZoneId", "{\"fqn\":\"@aws-cdk/aws-apigateway.DomainNameRegionalHostedZoneId\"}")]
        public virtual DomainNameRegionalHostedZoneId DomainNameRegionalHostedZoneId
        {
            get => GetInstanceProperty<DomainNameRegionalHostedZoneId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}