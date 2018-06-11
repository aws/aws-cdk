import { green } from 'colors/safe';
import * as fs from 'fs-extra';
import * as path from 'path';
import CodeGenerator from './codegen';
import * as genspec from './genspec';
import { coalesceByModule } from './merge-specs';

const templateDir = path.join(__dirname, '../module-template');

export default async function(specFiles: string[], enrichmentsDir?: string) {
    const enrichments = await readFiles(enrichmentsDir, '.ts');

    const specByModule = await coalesceByModule(specFiles);

    const outPath = '.';
    const pathPrefix = 'cfn';

    const indexPath = path.join(outPath, 'lib', 'index.ts');
    const jsonPath = path.join(outPath, 'spec');

    await fs.mkdirp(path.dirname(indexPath));
    await fs.mkdirp(jsonPath);
    await fs.copy(templateDir, outPath, { recursive: true });
    const indexFile = fs.createWriteStream(indexPath);
    indexFile.write('export { PropertySpecification, ResourceClass, resourceImplementationFor } from \'./registry\';\n\n');

    for (const mod of Object.keys(specByModule).sort()) {
        const spec = specByModule[mod];
        const baseName = genspec.packageName(mod);
        const generator = new CodeGenerator(baseName, enrichments, pathPrefix);

        generator.addSpec(spec);
        generator.emitResourceTypes();
        generator.emitPropertyTypes();

        // tslint:disable:no-console
        console.log('saving %s...', green(path.join(outPath, generator.outputFile)));
        // tslint:enable:no-console
        await generator.save(outPath);
        indexFile.write(`export * from './${pathPrefix}/${baseName}';\n`);
    }
    await indexFile.close();
}

/**
 * Reads all typescript files from `dir` and returns a map that maps the
 * base name of the file to it's contents.
 */
async function readFiles(dir: string | undefined, ext: string) {
    if (!dir) {
        return { };
    }
    const result: { [basename: string]: string } = {};
    const files = await fs.readdir(dir);
    for (const file of files) {
        if (path.extname(file) !== ext) {
            continue;
        }
        const type = path.basename(file, ext);
        const body = (await fs.readFile(path.join(dir, file))).toString();
        result[type] = body;
    }
    return result;
}
