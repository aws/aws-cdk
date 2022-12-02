"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const generatable_1 = require("./generatable");
const diagnostic_1 = require("./diagnostic");
const cm2_1 = require("./cm2");
function generate(...xs) {
    (async () => {
        const exportFile = new cm2_1.CM2(generatable_1.fileFor('index', 'public'));
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
            console.error(diagnostic_1.fmtDiagnostic(d));
        }
        if (errors.length > 0) {
            process.exitCode = 1;
        }
    })().catch(e => {
        console.error(e);
        process.exitCode = 1;
    });
}
exports.generate = generate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNEO0FBQ3RELDZDQUE2QztBQUM3QywrQkFBNEI7QUFFNUIsU0FBZ0IsUUFBUSxDQUFDLEdBQUcsRUFBa0I7SUFDNUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNWLE1BQU0sVUFBVSxHQUFHLElBQUksU0FBRyxDQUFDLHFCQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFdkQsS0FBSyxNQUFNLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUU7WUFDckQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRVosSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDcEQsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN4RztTQUNGO1FBRUQsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWxCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQztRQUN4RCxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRTtZQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBNUJELDRCQTRCQyJ9