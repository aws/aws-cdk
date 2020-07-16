/**
 * Class that keeps track of the logical IDs that are assigned to resources
 *
 * Supports renaming the generated IDs.
 */
export class LogicalIDs {
  /**
   * The rename table (old to new)
   */
  private readonly renames: {[old: string]: string} = {};

  /**
   * All assigned names (new to old, may be identical)
   *
   * This is used to ensure that:
   *
   * - No 2 resources end up with the same final logical ID, unless they were the same to begin with.
   * - All renames have been used at the end of renaming.
   */
  private readonly reverse: {[id: string]: string} = {};

  /**
   * Rename a logical ID from an old ID to a new ID
   */
  public addRename(oldId: string, newId: string) {
    if (oldId in this.renames) {
      throw new Error(`A rename has already been registered for '${oldId}'`);
    }
    this.renames[oldId] = newId;
  }

  /**
   * Return the renamed version of an ID or the original ID.
   */
  public applyRename(oldId: string) {
    let newId = oldId;
    if (oldId in this.renames) {
      newId = this.renames[oldId];
    }

    // If this newId has already been used, it must have been with the same oldId
    if (newId in this.reverse && this.reverse[newId] !== oldId) {
      // eslint-disable-next-line max-len
      throw new Error(`Two objects have been assigned the same Logical ID: '${this.reverse[newId]}' and '${oldId}' are now both named '${newId}'.`);
    }
    this.reverse[newId] = oldId;

    validateLogicalId(newId);
    return newId;
  }

  /**
   * Throw an error if not all renames have been used
   *
   * This is to assure that users didn't make typoes when registering renames.
   */
  public assertAllRenamesApplied() {
    const keys = new Set<string>();
    Object.keys(this.renames).forEach(keys.add.bind(keys));

    Object.keys(this.reverse).map(newId => {
      keys.delete(this.reverse[newId]);
    });

    if (keys.size !== 0) {
      const unusedRenames = Array.from(keys.values());
      throw new Error(`The following Logical IDs were attempted to be renamed, but not found: ${unusedRenames.join(', ')}`);
    }
  }
}

const VALID_LOGICALID_REGEX = /^[A-Za-z][A-Za-z0-9]{1,254}$/;

/**
 * Validate logical ID is valid for CloudFormation
 */
function validateLogicalId(logicalId: string) {
  if (!VALID_LOGICALID_REGEX.test(logicalId)) {
    throw new Error(`Logical ID must adhere to the regular expression: ${VALID_LOGICALID_REGEX.toString()}, got '${logicalId}'`);
  }
}
