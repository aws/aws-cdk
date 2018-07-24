using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html </remarks>
    [JsiiInterfaceProxy(typeof(IAcceptedPortfolioShareResourceProps), "@aws-cdk/aws-servicecatalog.cloudformation.AcceptedPortfolioShareResourceProps")]
    internal class AcceptedPortfolioShareResourcePropsProxy : DeputyBase, IAcceptedPortfolioShareResourceProps
    {
        private AcceptedPortfolioShareResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ServiceCatalog::AcceptedPortfolioShare.PortfolioId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-portfolioid </remarks>
        [JsiiProperty("portfolioId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PortfolioId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ServiceCatalog::AcceptedPortfolioShare.AcceptLanguage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-acceptlanguage </remarks>
        [JsiiProperty("acceptLanguage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AcceptLanguage
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}