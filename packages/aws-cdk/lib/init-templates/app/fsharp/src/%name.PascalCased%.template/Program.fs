open Amazon.CDK
open %name.PascalCased%

[<EntryPoint>]
let main _ =
    let app = App(null)

    %name.PascalCased%Stack(app, "hello-cdk-1") |> ignore

    app.Synth() |> ignore
    0
