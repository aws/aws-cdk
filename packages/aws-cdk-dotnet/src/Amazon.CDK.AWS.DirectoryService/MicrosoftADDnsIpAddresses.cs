using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService
{
    [JsiiClass(typeof(MicrosoftADDnsIpAddresses), "@aws-cdk/aws-directoryservice.MicrosoftADDnsIpAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class MicrosoftADDnsIpAddresses : Token
    {
        public MicrosoftADDnsIpAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected MicrosoftADDnsIpAddresses(ByRefValue reference): base(reference)
        {
        }

        protected MicrosoftADDnsIpAddresses(DeputyProps props): base(props)
        {
        }
    }
}