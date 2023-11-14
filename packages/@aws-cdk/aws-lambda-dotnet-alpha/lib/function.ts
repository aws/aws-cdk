import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { BundlingOptions } from './types';
import { findUp, getLambdaToolsDefaults } from './util';

/**
 * Properties for a .NET Function
 */
export interface DotNetFunctionProps extends lambda.FunctionOptions {
  /**
   * The runtime environment. Only runtimes of the .NET family and provided family are supported.
   *
   * @default lambda.Runtime.DOTNET_6
   */
  readonly runtime?: lambda.Runtime;

  /**
   * Directory containing your .csproj file
   */
  readonly projectDir: string;

  /**
   * Directory containing your .sln file
   *
   * This will be used as the source of the volume mounted in the Docker
   * container and will be the directory where it will run `dotnet build` from.
   *
   * @default - the path is found by walking up parent directories searching for
   * a `.sln` file from the location of `projectDir`. If no `.sln` file is found,
   * the `projectDir` will be used.
   */
  readonly solutionDir?: string;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   * The format includes the file name. It can also include namespaces and other qualifiers,
   * depending on the runtime. For more information,
   * see https://docs.aws.amazon.com/lambda/latest/dg/foundation-progmodel.html.
   *
   * @default - the .csproj file is used as project name and the handler is set to the project name
   * or the handler is found reading the aws-lambda-tools-defaults.json file in the project directory.
   */
  readonly handler?: string;

  /**
   * Bundling options
   *
   * @default - use default bundling options
   */
  readonly bundling?: BundlingOptions;
}

/**
 * A .NET Lambda function
 */
export class DotNetFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props: DotNetFunctionProps) {
    if (props.runtime && (props.runtime.family !== lambda.RuntimeFamily.DOTNET_CORE && props.runtime.family != lambda.RuntimeFamily.OTHER)) {
      throw new Error('Only `.NET` and `provided` runtimes are supported.');
    }
    const { projectDir } = props;

    const lambdaToolsDefaults = getLambdaToolsDefaults(projectDir);

    const runtime = props.runtime ?? (lambdaToolsDefaults && lambdaToolsDefaults['function-runtime'] ? new lambda.Runtime(lambdaToolsDefaults['function-runtime']) : lambda.Runtime.DOTNET_6);
    const architecture = props.architecture ?? (lambdaToolsDefaults ? lambdaToolsDefaults['function-architecture'] : lambda.Architecture.X86_64);

    let solutionDir: string;
    if (props.solutionDir) {
      solutionDir = props.solutionDir;
      const parsedSolutionDir = path.parse(props.solutionDir);
      if (parsedSolutionDir.ext && parsedSolutionDir.ext === '.sln') {
        if (!fs.existsSync(props.solutionDir)) {
          throw new Error(`Solutions file at ${props.solutionDir} doesn't exist`);
        }
      } else if (parsedSolutionDir.ext && parsedSolutionDir.ext === '.sln') {
        throw new Error('solutionDir is specifying a file that is a solutions file (.sln)');
      } else if (!fs.readdirSync(solutionDir).find((file) => file.endsWith('.sln'))) {
        throw new Error(`Solution file (.sln) at ${props.solutionDir} doesn't exist`);
      }
    } else {
      const solutionFile = findUp('.sln', projectDir);
      solutionDir = path.resolve(solutionFile ? path.dirname(solutionFile) : projectDir);
    }

    // Resolve handler based on project name
    let handler: string;
    if (props.handler) {
      handler = props.handler;
    } if (lambdaToolsDefaults && lambdaToolsDefaults['function-handler']) {
      handler = lambdaToolsDefaults['function-handler'];
    } else {
      const projectFile = fs.readdirSync(projectDir).find((file) => file.endsWith('.csproj'));
      if (!projectFile) {
        throw new Error(`.csproj file at ${props.projectDir} doesn't exist`);
      }
      const projectName = projectFile.replace('.csproj', '');
      handler = projectName;
    }

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...props.bundling ?? {},
        runtime,
        architecture,
        projectDir,
        solutionDir,
      }),
      handler,
    });
  }
}