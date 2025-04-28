import { UnscopedValidationError } from "../../core";

export class CidrRoutingConfig {
  /**
   * The CIDR collection ID.
   */
  readonly collectionId: string;

  /**
   * The CIDR collection location name.
   */
  readonly locationName: string;

  constructor(collectionId: string, locationName: string) {
    const COLLECTION_ID_REGEX = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
    const LOCATION_NAME_REGEX = /^[0-9A-Za-z_\-\*]{1,16}$/;

    if (!COLLECTION_ID_REGEX.test(collectionId?.trim() ?? '')) {
      throw new UnscopedValidationError('collectionId is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 digits)');
    }
    if (!LOCATION_NAME_REGEX.test(locationName?.trim() ?? '')) {
      throw new UnscopedValidationError('locationName is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks');
    }
    this.collectionId = collectionId;
    this.locationName = locationName;
  }
}


