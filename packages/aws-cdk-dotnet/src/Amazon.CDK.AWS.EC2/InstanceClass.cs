using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// What class and generation of instance to use
    /// 
    /// We have both symbolic and concrete enums for every type.
    /// 
    /// The first are for people that want to specify by purpose,
    /// the second one are for people who already know exactly what
    /// 'R4' means.
    /// </summary>
    [JsiiEnum(typeof(InstanceClass), "@aws-cdk/aws-ec2.InstanceClass")]
    public enum InstanceClass
    {
        [JsiiEnumMember("Standard3")]
        Standard3,
        [JsiiEnumMember("M3")]
        M3,
        [JsiiEnumMember("Standard4")]
        Standard4,
        [JsiiEnumMember("M4")]
        M4,
        [JsiiEnumMember("Standard5")]
        Standard5,
        [JsiiEnumMember("M5")]
        M5,
        [JsiiEnumMember("Memory3")]
        Memory3,
        [JsiiEnumMember("R3")]
        R3,
        [JsiiEnumMember("Memory4")]
        Memory4,
        [JsiiEnumMember("R4")]
        R4,
        [JsiiEnumMember("Compute3")]
        Compute3,
        [JsiiEnumMember("C3")]
        C3,
        [JsiiEnumMember("Compute4")]
        Compute4,
        [JsiiEnumMember("C4")]
        C4,
        [JsiiEnumMember("Compute5")]
        Compute5,
        [JsiiEnumMember("C5")]
        C5,
        [JsiiEnumMember("Storage2")]
        Storage2,
        [JsiiEnumMember("D2")]
        D2,
        [JsiiEnumMember("StorageCompute1")]
        StorageCompute1,
        [JsiiEnumMember("H1")]
        H1,
        [JsiiEnumMember("Io3")]
        Io3,
        [JsiiEnumMember("I3")]
        I3,
        [JsiiEnumMember("Burstable2")]
        Burstable2,
        [JsiiEnumMember("T2")]
        T2,
        [JsiiEnumMember("MemoryIntensive1")]
        MemoryIntensive1,
        [JsiiEnumMember("X1")]
        X1,
        [JsiiEnumMember("MemoryIntensive1Extended")]
        MemoryIntensive1Extended,
        [JsiiEnumMember("X1e")]
        X1e,
        [JsiiEnumMember("Fpga1")]
        Fpga1,
        [JsiiEnumMember("F1")]
        F1,
        [JsiiEnumMember("Graphics3")]
        Graphics3,
        [JsiiEnumMember("G3")]
        G3,
        [JsiiEnumMember("Parallel2")]
        Parallel2,
        [JsiiEnumMember("P2")]
        P2,
        [JsiiEnumMember("Parallel3")]
        Parallel3,
        [JsiiEnumMember("P3")]
        P3
    }
}