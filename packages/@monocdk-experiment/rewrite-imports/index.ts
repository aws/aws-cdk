import * as ts from "typescript";
import * as fs from 'fs';

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let program = ts.createProgram(fileNames, options);

  program.getSourceFiles()
    .filter(file => !file.fileName.endsWith('.d.ts'))
    .forEach(file => {
      process.stdout.write(`${file.fileName}: `);
      const newSource = rewriteFile(file);

      if (newSource === file.text) {
        process.stdout.write('No change.\n');
        return;
      }

      fs.writeFileSync(file.fileName, newSource, { encoding: 'utf-8' });
      process.stdout.write('Done.\n');
    });
}

interface Span {
  readonly start: number,
  readonly end: number;
};

function findImports(nodes: ReadonlyArray<ts.Node>): Span {
  let start = 0;
  while (start < nodes.length && !isImportTypeNode(nodes[start])) {
    start++;
  }

  let end = start + 1;
  while (end < nodes.length && isImportTypeNode(nodes[end])) {
    end++;
  }

  return { start, end };
}

type ImportNode = ts.ImportEqualsDeclaration | ts.ImportDeclaration;

type ImportAnalysis = {
  readonly cdkSubModule: string;
} & ({
  readonly type: 'module';
  readonly moduleAlias: string;
} | {
  readonly type: 'symbols';
  readonly symbols: SymbolImport[];
});

type SymbolImport = {
  name: string;
  alias?: string;
};

interface CdkNamespaceImport {
  readonly ns: string;
  readonly alias?: string;
}

interface CdkSymbolImport {
  readonly symbolName: string;
  readonly symbolAlias?: string;
}

function isImportTypeNode(node: ts.Node): node is ImportNode {
  return ts.isImportEqualsDeclaration(node)
    || ts.isImportDeclaration(node);
}

function rewriteImports(nodes: ReadonlyArray<ImportNode>): [ts.Statement[], boolean] {
  const namespaces = new Array<CdkNamespaceImport>();
  const symbolsByNamespace: Record<string, CdkSymbolImport[]> = {};
  const otherImports = new Array<ImportNode>();

  for (const node of nodes) {
    const cdkImport = analyzeCdkImport(node);
    if (!cdkImport) {
      otherImports.push(node);
      continue;
    }

    const ns = transmogrify(cdkImport.cdkSubModule);

    switch (cdkImport.type) {
      case 'module':
        namespaces.push({
          ns,
          alias: cdkImport.moduleAlias,
        });
        break;
      case 'symbols':
        namespaces.push({ ns });
        for (const sym of cdkImport.symbols) {
          if (!(ns in symbolsByNamespace)) { symbolsByNamespace[ns] = []; }

          if (sym.alias) {
            console.error(`Watch out! Aliased symbol imports not supported: ${sym.alias}`);
          }

          symbolsByNamespace[ns].push({
            symbolName: sym.name,
            symbolAlias: sym.alias,
          });
        }
        break;
    }
  }

  const cdkImports = new Array<ts.Statement>();
  if (namespaces.length > 0) {
    cdkImports.push(ts.createImportDeclaration(
      /* decorators */ undefined,
      /* modifiers */ undefined,
      ts.createImportClause(
        /* name */ undefined,
        ts.createNamedImports(
          namespaces.map(nsImport => ts.createImportSpecifier(ts.createIdentifier(nsImport.ns), ts.createIdentifier(nsImport.alias ?? nsImport.ns))),
        )
      ),
      ts.createStringLiteral('monocdk-experiment')));
  }

  const cdkRebinds = new Array<ts.Statement>();
  for (const [nsName, symbols] of Object.entries(symbolsByNamespace)) {
    cdkRebinds.push(ts.createVariableStatement(
      [], [
        ts.createVariableDeclaration(
          ts.createObjectBindingPattern(symbols.map(sym => ts.createBindingElement(
            /* dotDotDotToken */ undefined,
            undefined,
            ts.createIdentifier(sym.symbolName),
            ))),
          /* type */ undefined,
          ts.createIdentifier(nsName)
        )
      ]));
  }

  const newStatements = [
    ...cdkImports,
    ...otherImports,
    ...cdkRebinds,
  ];

  return [newStatements, cdkImports.length + cdkRebinds.length > 0];
}

function analyzeCdkImport(node: ImportNode): ImportAnalysis | undefined {
  if (ts.isImportDeclaration(node)) {
    if (ts.isStringLiteral(node.moduleSpecifier)) {
      const cdkSubModule = extractCdkModuleName(node.moduleSpecifier.text);
      if (cdkSubModule === undefined) { return undefined; }

      if (node.importClause) {
        if (node.importClause.name) {
          return { cdkSubModule, type: 'module', moduleAlias: node.importClause.name.text };
        }
        if (node.importClause.namedBindings) {
          if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            return { cdkSubModule, type: 'module', moduleAlias: node.importClause.namedBindings.name.text };
          }
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            return {
              cdkSubModule,
              type: 'symbols',
              symbols: node.importClause.namedBindings.elements.map(el => ({
                name: el.name.text,
                alias: el.propertyName?.text,
              }))
            };
          }
        }
      }
    }
  }
  if (ts.isImportEqualsDeclaration(node)) {
    if (ts.isExternalModuleReference(node.moduleReference)) {
      if (ts.isStringLiteral(node.moduleReference.expression)) {
        const cdkSubModule = extractCdkModuleName(node.moduleReference.expression.text);
        if (cdkSubModule === undefined) { return undefined; }

        return { cdkSubModule, type: 'module', moduleAlias: node.name.text };
      }
    }
  }
  return undefined;
}

function transmogrify(submoduleName: string) {
  return submoduleName.replace(/[^a-zA-Z0-9]/g, '_');
}

function extractCdkModuleName(name: string) {
  if (!name.startsWith('@aws-cdk/')) { return undefined; }
  if (name === '@aws-cdk/assert') { return undefined; }
  return name.substring('@aws-cdk/'.length);
}

function rewriteFile(file: ts.SourceFile) {
  const statements = file.statements;
  const importSpan = findImports(statements);
  const imports = statements.slice(importSpan.start, importSpan.end);
  if (imports.length === 0) { return file.text; }

  const [rewrittenImports, didWork] = rewriteImports(imports as ImportNode[]);
  if (!didWork) { return file.text; }

  // Just render the imports again, we can't rerender the entire tree because
  // it will lose whitespace info.
  const newFile = ts.updateSourceFileNode(file, rewrittenImports);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, });
  const importText = printer.printFile(newFile);

  const originalSource = file.text;
  const source = (originalSource.substring(0, imports[0].getStart(file))
    + importText
    + originalSource.substring(imports[imports.length - 1].getEnd()));

  return source;
}

function printNode(node: ts.Node, indent = '') {
  const hint = firstLine(ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, ts.createSourceFile('test.ts', '', ts.ScriptTarget.Latest)));
  console.log(`${indent}${ts.SyntaxKind[node.kind]} "${hint}"`);

  node.forEachChild(child => printNode(child, indent + '  '));
}

function firstLine(s: string) {
  return s.split('\n')[0];
}

compile(process.argv.slice(2), {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});