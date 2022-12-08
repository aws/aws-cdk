import { IGeneratable, fileFor } from './generatable';
import { fmtDiagnostic } from './diagnostic';
import { CM2 } from './cm2';
import { SchemaParser } from './schema-parser';
import { printHint } from './private/hints/print-hint';
import { enumHint } from './private/hints/enum-hints';

export class GenerationRoot {
  private readonly generatables = new Set<IGeneratable>();
  private readonly skipRefs = new Array<string>();

  public generateHintsFrom(parser: SchemaParser) {
    const coveredRefs = new Set([
      ...Array.from(this.generatables).flatMap(x => x.schemaRefs ?? []),
      ...this.skipRefs,
    ]);

    for (const enumDef of parser.findEnums()) {
      if (coveredRefs.has(enumDef.schemaLocation)) { continue; }
        printHint(enumHint(enumDef));
    }
  }

  public skip(skipRef: string) {
    this.skipRefs.push(skipRef);
  }

  public add<A extends IGeneratable>(x: A): A {
    this.generatables.add(x);
    return x;
  }

  public generate() {
    (async () => {
      const exportFile = new CM2(fileFor('index', 'public'));

      for (const file of Array.from(this.generatables).flatMap(x => x.generateFiles())) {
        file.save();

        if (!file.currentModule.fileName.includes('private')) {
          exportFile.line('export * from \'', exportFile.relativeImportName(file.currentModule.fileName), '\';');
        }
      }

      exportFile.save();

      const diags = Array.from(this.generatables).flatMap(x => x.diagnostics());
      const errors = diags.filter(d => d.cat === 'error');
      const warnings = diags.filter(d => d.cat === 'warning');
      for (const d of [...errors, ...warnings]) {
        console.error(fmtDiagnostic(d));
      }

      if (errors.length > 0) {
        process.exitCode = 1;
      }
    })().catch(e => {
      console.error(e);
      process.exitCode = 1;
    });
  }
}