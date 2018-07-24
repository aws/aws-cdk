using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService
{
    [JsiiClass(typeof(SimpleADDnsIpAddresses), "@aws-cdk/aws-directoryservice.SimpleADDnsIpAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SimpleADDnsIpAddresses : Token
    {
        public SimpleADDnsIpAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SimpleADDnsIpAddresses(ByRefValue reference): base(reference)
        {
        }

        protected SimpleADDnsIpAddresses(DeputyProps props): base(props)
        {
        }
    }
}