import {Node, Project, SourceFile, ts} from 'ts-morph';
import SyntaxKind = ts.SyntaxKind;

/**
 * RuntimeIntegrationTestUpdater is responsible for updating Lambda runtime integration tests
 * by analyzing and extracting runtime information from the AWS CDK Lambda runtime source file
 * and updating corresponding integration test files.
 *
 * The class identifies non-deprecated runtimes for each runtime family and updates integration
 * test files to ensure they include all current supported runtimes.
 */
export class RuntimeIntegrationTestUpdater {
  private readonly project: Project;
  private readonly runtimesPerFamily: {[key: string]: string[]};
  private readonly integTestConfigs: {[key:string]: string};

  /**
   * Creates a new instance of RuntimeIntegrationTestUpdater.
   *
   * @param integTestFiles - An object mapping runtime families to their integration test file paths
   * @param runtimeSourceFilePath - Path to the Lambda runtime source file (defaults to aws-lambda/lib/runtime.ts)
   */
  constructor(integTestFiles: {[key:string]: string} , runtimeSourceFilePath = __dirname + '../../../../../packages/aws-cdk-lib/aws-lambda/lib/runtime.ts') {
    this.integTestConfigs = integTestFiles;
    this.project = new Project();
    const runtimeSourceFile =  this.project.addSourceFileAtPath(runtimeSourceFilePath);
    this.runtimesPerFamily = this.getRuntimes(runtimeSourceFile);
  }

  /**
   * Executes the update process for all configured integration test files.
   * For each runtime family, this method:
   * 1. Loads the corresponding integration test file
   * 2. Updates the runtimes list in the test file
   * 3. Saves the changes back to disk
   */
  public async execute(): Promise<void> {
    for (const [runtimeFamily, integTestFile] of Object.entries(this.integTestConfigs)) {
      const integSourceFile = this.project.addSourceFileAtPath(integTestFile);
      await this.updateRuntimesList(integSourceFile, this.runtimesPerFamily[runtimeFamily] || []);
      integSourceFile.saveSync();
    }
  }

  /**
   * Analyzes the runtime source file to extract non-deprecated runtimes for each runtime family.
   *
   * This method:
   * 1. Looks for Runtime class instantiations
   * 2. Extracts the runtime family and name
   * 3. Checks if the runtime is deprecated (via JSDoc tags)
   * 4. Groups non-deprecated runtimes by family
   *
   * @param sourceFile - The parsed Runtime.ts source file
   * @returns An object mapping runtime families to arrays of runtime names
   */
  private getRuntimes(sourceFile: SourceFile): {[key: string]: string[]} {
    const deprecatedRuntimesPerFamily: {[key: string]: string[]} = {};

    sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression).forEach(newExpr => {
      const className = newExpr.getExpression().getText();
      const propertyDeclaration = newExpr.getParentIfKind(SyntaxKind.PropertyDeclaration);

      if (className === 'Runtime' && propertyDeclaration &&
          propertyDeclaration.getParent() && propertyDeclaration.getParent()?.isKind(SyntaxKind.ClassDeclaration) &&
          propertyDeclaration.getParent()?.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === 'Runtime'
      ) {
        const args = newExpr.getArguments();
        if (args.length >= 2) {
          const family = args[1].getChildrenOfKind(SyntaxKind.Identifier)[1].getFullText();
          if(family){
            const jsDoc = propertyDeclaration.getJsDocs()[0];
            if (!jsDoc?.getTags().some(tag => tag.getTagName() === 'deprecated')) {
              const runtimeName = propertyDeclaration.getName();
              if (runtimeName) {
                const deprecatedRuntimes = deprecatedRuntimesPerFamily[family];
                if (deprecatedRuntimes) {
                  deprecatedRuntimes.push(runtimeName);
                } else {
                  deprecatedRuntimesPerFamily[family] = [runtimeName];
                }
              }
            }
          }
        }
      }
    });

    return deprecatedRuntimesPerFamily;
  }

  /**
   * Updates the runtimes list in a given integration test file.
   *
   * This method processes the source file to locate and update variable declarations
   * that contain lists of runtimes for integration testing.
   *
   * @param sourceFile - The integration test source file to update
   * @param runtimes - Array of runtime names to include in the test
   */
  private async updateRuntimesList(sourceFile: SourceFile, runtimes: string[]): Promise<void> {
    sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(varDecl => {
      if (varDecl.getName() === 'runtimes') {
        const initializer = varDecl.getInitializer();
        if (initializer && Node.isArrayLiteralExpression(initializer)) {
          runtimes = runtimes.map(runtime => `Runtime.${runtime}`);

          // Format runtimes array into groups of 6 per line to keep lines under max length and to follow linter rules
          const formattedDeprecatedRuntimes = [];
          for (let i = 0; i < runtimes.length; i += 6) {
            formattedDeprecatedRuntimes.push(`  ${runtimes.slice(i, i + 6).join(', ')}`);
          }
          if(formattedDeprecatedRuntimes.length > 0){
            initializer.replaceWithText(`[\n${formattedDeprecatedRuntimes.join(',\n')},\n]`);
          }else{
            initializer.replaceWithText('[]');
          }
        }
      }
    });
  }
}