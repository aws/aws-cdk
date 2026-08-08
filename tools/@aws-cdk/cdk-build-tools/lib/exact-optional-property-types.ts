import * as path from 'path';
import * as ts from 'typescript';

/**
 * Compiler options for an `exactOptionalPropertyTypes` assignability check rooted
 * at `testDir`. Mirrors the package's own tsconfig but turns the flag on and
 * neutralises the `composite` settings so a single virtual file can be checked
 * against the in-repo source (otherwise the program rejects the un-listed source
 * files with TS6307 instead of type-checking).
 */
function exactOptionalOptions(testDir: string): ts.CompilerOptions {
  const tsconfigPath = ts.findConfigFile(testDir, ts.sys.fileExists.bind(ts.sys));
  if (!tsconfigPath) {
    throw new Error(`could not locate a tsconfig.json above ${testDir}`);
  }
  const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile.bind(ts.sys));
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(tsconfigPath));
  return {
    ...parsed.options,
    exactOptionalPropertyTypes: true,
    skipLibCheck: true,
    noEmit: true,
    composite: false,
    incremental: false,
    declaration: false,
    declarationMap: false,
    tsBuildInfoFile: undefined,
  };
}

/** The `<pkg>/lib` directory that a source file under `<pkg>/lib/...` belongs to. */
function libDirOf(fileName: string): string | undefined {
  const marker = `${path.sep}lib${path.sep}`;
  const idx = fileName.lastIndexOf(marker);
  return idx === -1 ? undefined : fileName.slice(0, idx) + path.sep + 'lib';
}

interface InterfaceRef {
  readonly name: string;
  readonly libDir: string;
}

/**
 * Collect every interface a class implements — from its own `implements` clause
 * and, recursively, every ancestor class's `implements`. Interface and base-class
 * symbols are resolved through aliases (an imported `implements ISomething`
 * otherwise yields no declaration), which is essential to catch members the class
 * inherits via an abstract base.
 */
function collectImplementedInterfaces(
  checker: ts.TypeChecker,
  classDecl: ts.ClassDeclaration,
  acc: InterfaceRef[],
  seen: Set<string>,
): void {
  for (const clause of classDecl.heritageClauses ?? []) {
    if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
      for (const t of clause.types) {
        // The type's symbol is the resolved interface (not an import alias).
        const isym = checker.getTypeAtLocation(t.expression).symbol;
        const decl = isym?.getDeclarations()?.find(ts.isInterfaceDeclaration);
        if (!decl) continue;
        const libDir = libDirOf(decl.getSourceFile().fileName);
        if (!libDir) continue;
        const key = `${decl.name.text}@${libDir}`;
        if (seen.has(key)) continue;
        seen.add(key);
        acc.push({ name: decl.name.text, libDir });
      }
    } else if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
      for (const t of clause.types) {
        // The type's symbol is the resolved base class (not an import alias).
        const baseSym = checker.getTypeAtLocation(t.expression).symbol;
        for (const d of baseSym?.getDeclarations() ?? []) {
          if (ts.isClassDeclaration(d)) collectImplementedInterfaces(checker, d, acc, seen);
        }
      }
    }
  }
}

/**
 * Assert that every exported, non-abstract class in a package is assignable to
 * each interface it implements (its own and inherited) under
 * `exactOptionalPropertyTypes`, returning a diagnostic line per offending pair.
 *
 * Shared harness for the per-package assignability guards tracked by
 * https://github.com/aws/aws-cdk/issues/37996. `aws-cdk-lib` does not build with
 * the flag, so a class member typed `T | undefined` that is not assignable to an
 * interface's optional `?: T` slips past the library's own compile and only
 * breaks downstream consumers who enable the flag. A normal `const x: IFoo = foo`
 * assertion can't catch this (the lib test build has the flag off); this compiles
 * the assignments with the flag explicitly on.
 *
 * Enumerating the package's classes — rather than listing them by hand — keeps the
 * guard complete by construction: a newly-added class (or a new optional getter on
 * an existing one) whose concrete member is typed `T | undefined` against an
 * optional `?: T` is caught with no list to maintain.
 *
 * Pass the calling test's directory (`__dirname`); the package barrel is located
 * by walking up to the nearest `lib/index.ts`. A clean package returns `[]`.
 */
export function exactOptionalAssignabilityDiagnosticsForPackage(testDir: string): string[] {
  let pkgRoot = testDir;
  while (pkgRoot !== path.dirname(pkgRoot) && !ts.sys.fileExists(path.join(pkgRoot, 'lib', 'index.ts'))) {
    pkgRoot = path.dirname(pkgRoot);
  }
  const barrelPath = path.join(pkgRoot, 'lib', 'index.ts');
  if (!ts.sys.fileExists(barrelPath)) {
    throw new Error(`could not locate a lib/index.ts above ${testDir}`);
  }

  const options = exactOptionalOptions(testDir);

  // Pass 1: enumerate exported, non-abstract class declarations in the package's
  // `lib` source files. Importing each from the barrel below naturally drops any
  // class that the barrel does not re-export (i.e. is not part of the public API).
  const enumProgram = ts.createProgram([barrelPath], options);
  const checker = enumProgram.getTypeChecker();
  const libPrefix = path.join(pkgRoot, 'lib') + path.sep;

  interface Pair { readonly cls: string; readonly iface: string; readonly ifaceLibDir: string }
  const pairs: Pair[] = [];
  const hasModifier = (node: ts.ClassDeclaration, kind: ts.SyntaxKind) =>
    ts.getModifiers(node)?.some((m) => m.kind === kind) ?? false;

  for (const sf of enumProgram.getSourceFiles()) {
    if (!sf.fileName.startsWith(libPrefix)) continue;
    if (/\.generated\.ts$|\.d\.ts$/.test(sf.fileName)) continue;
    ts.forEachChild(sf, (node) => {
      if (!ts.isClassDeclaration(node) || !node.name) return;
      if (!hasModifier(node, ts.SyntaxKind.ExportKeyword)) return;
      if (hasModifier(node, ts.SyntaxKind.AbstractKeyword)) return;
      const ifaces: InterfaceRef[] = [];
      collectImplementedInterfaces(checker, node, ifaces, new Set());
      for (const iface of ifaces) {
        pairs.push({ cls: node.name.text, iface: iface.name, ifaceLibDir: iface.libDir });
      }
    });
  }
  if (pairs.length === 0) return [];

  // Pass 2: one assignment per pair, compiled as a virtual file in `testDir`.
  // Classes always come from the package barrel; interfaces from their own `lib`
  // (which may be a different package). The wider source graph emits many
  // unrelated diagnostics; only those anchored to the assignments are returned.
  const rel = (toDir: string) => {
    const r = path.relative(testDir, toDir).split(path.sep).join('/');
    return r.startsWith('.') ? r : `./${r}`;
  };
  const classBarrel = rel(path.join(pkgRoot, 'lib'));
  let snippet = '';
  pairs.forEach((p, i) => {
    snippet += `import { ${p.cls} as C${i} } from '${classBarrel}';\n`;
    snippet += `import { ${p.iface} as I${i} } from '${rel(p.ifaceLibDir)}';\n`;
  });
  pairs.forEach((_, i) => {
    snippet += `declare const v${i}: C${i}; const a${i}: I${i} = v${i}; void a${i};\n`;
  });

  const snippetPath = path.join(testDir, '__exact-optional-snippet__.ts');
  const resolvedSnippetPath = path.resolve(snippetPath);
  const isSnippet = (fileName: string) => path.resolve(fileName) === resolvedSnippetPath;

  const host = ts.createCompilerHost(options, true);
  const baseGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, langVersion, onError, shouldCreate) =>
    isSnippet(fileName)
      ? ts.createSourceFile(fileName, snippet, langVersion, true)
      : baseGetSourceFile(fileName, langVersion, onError, shouldCreate);

  const program = ts.createProgram([snippetPath], options, host);
  const snippetSource = program.getSourceFile(snippetPath);

  // Assignments occupy the lines after the imports; map a diagnostic back to its pair.
  const importLineCount = pairs.length * 2;
  const results: string[] = [];
  for (const d of ts.getPreEmitDiagnostics(program, snippetSource)) {
    if (!d.file || !isSnippet(d.file.fileName) || d.start === undefined) continue;
    const { line } = d.file.getLineAndCharacterOfPosition(d.start);
    const idx = line - importLineCount;
    if (idx < 0 || idx >= pairs.length) continue; // ignore import-resolution noise
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    const props = [...message.matchAll(/Types of property '([^']+)' are incompatible/g)].map((m) => m[1]);
    results.push(`${pairs[idx].cls} -> ${pairs[idx].iface}: TS${d.code}${props.length ? ` [${props.join(', ')}]` : ''}`);
  }
  return [...new Set(results)];
}
