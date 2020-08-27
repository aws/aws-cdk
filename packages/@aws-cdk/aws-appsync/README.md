## AWS AppSync Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-appsync` package contains constructs for building flexible
APIs that use GraphQL. 

### Example

Example of a GraphQL API with `AWS_IAM` authorization resolving into a DynamoDb
backend data source. 

GraphQL schema file `schema.graphql`:

```gql
type demo {
  id: String!
  version: String!
}
type Query {
  getDemos: [ test! ]
}
input DemoInput {
  version: String!
}
type Mutation {
  addDemo(input: DemoInput!): demo
}
```

CDK stack file `app-stack.ts`:

```ts
import * as appsync from '@aws-cdk/aws-appsync';
import * as db from '@aws-cdk/aws-dynamodb';

const api = new appsync.GraphQLApi(stack, 'Api', {
  name: 'demo',
  schema: appsync.Schema.fromAsset(join(__dirname, 'schema.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.IAM
    },
  },
  xrayEnabled: true,
});

const demoTable = new db.Table(stack, 'DemoTable', {
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});

const demoDS = api.addDynamoDbDataSource('demoDataSource', demoTable);

// Resolver for the Query "getDemos" that scans the DyanmoDb table and returns the entire list.
demoDS.createResolver({
  typeName: 'Query',
  fieldName: 'getDemos',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

// Resolver for the Mutation "addDemo" that puts the item into the DynamoDb table.
demoDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'addDemo',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('demo')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
```

### Schema

Every GraphQL Api needs a schema to define the Api. CDK offers `appsync.Schema`
for static convenience methods for various types of schema declaration: code-first
or schema-first.

#### Code-First

When declaring your GraphQL Api, CDK defaults to a code-first approach if the
`schema` property is not configured. 

```ts
const api = new appsync.GraphQLApi(stack, 'api', { name: 'myApi' });
```

CDK will declare a `Schema` class that will give your Api access functions to
define your schema code-first: `addType`, `addObjectType`, `addToSchema`, etc.

You can also declare your `Schema` class outside of your CDK stack, to define
your schema externally.

```ts
const schema = new appsync.Schema();
schema.addObjectType('demo', {
  definition: { id: appsync.GraphqlType.id() },
});
const api = new appsync.GraphQLApi(stack, 'api', {
  name: 'myApi',
  schema
});
```

See the [code-first schema](#Code-First-Schema) section for more details.

#### Schema-First

You can define your GraphQL Schema from a file on disk. For convenience, use
the `appsync.Schema.fromAsset` to specify the file representing your schema.

```ts
const api = appsync.GraphQLApi(stack, 'api', {
  name: 'myApi',
  schema: appsync.Schema.fromAsset(join(__dirname, 'schema.graphl')),
});
```

### Imports

Any GraphQL Api that has been created outside the stack can be imported from 
another stack into your CDK app. Utilizing the `fromXxx` function, you have 
the ability to add data sources and resolvers through a `IGraphQLApi` interface.

```ts
const importedApi = appsync.GraphQLApi.fromGraphQLApiAttributes(stack, 'IApi', {
  graphqlApiId: api.apiId,
  graphqlArn: api.arn,
});
importedApi.addDynamoDbDataSource('TableDataSource', table);
```

If you don't specify `graphqlArn` in `fromXxxAttributes`, CDK will autogenerate
the expected `arn` for the imported api, given the `apiId`. For creating data 
sources and resolvers, an `apiId` is sufficient.

### Permissions

When using `AWS_IAM` as the authorization type for GraphQL API, an IAM Role
with correct permissions must be used for access to API.

When configuring permissions, you can specify specific resources to only be
accessible by `IAM` authorization. For example, if you want to only allow mutability
for `IAM` authorized access you would configure the following.

In `schema.graphql`:
```ts
type Mutation {
  updateExample(...): ...
    @aws_iam
}
```

In `IAM`:
```json
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": [
            "appsync:GraphQL"
         ],
         "Resource": [
            "arn:aws:appsync:REGION:ACCOUNT_ID:apis/GRAPHQL_ID/types/Mutation/fields/updateExample"
         ]
      }
   ]
}
```

See [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#aws-iam-authorization) for more details.

To make this easier, CDK provides `grant` API.

Use the `grant` function for more granular authorization.

```ts
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
const api = new appsync.GraphQLApi(stack, 'API', {
  definition
});

api.grant(role, appsync.IamResource.custom('types/Mutation/fields/updateExample'), 'appsync:GraphQL')
```

#### IamResource

In order to use the `grant` functions, you need to use the class `IamResource`.

- `IamResource.custom(...arns)` permits custom ARNs and requires an argument.

- `IamResouce.ofType(type, ...fields)` permits ARNs for types and their fields.

- `IamResource.all()` permits ALL resources.

#### Generic Permissions

Alternatively, you can use more generic `grant` functions to accomplish the same usage.

These include:
- grantMutation (use to grant access to Mutation fields)
- grantQuery (use to grant access to Query fields)
- grantSubscription (use to grant access to Subscription fields)

```ts
// For generic types
api.grantMutation(role, 'updateExample');

// For custom types and granular design
api.grant(role, appsync.IamResource.ofType('Mutation', 'updateExample'), 'appsync:GraphQL');
```

## Code-First Schema

CDK offers the ability to generate your schema in a code-first approach. 
A code-first approach offers a developer workflow with:
- **modularity**: organizing schema type definitions into different files
- **reusability**: simplifying down boilerplate/repetitive code
- **consistency**: resolvers and schema definition will always be synced

The code-first approach allows for **dynamic** schema generation. You can generate your schema based on variables and templates to reduce code duplication.

### Code-First Example

To showcase the code-first approach. Let's try to model the following schema segment.

```gql
interface Node {
  id: String
}

type Query {
  allFilms(after: String, first: Int, before: String, last: Int): FilmConnection
}

type FilmNode implements Node {
  filmName: String
}

type FilmConnection {
  edges: [FilmEdge]
  films: [Film]
  totalCount: Int
}

type FilmEdge {
  node: Film 
  cursor: String
}
```

Above we see a schema that allows for generating paginated responses. For example,
we can query `allFilms(first: 100)` since `FilmConnection` acts as an intermediary
for holding `FilmEdges` we can write a resolver to return the first 100 films.

In a separate file, we can declare our scalar types: `scalar-types.ts`.

```ts
import { GraphqlType } from '@aws-cdk/aws-appsync';

export const string = appsync.GraphqlType.string();
export const int = appsync.GraphqlType.int();
```

In another separate file, we can declare our object types and related functions.
We will call this file `object-types.ts` and we will have created it in a way that
allows us to generate other `XxxConnection` and `XxxEdges` in the future. 

```ts
const pluralize = require('pluralize');
import * as scalar from './scalar-types.ts';
import * as appsync from '@aws-cdk/aws-appsync';

export const args = {
  after: scalar.string, 
  first: scalar.int,
  before: scalar.string,
  last: scalar.int,
};

export const Node = new appsync.InterfaceType('Node', {
  definition: { id: scalar.string }
});
export const FilmNode = new appsync.ObjectType.implementInterface('FilmNode', {
  interfaceTypes: [Node],
  definition: { filmName: scalar.string }
});

export function generateEdgeAndConnection(base: appsync.ObjectType) {
  const edge = new appsync.ObjectType(`${base.name}Edge`, {
    definition: { node: base.attribute(), cursor: scalar.string }
  });
  const connection = new appsync.ObjectType(`${base.name}Connection`, {
    definition: {
      edges: edges.attribute({ isList: true }),
      [pluralize(base.name)]: base.attribute({ isList: true }),
      totalCount: scalar.int,
    }
  });
  return { edge: edge, connection: connection };
}
```

Finally, we will go to our `cdk-stack` and combine everything together
to generate our schema.

```ts
import * as appsync from '@aws-cdk/aws-appsync';
import * as schema from './object-types';

const api = new appsync.GraphQLApi(stack, 'Api', {
  name: 'demo',
});

this.objectTypes = [ schema.Node, schema.Film ];

const filmConnections = schema.generateEdgeAndConnection(schema.Film);

api.addType('Query', {
  definition: {
    allFilms: new appsync.ResolvableField(dummyDataSource, {
      returnType: filmConnections.connection.attribute(),
      args: schema.args,
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    }),
  }
});

this.objectTypes.map((t) => api.addType(t));
Object.keys(filmConnections).forEach((key) => api.addType(filmConnections[key]));
```

Notice how we can utilize the `generateEdgeAndConnection` function to generate
Object Types. In the future, if we wanted to create more Object Types, we can simply
create the base Object Type (i.e. Film) and from there we can generate its respective
`Connections` and `Edges`.

Check out a more in-depth example [here](https://github.com/BryanPan342/starwars-code-first).

### GraphQL Types

One of the benefits of GraphQL is its strongly typed nature. We define the 
types within an object, query, mutation, interface, etc. as **GraphQL Types**. 

GraphQL Types are the building blocks of types, whether they are scalar, objects, 
interfaces, etc. GraphQL Types can be:
- [**Scalar Types**](https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html): Id, Int, String, AWSDate, etc. 
- [**Object Types**](#Object-Types): types that you generate (i.e. `demo` from the example above)
- [**Interface Types**](#Interface-Types): abstract types that define the base implementation of other 
Intermediate Types

More concretely, GraphQL Types are simply the types appended to variables. 
Referencing the object type `Demo` in the previous example, the GraphQL Types 
is `String!` and is applied to both the names `id` and `version`.

### Field and Resolvable Fields

While `GraphqlType` is a base implementation for GraphQL fields, we have abstractions
on top of `GraphqlType` that provide finer grain support.

#### Field

`Field` extends `GraphqlType` and will allow you to define arguments. [**Interface Types**](#Interface-Types) are not resolvable and this class will allow you to define arguments,
but not its resolvers.

For example, if we want to create the following type:

```gql
type Node {
  test(argument: string): String
}
```

The CDK code required would be:

```ts
const field = new appsync.Field({
  returnType: appsync.GraphqlType.string(),
  args: {
    argument: appsync.GraphqlType.string(),
  },
});
const type = new appsync.InterfaceType('Node', {
  definition: { test: field },
});
```

#### Resolvable Fields

`ResolvableField` extends `Field` and will allow you to define arguments and its resolvers.
[**Object Types**](#Object-Types) can have fields that resolve and perform operations on
your backend.

You can also create resolvable fields for object types.

```gql
type Info {
  node(id: String): String
}
```

The CDK code required would be:

```ts
const info = new appsync.ObjectType('Info', {
  definition: { 
    node: new appsync.ResolvableField({
      returnType: appsync.GraphqlType.string(),
      args: {
        id: appsync.GraphqlType.string(),
      },
      dataSource: api.addNoneDataSource('none'),
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    }),
  },
});
```

To nest resolvers, we can also create top level query types that call upon
other types. Building off the previous example, if we want the following graphql
type definition:

```gql
type Query {
  get(argument: string): Info
}
```

The CDK code required would be:

```ts
const query = new appsync.ObjectType('Query', {
  definition: { 
    get: new appsync.ResolvableField({
      returnType: appsync.GraphqlType.string(),
      args: {
        argument: appsync.GraphqlType.string(),
      },
      dataSource: api.addNoneDataSource('none'),
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    }),
  },
});
```

Learn more about fields and resolvers [here](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-overview.html).

### Intermediate Types

Intermediate Types are defined by Graphql Types and Fields. They have a set of defined 
fields, where each field corresponds to another type in the system. Intermediate 
Types will be the meat of your GraphQL Schema as they are the types defined by you.

Intermediate Types include:
- [**Interface Types**](#Interface-Types)
- [**Object Types**](#Object-Types)

### Interface Types

**Interface Types** are abstract types that define the implementation of other
intermediate types. They are useful for eliminating duplication and can be used
to generate Object Types with less work.

You can create Interface Types ***externally***.
```ts
const node = new appsync.InterfaceType('Node', {
  definition: {
    id: appsync.GraphqlType.string({ isRequired: true }),
  },
});
```

### Object Types

**Object Types** are types that you declare. For example, in the [code-first example](#code-first-example)
the `demo` variable is an **Object Type**. **Object Types** are defined by 
GraphQL Types and are only usable when linked to a GraphQL Api.

You can create Object Types in three ways:

1. Object Types can be created ***externally***.
    ```ts
    const api = new appsync.GraphQLApi(stack, 'Api', {
      name: 'demo',
    });
    const demo = new appsync.ObjectType('Demo', {
      defintion: {
        id: appsync.GraphqlType.string({ isRequired: true }),
        version: appsync.GraphqlType.string({ isRequired: true }),
      },
    });

    api.addType(object);
    ```
    > This method allows for reusability and modularity, ideal for larger projects. 
    For example, imagine moving all Object Type definition outside the stack.

    `scalar-types.ts` - a file for scalar type definitions
    ```ts
    export const required_string = appsync.GraphqlType.string({ isRequired: true });
    ```

    `object-types.ts` - a file for object type definitions
    ```ts
    import { required_string } from './scalar-types';
    export const demo = new appsync.ObjectType('Demo', {
      defintion: {
        id: required_string,
        version: required_string,
      },
    });
    ```

    `cdk-stack.ts` - a file containing our cdk stack
    ```ts
    import { demo } from './object-types';
    api.addType(demo);
    ```

2. Object Types can be created ***externally*** from an Interface Type.
    ```ts
    const node = new appsync.InterfaceType('Node', {
      definition: {
        id: appsync.GraphqlType.string({ isRequired: true }),
      },
    });
    const demo = new appsync.ObjectType('Demo', {
      interfaceTypes: [ node ],
      defintion: {
        version: appsync.GraphqlType.string({ isRequired: true }),
      },
    });
    ```
    > This method allows for reusability and modularity, ideal for reducing code duplication. 

3. Object Types can be created ***internally*** within the GraphQL API.
    ```ts
    const api = new appsync.GraphQLApi(stack, 'Api', {
      name: 'demo',
    });
    api.addType('Demo', {
      defintion: {
        id: appsync.GraphqlType.string({ isRequired: true }),
        version: appsync.GraphqlType.string({ isRequired: true }),
      },
    });
    ```
    > This method provides easy use and is ideal for smaller projects.

