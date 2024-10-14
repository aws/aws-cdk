import * as chalk from 'chalk';
import { print } from '../../logging';
import { S3Asset } from './garbage-collector';

export class ProgressPrinter {
  private totalObjects: number;
  private objectsScanned: number;
  private taggedObjects: number;
  private taggedObjectsSizeMb: number;
  private deletedObjects: number;
  private deletedObjectsSizeMb: number;
  private interval: number;
  private setInterval?: NodeJS.Timer;

  constructor(totalObjects: number, interval?: number) {
    this.totalObjects = totalObjects;
    this.objectsScanned = 0;
    this.taggedObjects = 0;
    this.taggedObjectsSizeMb = 0;
    this.deletedObjects = 0;
    this.deletedObjectsSizeMb = 0;
    this.interval = interval ?? 10_000;
  }

  public reportScannedObjects(amt: number) {
    this.objectsScanned += amt;
  }

  public reportTaggedObjects(objects: S3Asset[]) {
    this.taggedObjects += objects.length;
    const sizeInBytes = objects.reduce((total, asset) => total + asset.size, 0);
    this.taggedObjectsSizeMb += sizeInBytes / 1_048_576;
  }

  public reportDeletedObjects(objects: S3Asset[]) {
    this.deletedObjects += objects.length;
    const sizeInBytes = objects.reduce((total, asset) => total + asset.size, 0);
    this.deletedObjectsSizeMb += sizeInBytes / 1_048_576;
  }

  public start() {
    this.setInterval = setInterval(() => this.print(), this.interval);
  }

  public stop() {
    clearInterval(this.setInterval);
    // print one last time
    this.print();
  }

  private print() {
    const percentage = ((this.objectsScanned / this.totalObjects) * 100).toFixed(2);
    // print in MiB until we hit at least 1 GiB of data tagged/deleted
    if (Math.max(this.taggedObjectsSizeMb, this.deletedObjectsSizeMb) >= 1000) {
      print(chalk.green(`[${percentage}%] ${this.objectsScanned} files scanned: ${this.taggedObjects} objects (${(this.taggedObjectsSizeMb / 1000).toFixed(2)} GiB) tagged, ${this.deletedObjects} objects (${(this.deletedObjectsSizeMb / 1000).toFixed(2)} GiB) deleted.`));
    } else {
      print(chalk.green(`[${percentage}%] ${this.objectsScanned} files scanned: ${this.taggedObjects} objects (${this.taggedObjectsSizeMb.toFixed(2)} MiB) tagged, ${this.deletedObjects} objects (${this.deletedObjectsSizeMb.toFixed(2)} MiB) deleted.`));
    }
  }
}