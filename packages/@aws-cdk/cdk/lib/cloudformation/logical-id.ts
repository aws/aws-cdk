import { makeUniqueId } from '../util/uniqueid';
import { StackElement } from './stack';

const PATH_SEP = '/';

/**
 * Interface for classes that implementation logical ID assignment strategies
 */
export interface IAddressingScheme {
  /**
   * Return the logical ID for the given list of Construct names on the path.
   */
  allocateAddress(addressComponents: string[]): string;
}

/**
 * Renders a hashed ID for a resource.
 *
 * In order to make sure logical IDs are unique and stable, we hash the resource
 * construct tree path (i.e. toplevel/secondlevel/.../myresource) and add it as
 * a suffix to the path components joined without a separator (CloudFormation
 * IDs only allow alphanumeric characters).
 *
 * The result will be:
 *
 *   <path.join('')><md5(path.join('/')>
 *     "human"      "hash"
 *
 * If the "human" part of the ID exceeds 240 characters, we simply trim it so
 * the total ID doesn't exceed CloudFormation's 255 character limit.
 *
 * We only take 8 characters from the md5 hash (0.000005 chance of collision).
 *
 * Special cases:
 *
 * - If the path only contains a single component (i.e. it's a top-level
 *   resource), we won't add the hash to it. The hash is not needed for
 *   disamiguation and also, it allows for a more straightforward migration an
 *   existing CloudFormation template to a CDK stack without logical ID changes
 *   (or renames).
 * - For aesthetic reasons, if the last components of the path are the same
 *   (i.e. `L1/L2/Pipeline/Pipeline`), they will be de-duplicated to make the
 *   resulting human portion of the ID more pleasing: `L1L2Pipeline<HASH>`
 *   instead of `L1L2PipelinePipeline<HASH>`
 * - If a component is named "Default" it will be omitted from the path. This
 *   allows refactoring higher level abstractions around constructs without affecting
 *   the IDs of already deployed resources.
 * - If a component is named "Resource" it will be omitted from the user-visible
 *   path, but included in the hash. This reduces visual noise in the human readable
 *   part of the identifier.
 */
export class HashedAddressingScheme implements IAddressingScheme {
  public allocateAddress(addressComponents: string[]): string {
    return makeUniqueId(addressComponents);
  }
}

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

  constructor(private readonly namingScheme: IAddressingScheme) {
  }

  /**
   * Rename a logical ID from an old ID to a new ID
   */
  public renameLogical(oldId: string, newId: string) {
    if (oldId in this.renames) {
      throw new Error(`A rename has already been registered for '${oldId}'`);
    }
    this.renames[oldId] = newId;
  }

  /**
   * Return the logical ID for the given stack element
   */
  public getLogicalId(stackElement: StackElement): string {
    const path = stackElement.stackPath.split(PATH_SEP);

    const generatedId = this.namingScheme.allocateAddress(path);
    const finalId = this.applyRename(generatedId);
    validateLogicalId(finalId);
    return finalId;
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

  /**
   * Return the renamed version of an ID, if applicable
   */
  private applyRename(oldId: string) {
    let newId = oldId;
    if (oldId in this.renames) {
      newId = this.renames[oldId];
    }

    // If this newId has already been used, it must have been with the same oldId
    if (newId in this.reverse && this.reverse[newId] !== oldId) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Two objects have been assigned the same Logical ID: '${this.reverse[newId]}' and '${oldId}' are now both named '${newId}'.`);
    }
    this.reverse[newId] = oldId;

    return newId;
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
