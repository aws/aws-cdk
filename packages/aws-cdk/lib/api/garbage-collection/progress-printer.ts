import * as chalk from 'chalk';
import { GcAsset as GCAsset } from './garbage-collector';
import { info } from '../../logging';
import { ToolkitError } from '../../toolkit/error';

export class ProgressPrinter {
  private totalAssets: number;
  private assetsScanned: number;
  private taggedAsset: number;
  private taggedAssetsSizeMb: number;
  private deletedAssets: number;
  private deletedAssetsSizeMb: number;
  private interval: number;
  private setInterval?: ReturnType<typeof setTimeout>;
  private isPaused: boolean;

  constructor(totalAssets: number, interval?: number) {
    this.totalAssets = totalAssets;
    this.assetsScanned = 0;
    this.taggedAsset = 0;
    this.taggedAssetsSizeMb = 0;
    this.deletedAssets = 0;
    this.deletedAssetsSizeMb = 0;
    this.interval = interval ?? 10_000;
    this.isPaused = false;
  }

  public reportScannedAsset(amt: number) {
    this.assetsScanned += amt;
  }

  public reportTaggedAsset(assets: GCAsset[]) {
    this.taggedAsset += assets.length;
    const sizeInBytes = assets.reduce((total, asset) => total + asset.size, 0);
    this.taggedAssetsSizeMb += sizeInBytes / 1_048_576;
  }

  public reportDeletedAsset(assets: GCAsset[]) {
    this.deletedAssets += assets.length;
    const sizeInBytes = assets.reduce((total, asset) => total + asset.size, 0);
    this.deletedAssetsSizeMb += sizeInBytes / 1_048_576;
  }

  public start() {
    // If there is already a running setInterval, throw an error.
    // This is because if this.setInterval is reassigned to another setInterval,
    // the original setInterval remains and can no longer be cleared.
    if (this.setInterval) {
      throw new ToolkitError('ProgressPrinter is already running. Stop it first using the stop() method before starting it again.');
    }

    this.setInterval = setInterval(() => {
      if (!this.isPaused) {
        this.print();
      }
    }, this.interval);
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public stop() {
    clearInterval(this.setInterval);
    // print one last time if not paused
    if (!this.isPaused) {
      this.print();
    }
  }

  private print() {
    const percentage = ((this.assetsScanned / this.totalAssets) * 100).toFixed(2);
    // print in MiB until we hit at least 1 GiB of data tagged/deleted
    if (Math.max(this.taggedAssetsSizeMb, this.deletedAssetsSizeMb) >= 1000) {
      info(chalk.green(`[${percentage}%] ${this.assetsScanned} files scanned: ${this.taggedAsset} assets (${(this.taggedAssetsSizeMb / 1000).toFixed(2)} GiB) tagged, ${this.deletedAssets} assets (${(this.deletedAssetsSizeMb / 1000).toFixed(2)} GiB) deleted.`));
    } else {
      info(chalk.green(`[${percentage}%] ${this.assetsScanned} files scanned: ${this.taggedAsset} assets (${this.taggedAssetsSizeMb.toFixed(2)} MiB) tagged, ${this.deletedAssets} assets (${this.deletedAssetsSizeMb.toFixed(2)} MiB) deleted.`));
    }
  }
}
