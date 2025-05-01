import { HttpRequest } from '@smithy/protocol-http'
import { SignatureV4 } from '@smithy/signature-v4'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { Sha256 } from '@aws-crypto/sha256-js'

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const props = event.ResourceProperties;
  const domainEndpoint = props.DomainEndpoint;
  const indexName = props.IndexName;
  const shardCount = 1;
  const replicaCount = 0;
  const mappings = undefined;
  const additionalSettings = {
    auto_expand_replicas: "0-1"
  };
  
  // Extract domain region from the endpoint
  const region = domainEndpoint.split('.')[1];
  const service = 'es'; // OpenSearch service signature name

  // Initialize a signer with credentials
  const signer = new SignatureV4({
    service,
    region,
    credentials: fromNodeProviderChain(),
    sha256: Sha256,
  });

  // Helper function to make signed requests to OpenSearch
  async function signedFetch(method, path, body = null) {
    const url = new URL(`https://${domainEndpoint}${path}`);

    // Create a HTTP request object
    const request = new HttpRequest({
      method,
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'host': url.hostname,
        'content-type': 'application/json'
      },
      body
    });

    // Sign the request
    const signedRequest = await signer.sign(request);
    
    // Convert the signed request to fetch options
    const fetchOptions = {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body,
    };

    // Make the request
    const response = await fetch(`https://${domainEndpoint}${path}`, fetchOptions);
    const responseBody = await response.text();
    
    if (!response.ok) {
      const error = new Error(`OpenSearch request failed: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.body = responseBody;
      throw error;
    }

    return responseBody.length > 0 ? JSON.parse(responseBody) : {};
  }

  // Add bulk load movies function
  async function bulkLoadMovies() {
    const movies = [
      {
        "id": 1,
        "title": "Echoes of Tomorrow",
        "year": 2025,
        "genres": ["Sci-Fi", "Mystery", "Drama"],
        "director": "Sarah Chen",
        "actors": ["Michael Torres", "Emma Blake", "David Kang"],
        "plot": "A quantum physicist discovers a way to communicate with her future self, only to uncover a devastating truth that forces her to choose between saving her family or humanity.",
        "rating": 8.7,
        "runtime": 137
      },
      {
        "id": 2,
        "title": "The Last Canvas",
        "year": 2023,
        "genres": ["Thriller", "Art", "Crime"],
        "director": "Marcus Blackwood",
        "actors": ["Isabella Romano", "James Fletcher", "Sophie Laurent"],
        "plot": "When a renowned art restorer discovers a hidden message in a Renaissance masterpiece, she becomes entangled in a centuries-old conspiracy that puts her life at risk.",
        "rating": 8.4,
        "runtime": 155
      },
      {
        "id": 3,
        "title": "Midnight in Montana",
        "year": 2024,
        "genres": ["Western", "Horror", "Supernatural"],
        "director": "Rachel Winters",
        "actors": ["Sam Elliott", "Luna Blackwood", "John Running Wolf"],
        "plot": "A small-town sheriff and a Native American tracker must join forces to battle an ancient evil that awakens in the Montana wilderness during a lunar eclipse.",
        "rating": 7.9,
        "runtime": 128
      },
      {
        "id": 4,
        "title": "The Kitchen Revolution",
        "year": 2022,
        "genres": ["Comedy", "Drama", "Food"],
        "director": "Jean-Pierre Dubois",
        "actors": ["Maria Gonzalez", "Pierre Laurent", "Aisha Johnson"],
        "plot": "A struggling chef starts a underground restaurant in her tiny apartment, sparking a food movement that challenges the elite culinary world and her own prejudices.",
        "rating": 8.2,
        "runtime": 118
      }      
    ];

    // Prepare bulk operation data
    const operations = movies.flatMap(movie => [
      { index: { _index: indexName, _id: movie.id.toString() } },
      movie
    ]);

    // Convert to new line delimited JSON (NDJSON)
    const bulkBody = operations.map(op => JSON.stringify(op)).join('\n') + '\n';

    // Perform bulk operation
    return signedFetch('POST', '/_bulk', bulkBody);
  }

  try {
    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        const body = {
          settings: {
            index: {
              number_of_shards: shardCount.toString(),
              number_of_replicas: replicaCount.toString(),
              ...additionalSettings
            }
          },
          mappings: mappings || {
            properties: {
              id: { type: "integer" },
              title: { type: "text", fields: { keyword: { type: "keyword" } } },
              year: { type: "integer" },
              genres: { type: "keyword" },
              director: { type: "text", fields: { keyword: { type: "keyword" } } },
              actors: { type: "keyword" },
              plot: { type: "text" },
              rating: { type: "float" },
              runtime: { type: "integer" }
            }
          }
        };
        
        // For Update - first check if index exists
        if (event.RequestType === 'Update') {
          try {
            const res = await signedFetch('GET', `/${indexName}`);
            console.log("Checking if index exists: ", res);
          } catch (e) {
            if (e.statusCode === 404) {
              const res = await signedFetch('PUT', `/${indexName}`, JSON.stringify(body));
              console.log("Index created: ", res);
              // Load sample data after creating the index
              const res2 = await bulkLoadMovies();
              console.log("Sample data loaded: ", res2);
            } else {
              throw e;
            }
          }
        } else {
          // Create index and load sample data
          const res = await signedFetch('PUT', `/${indexName}`, JSON.stringify(body));
          console.log("Index created: ", res);
          const res2 = await bulkLoadMovies();
          console.log("Sample data loaded: ", res2);
        }
        break;
        
      case 'Delete':
        try {
          await signedFetch('DELETE', `/${indexName}`);
        } catch (e) {
          if (e.statusCode === 404) {
            // Index already deleted or never existed
            console.log(`Index ${indexName} does not exist. Skipping deletion.`);
          } else {
            throw e;
          }
        }
        break;
    }

    return {
      PhysicalResourceId: `opensearch-index-${indexName}`,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
