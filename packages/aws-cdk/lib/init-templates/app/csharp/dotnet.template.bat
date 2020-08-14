@echo off

rem   lets dotnet operate on the Visual Studio project from the CDK app's main directory
rem   without explicitly having to specify the path to the .csproj file

cd "src\%name.PascalCased%"     &   rem change to the directory containing .csproj
dotnet.exe %*                   &   rem execute dotnet command from there
cd "%~dp0"                      &   rem change back to this batch file's directory
