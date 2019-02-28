namespace HelloCdk

open Amazon.CDK
open Amazon.CDK.AWS.S3

type HelloConstructProps = { BucketCount : int }

type HelloConstruct(parent, id, props) as this =
    inherit Construct(parent, id)

    let mutable buckets = List.empty

    do
        buckets <- List.init props.BucketCount
            (fun i -> Bucket(this, "Bucket" + i.ToString(), BucketProps()))
        ()

    member public __.GrantRead(principal) =
        List.iter
            (fun (bucket : Bucket) -> bucket.GrantRead(principal, "*")) buckets
