namespace HelloCdk

open HelloCdk

open System
open Amazon.CDK
open Amazon.CDK.AWS.IAM
open Amazon.CDK.AWS.SNS
open Amazon.CDK.AWS.SQS

type MyStack(scope, name, props) as this =
    inherit Stack(scope, name, props)

    let queue = Queue(this, "MyFirstQueue", QueueProps(VisibilityTimeoutSec = Nullable(300.)))
    let topic = Topic(this, "MyFirstTopic", TopicProps(DisplayName = "My First Topic Yeah"))
    let hello = HelloConstruct(this, "Buckets", { BucketCount = 5 })
    let user = User(this, "MyUser", UserProps())

    do
        topic.SubscribeQueue(queue) |> ignore
        hello.GrantRead(user)
