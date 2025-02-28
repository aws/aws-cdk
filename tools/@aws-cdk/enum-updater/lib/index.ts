import { entryMethod } from './enum-updater';
import { MissingEnumsUpdater } from './missing-enum-updater';

export function main() {
    entryMethod();
}

export function updateMissingEnums() {
    const dir = '../../../../packages/'
  
    new MissingEnumsUpdater(dir).execute();
}