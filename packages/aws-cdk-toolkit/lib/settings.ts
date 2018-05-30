import { deepClone, deepGet, deepMerge, deepSet } from 'aws-cdk-util';
import * as fs from 'fs-extra';
import * as os from 'os';

type SettingsMap = {[key: string]: any};

export class Settings {
    public static mergeAll(...settings: Settings[]): Settings {
        let ret = new Settings();
        for (const setting of settings) {
            ret = ret.merge(setting);
        }
        return ret;
    }

    public settings: SettingsMap = {};

    constructor(settings?: SettingsMap) {
        this.settings = settings || {};
    }

    public load(fileName: string) {
        this.settings = {};

        const expanded = expandHomeDir(fileName);
        if (fs.existsSync(expanded)) {
            this.settings = JSON.parse(fs.readFileSync(expanded, { encoding: 'utf-8' }));
        }

        return this;
    }

    public save(fileName: string) {
        const expanded = expandHomeDir(fileName);
        fs.writeFileSync(expanded, JSON.stringify(this.settings, undefined, 2), { encoding: 'utf-8' });

        return this;
    }

    public merge(other: Settings): Settings {
        return new Settings(deepMerge(this.settings, other.settings));
    }

    public empty(): boolean {
        return Object.keys(this.settings).length === 0;
    }

    public get(path: string[]): any {
        return deepClone(deepGet(this.settings, path));
    }

    public set(path: string[], value: any): Settings {
        deepSet(this.settings, path, value);
        return this;
    }
}

function expandHomeDir(x: string) {
    if (x.startsWith('~')) {
        return os.homedir + '/' + x.substr(1);
    }
    return x;
}
