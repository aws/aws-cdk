open Amazon.CDK
open HelloCdk

[<EntryPoint>]
let main _ =
    let app = App(null)
    MyStack(app, "hello-cdk-1", StackProps()) |> ignore
    MyStack(app, "hello-cdk-2", StackProps()) |> ignore
    app.Synth() |> ignore
    0
