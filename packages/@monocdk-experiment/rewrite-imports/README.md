# @monocdk-experiment/rewrite-imports

A hacky tool to mass rewrite a bunch of TS files from the old style imports
to the new style imports.

Don't expect this to be perfect, or even good. Have your trusty pal git available
to roll back if you need to!

```
npx tsc
node /path/to/cdk-rewrite-mono-imports/index lib/*.ts
```
