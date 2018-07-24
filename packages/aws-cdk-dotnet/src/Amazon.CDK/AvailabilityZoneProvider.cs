using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Context provider that will return the availability zones for the current account and region</summary>
    [JsiiClass(typeof(AvailabilityZoneProvider), "@aws-cdk/cdk.AvailabilityZoneProvider", "[{\"name\":\"context\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
    public class AvailabilityZoneProvider : DeputyBase
    {
        public AvailabilityZoneProvider(Construct context): base(new DeputyProps(new object[]{context}))
        {
        }

        protected AvailabilityZoneProvider(ByRefValue reference): base(reference)
        {
        }

        protected AvailabilityZoneProvider(DeputyProps props): base(props)
        {
        }

        /// <summary>Return the list of AZs for the current account and region</summary>
        [JsiiProperty("availabilityZones", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] AvailabilityZones
        {
            get => GetInstanceProperty<string[]>();
        }
    }
}