# cfn-to-ts
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


Generates TypeScript classes for all CloudFormation resource and property types.

Usage:

```shell
$ cfn-to-ts <typescript-output-path> [enrichments-dir]
```

The CloudFormation spec is built-into this package (at the moment).

The command will read the CloudFormation Spec and will create a single .ts file that contains types for all resources and property types.

If `enrichments-dir` is specified, the tool will look for `.ts` files under that directory named after CloudFormation full type names. If it founds, those types will be generated with a `XxxBase` postfix, and the code inside the enrichments directory will be included in the generated output. This allows "extending" CloudFormation types with additional capabilities.

The library exports the following API:

```ts
async function(outputFilePath: string, enrichmentsDir?: string)
```

For example:

```js
import generate from 'aws-cfn-to-ts'
generate('cfn.ts', 'enrichments/').then(() => console.log('done'));
```


