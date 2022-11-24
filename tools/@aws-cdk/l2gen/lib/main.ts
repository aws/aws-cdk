import { IGeneratable } from './generatable';
import { fmtDiagnostic } from './diagnostic';

export function generate(...xs: IGeneratable[]) {
  (async () => {
    for (const file of xs.flatMap(x => x.generateFiles())) {
      file.save();
    }

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