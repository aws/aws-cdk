import type { IConstruct } from 'constructs';
import { Mixin } from '../../../core/lib/mixins';
import { CfnRepository } from '../ecr.generated';

/**
 * ECR-specific Mixin to force-delete all images from a repository
 * when the repository is removed from the stack or when the stack is deleted.
 *
 * Sets the `emptyOnDelete` property on the repository.
 */
export class RepositoryAutoDeleteImages extends Mixin {
  supports(construct: IConstruct): construct is CfnRepository {
    return CfnRepository.isCfnRepository(construct);
  }

  applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    construct.emptyOnDelete = true;
  }
}
