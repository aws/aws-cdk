/**
 * The schema for the Attestation document that is used for the Digital Signature of Cloud Assemblies.
 */
export interface Attestation {
  /** The hashing algorithm used by this Attestation */
  algorithm: string;
  /** The items that this attestation is about */
  items: { [path: string]: FileData };
  /** The base64-encoded nonce used to hash items in the attestation */
  nonce: string;
  /** The time at which this attestation was made */
  timestamp: Date;
}

/**
 * Attestation data about a particular file.
 */
export interface FileData {
  /** The size of the file, in bytes, expressed as a Base-10 string */
  size: string;
  /** The base64-encoded hash of the file contents, salted with the attestation nonce */
  hash: string;
}
