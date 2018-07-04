# CDK Java Example

This an example of a CDK program written in Java.

> NOTE: Since this example currently resides inside the CDK repository, it takes
  a dependency on the CDK for Java maven package that's built under
  `packages/aws-cdk-java`. To enable this, we generate the `pom.xml` file, so we
  can plug in the locations of the local maven repositories. This is not
  something you will need to do if you are simply using the published CDK maven
  package.

## Building

To build this app, run `npm run build`. This will:

1. Generate `project/pom.xml` with correct references to jsii and CDK
   dependencies.
2. Run `mvn package`, which will compile, test and assemble an executable jar.

## IDE

Once the `pom.xml` file is generated, the [`./project`](./project) directory is
fully functional Maven project, and you should be able to open it from any Java
IDE which supports Maven.

You can use the IDE to write code and unit tests, but you will need to use the
CDK toolkit if you wish to synthesize/deploy stacks.

## CDK Toolkit

The [`cdk.json`](./cdk.json) file in the root of this repository includes
instructions for the CDK toolkit on how to execute this program. Specifically,
it will use `java -jar <executale-jar> app` for the `--app` switch. This means,
you should be able to use the toolkit normally:

```
$ cdk ls
<list all stacks in this program>

$ cdk synth
<cloudformation template>

$ cdk deploy
<deploy stack to your account>

$ cdk diff
<diff against deployed stack>
```

If you make modifications, make sure to rebuild the app, either by callign `mvn
package` from `./project` or `npm run build` from the root.
