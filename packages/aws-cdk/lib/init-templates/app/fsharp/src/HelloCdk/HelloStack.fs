namespace HelloCdk

open HelloCdk

open Amazon.CDK
open Amazon.CDK.AWS.IAM
open Amazon.CDK.AWS.SNS
open Amazon.CDK.AWS.SNS.Subscriptions
open Amazon.CDK.AWS.SQS

type MyStack(scope, id, props) as this =
    inherit Stack(scope, id, props)

    let queue = Queue(this, "MyFirstQueue", QueueProps(VisibilityTimeout = Duration.Seconds(300.)))

    let topic = Topic(this, "MyFirstTopic", TopicProps(DisplayName = "My First Topic Yeah"))
    do topic.AddSubscription(SqsSubscription(queue, null))

    let hello = HelloConstruct(this, "Buckets", { BucketCount = 5 })
    let user = User(this, "MyUser", UserProps())
    do hello.GrantRead(user)
