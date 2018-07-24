using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html </remarks>
    [JsiiInterface(typeof(IPortfolioProductAssociationResourceProps), "@aws-cdk/aws-servicecatalog.cloudformation.PortfolioProductAssociationResourceProps")]
    public interface IPortfolioProductAssociationResourceProps
    {
        /// <summary>``AWS::ServiceCatalog::PortfolioProductAssociation.PortfolioId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-portfolioid </remarks>
        [JsiiProperty("portfolioId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PortfolioId
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceCatalog::PortfolioProductAssociation.ProductId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-productid </remarks>
        [JsiiProperty("productId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ProductId
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceCatalog::PortfolioProductAssociation.AcceptLanguage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-acceptlanguage </remarks>
        [JsiiProperty("acceptLanguage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AcceptLanguage
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceCatalog::PortfolioProductAssociation.SourcePortfolioId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-sourceportfolioid </remarks>
        [JsiiProperty("sourcePortfolioId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SourcePortfolioId
        {
            get;
            set;
        }
    }
}