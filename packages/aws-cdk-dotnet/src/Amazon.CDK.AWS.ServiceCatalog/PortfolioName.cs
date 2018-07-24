using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(PortfolioName), "@aws-cdk/aws-servicecatalog.PortfolioName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PortfolioName : Token
    {
        public PortfolioName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PortfolioName(ByRefValue reference): base(reference)
        {
        }

        protected PortfolioName(DeputyProps props): base(props)
        {
        }
    }
}