import { IGeneratable, fileFor } from './generatable';
import { fmtDiagnostic } from './diagnostic';
import { CM2 } from './cm2';

export function generate(...xs: IGeneratable[]) {
  (async () => {
    const exportFile = new CM2(fileFor('index', 'public'));

    for (const file of xs.flatMap(x => x.generateFiles())) {
      file.save();

      if (!file.currentModule.fileName.includes('private')) {
        exportFile.line('export * from \'', exportFile.relativeImportName(file.currentModule.fileName), '\';');
      }
    }

    exportFile.save();

    const diags = xs.flatMap(x => x.diagnostics());
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