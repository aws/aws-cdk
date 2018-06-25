import { blue, green } from 'colors/safe';
import * as process from 'process';
import { print } from '../../lib/logging';
import { VERSION } from '../../lib/version';

export const command = 'doctor';
export const describe = 'Check your set-up for potential problems';
export const builder = {};

export async function handler(): Promise<never> {
    let exitStatus: number = 0;
    for (const verification of verifications) {
        if (!await verification()) {
            exitStatus = -1;
        }
    }
    return process.exit(exitStatus);
}

const verifications: Array<() => boolean | Promise<boolean>> = [
    displayVersionInformation,
    displayAwsEnvironmentVariables,
    checkDocumentationIsAvailable
];

// ### Verifications ###

function displayVersionInformation() {
    print(`ℹ️ CDK Version: ${green(VERSION)}`);
    return true;
}

function displayAwsEnvironmentVariables() {
    const keys = Object.keys(process.env).filter(s => s.startsWith('AWS_'));
    if (keys.length === 0) {
        print('ℹ️ No AWS environment variables');
        return true;
    }
    print('ℹ️ AWS environment variables:');
    for (const key of keys) {
        print(`  - ${blue(key)} = ${green(process.env[key]!)}`);
    }
    return true;
}

function checkDocumentationIsAvailable() {
    try {
        const version = require('aws-cdk-docs/package.json').version;
        print(`✅ AWS CDK Documentation: ${version}`);
        return true;
    } catch (e) {
        print(`❌ AWS CDK Documentation: install using ${green('y-npm install --global aws-cdk-docs')}`);
        return false;
    }
}
