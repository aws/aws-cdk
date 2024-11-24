import {Node, Project, SourceFile, ts} from 'ts-morph';
import SyntaxKind = ts.SyntaxKind;

export class RuntimeIntegrationTestUpdater {
  private readonly project: Project;
  private readonly runtimesPerFamily: {[key: string]: string[]};
  private readonly integTestConfigs: {[key:string]: string};

  constructor(integTestFiles: {[key:string]: string} , runtimeSourceFilePath = __dirname + '../../../../../packages/aws-cdk-lib/aws-lambda/lib/runtime.ts') {
    this.integTestConfigs = integTestFiles;
    this.project = new Project();
    const runtimeSourceFile =  this.project.addSourceFileAtPath(runtimeSourceFilePath);
    this.runtimesPerFamily = this.getRuntimes(runtimeSourceFile);
  }

  public async execute(): Promise<void> {
    for (const [runtimeFamily, integTestFile] of Object.entries(this.integTestConfigs)) {
      const integSourceFile = this.project.addSourceFileAtPath(integTestFile);
      await this.updateRuntimesList(integSourceFile, this.runtimesPerFamily[runtimeFamily] || []);
      integSourceFile.saveSync();
    }
  }

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

  private async updateRuntimesList(sourceFile: SourceFile, runtimes: string[]): Promise<void> {
    sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(varDecl => {
      if (varDecl.getName() === 'runtimes') {
        const initializer = varDecl.getInitializer();
        if (initializer && Node.isArrayLiteralExpression(initializer)) {
          runtimes = runtimes.map(runtime => `Runtime.${runtime}`);
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