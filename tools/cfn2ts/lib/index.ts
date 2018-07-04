import { filteredSpecification } from '@aws-cdk/cloudformation-resource-spec';
import { green } from 'colors/safe';
import * as fs from 'fs-extra';
import * as path from 'path';
import CodeGenerator from './codegen';
import { packageName } from './genspec';

export default async function(scope: string, outPath: string, force: boolean) {
    if (outPath !== '.') { await fs.mkdirp(outPath); }

    const spec = filteredSpecification(s => s.startsWith(`${scope}::`));
    if (Object.keys(spec.ResourceTypes).length === 0) {
        throw new Error(`No resource was found for scope ${scope}`);
    }
    const name = packageName(scope);

    const generator = new CodeGenerator(name, spec);

    if (force || !await generator.upToDate(outPath)) {
        generator.emitResourceTypes();
        generator.emitPropertyTypes();

        // tslint:disable-next-line:no-console
        console.log('Generated code: %s', green(path.join(outPath, generator.outputFile)));
        await generator.save(outPath);
    } else {
        // tslint:disable-next-line:no-console
        console.log('Generated code already up-to-date: %s', green(path.join(outPath, generator.outputFile)));
    }
}
