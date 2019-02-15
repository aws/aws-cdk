# Documentation site generator

## What happens

The following happens to generate these docs:

- **Build JavaDoc site**: running `javadoc` over the Java artifacts.
- **Build TypeScript site**: running `api-extractor` over the NPM packages,
  then `api-documenter` to turn that API model into a set of YAML files,
  then we run `DocFx` to turn those YAML files into documentation.
- **Build .NET site**: running DocFx over the sources that we extract
  from the NuPkgs, then using that to generate a site.
- **Build CDK site**: run our own generator to generate CDK-specific
  documentation for all packages, add in links to the language-specific
  docs, then use docusaurus to turn this into an HTML site.

## File organization

```
.
├── build.sh               Main build script
├── docfx                  Tools for running DocFx
├── docusaurus             Docsaurus source AND build directory
├── dotnet                 .NET related build scripts
├── gen-cdk-reference      TypeScript project to generate Docusaurus source
├── java                   Script to build JavaDocs
└── typescript             Scripts to build TS docs
```

## Running it

To run the generator:

```
./build.sh
```

To preview the result/hack on the docs:

```
cd docusaurus/website
npm install
npm run start --watch
```
