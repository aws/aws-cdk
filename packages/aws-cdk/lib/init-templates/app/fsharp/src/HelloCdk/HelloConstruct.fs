namespace HelloCdk

open Amazon.CDK
open Amazon.CDK.AWS.S3

type HelloConstructProps = { BucketCount : int }

type HelloConstruct(parent, id, props) as this =
    inherit Construct(parent, id)

    let buckets = 
        List.init props.BucketCount
            (fun i -> Bucket(this, "Bucket" + i.ToString(), BucketProps()))

    member public __.GrantRead(principal) =
        buckets
        |> List.iter (fun bucket -> bucket.GrantRead(principal, "*") |> ignore)
