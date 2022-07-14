namespace %name.PascalCased%

open Amazon.CDK
open Amazon.CDK.AWS.SNS
open Amazon.CDK.AWS.SNS.Subscriptions
open Amazon.CDK.AWS.SQS

type %name.PascalCased%Stack(scope, id, props) as this =
    inherit Stack(scope, id, props)

    let queue = Queue(this, "%name.PascalCased%Queue", QueueProps(VisibilityTimeout = Duration.Seconds(300.)))

    let topic = Topic(this, "%name.PascalCased%Topic")
    do topic.AddSubscription(SqsSubscription(queue)) |> ignore
