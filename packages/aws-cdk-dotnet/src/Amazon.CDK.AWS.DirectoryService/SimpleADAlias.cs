using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService
{
    [JsiiClass(typeof(SimpleADAlias), "@aws-cdk/aws-directoryservice.SimpleADAlias", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SimpleADAlias : Token
    {
        public SimpleADAlias(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SimpleADAlias(ByRefValue reference): base(reference)
        {
        }

        protected SimpleADAlias(DeputyProps props): base(props)
        {
        }
    }
}