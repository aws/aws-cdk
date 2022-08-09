import { CloudAssembly } from '../cloud-assembly';
import { NestedCloudAssemblyArtifact } from './nested-cloud-assembly-artifact';

const cacheSym = Symbol();

/**
 * The nested Assembly
 *
 * Declared in a different file to break circular dep between CloudAssembly and NestedCloudAssemblyArtifact
 */
Object.defineProperty(NestedCloudAssemblyArtifact.prototype, 'nestedAssembly', {
  get() {
    if (!this[cacheSym]) {
      this[cacheSym] = new CloudAssembly(this.fullPath);
    }
    return this[cacheSym];
  },
});
