open Amazon.CDK
open %name.PascalCased%Stack

[<EntryPoint>]
let main _ =
    let app = App(null)
    %name.PascalCased%Stack(app, "%name%", StackProps()) |> ignore
    app.Synth() |> ignore
    0
