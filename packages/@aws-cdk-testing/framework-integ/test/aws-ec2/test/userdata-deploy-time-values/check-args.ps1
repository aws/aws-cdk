# The author wrote: -Marker <deploy-time value> -Flag -q "<deploy-time value>"
# Each deploy-time value is passed as one argument, on its own or inside the
# author's quotes. Nothing in them runs, so the file receives plain text.
if ($args.Count -ne 5) { throw "expected 5 arguments, got $($args.Count): $args" }
if ($args[0] -cne '-Marker' -or $args[2] -cne '-Flag' -or $args[3] -cne '-q') { throw "unexpected arguments: $args" }
if ($args[1] -cne "C:/cdk data '; New-Item -Name cdk-injected -Path ~; '") { throw "unexpected value: [$($args[1])]" }
if ($args[4] -cne 'a b') { throw "unexpected quoted value: [$($args[4])]" }
if (Test-Path -LiteralPath (Join-Path $HOME 'cdk-injected')) { throw 'a deploy-time value ran as a command' }
Write-Output 'deploy-time values arrived as plain text'
