#!/bin/bash
# This script is configured in cdk.json to be used to
# execute the CDK .NET app by the command-line toolkit.
# The first argument will be used as argv[0]
exec dotnet run src/HelloCdk/bin/Release/HelloCdk $@
