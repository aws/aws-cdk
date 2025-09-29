/**
 * | Property                | OpenSearch Serverless | Pinecone | RDS | MongoDB Atlas | Neptune Analytics | OpenSearch Managed Cluster |
 * | ----------------------- | :-------------------: | :------: | :-: | :-----------: | :---------------: | :------------------------: |
 * | **metadataField**       |          ✅           |    ✅    | ✅  |      ✅       |        ✅         |             ✅             |
 * | **textField**           |          ✅           |    ✅    | ✅  |      ✅       |        ✅         |             ✅             |
 * | **vectorField**         |          ✅           |    ❌    | ✅  |      ✅       |        ❌         |             ✅             |
 * | **primaryKeyField**     |          ❌           |    ❌    | ✅  |      ❌       |        ❌         |             ❌             |
 * | **customMetadataField** |          ❌           |    ❌    | ✅  |      ❌       |        ❌         |             ❌             |
 */
export interface VectorFieldMapping {
  /**
   * The name of the field in which Amazon Bedrock stores the raw text from your data.
   * The text is split according to the chunking strategy you choose.
   */
  readonly textField: string;
  /**
   * The name of the field in which Amazon Bedrock stores metadata about the vector store.
   */
  readonly metadataField: string;
  /**
   * The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.
   */
  readonly vectorField?: string;
  /**
   * The name of the field in which Amazon Bedrock stores the ID for each entry.
   */
  readonly primaryKeyField?: string;
  /**
   * Provide a name for the universal metadata field where Amazon Bedrock will store any custom metadata from your data source.
   */
  readonly customMetadataField?: string;
}
