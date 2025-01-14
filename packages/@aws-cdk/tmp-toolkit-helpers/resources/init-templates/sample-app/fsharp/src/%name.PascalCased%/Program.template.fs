open Amazon.CDK
open %name.PascalCased%

[<EntryPoint>]
let main _ =
    let app = App(null)

    %name.PascalCased%Stack(app, "%stackname%", StackProps()) |> ignore

    app.Synth() |> ignore
    0
