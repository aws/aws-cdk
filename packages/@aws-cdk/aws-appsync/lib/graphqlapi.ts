import { IUserPool } from "@aws-cdk/aws-cognito";
import { Table } from '@aws-cdk/aws-dynamodb';
import { IGrantable, IPrincipal, IRole, ManagedPolicy, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { IFunction } from "@aws-cdk/aws-lambda";
import { Construct, IResolvable } from "@aws-cdk/core";
import { readFileSync } from "fs";
import { CfnDataSource, CfnGraphQLApi, CfnGraphQLSchema, CfnResolver } from "./appsync.generated";

export enum UserPoolDefaultAction {
    ALLOW = 'ALLOW',
    DENY = 'DENY',
}

export interface UserPoolConfig {

    /**
     * The Cognito user pool to use as identity source
     */
    readonly userPool: IUserPool;
    /**
     * the optional app id regex
     * @default -  None
     */
    readonly appIdClientRegex?: string;
    /**
     * Default auth action
     * @default ALLOW
     */
    readonly defaultAction?: UserPoolDefaultAction;
}

export enum FieldLogLevel {
    NONE = 'NONE',
    ERROR = 'ERROR',
    ALL = 'ALL',
}

export interface LogConfig {
    /**
     *
     */
    readonly excludeVerboseContent?: boolean | IResolvable;
    /**
     *
     */
    readonly fieldLogLevel?: FieldLogLevel;
}

export interface GraphQLApiProps {

    /**
     * the name of the GraphQL API
     */
    readonly name: string;

    /**
     * Optional user pool authorizer configuration
     * @default - Do not use Cognito auth
     */
    readonly userPoolConfig?: UserPoolConfig;

    /**
     * Logging configuration for this api
     * @default - None
     */
    readonly logConfig?: LogConfig;

    /**
     * GraphQL schema definition. You have to specify a definition or a file containing one.
     * @default - Use schemaDefinitionFile
     */
    readonly schemaDefinition?: string;
    /**
     * File containing the GraphQL schema definition. You have to specify a definition or a file containing one.
     * @default - Use schemaDefinition
     */
    readonly schemaDefinitionFile?: string;

}

export class GraphQLApi extends Construct {

    /**
     * the id of the GraphQL API
     */
    public readonly apiId: string;
    /**
     * the ARN of the API
     */
    public readonly arn: string;
    /**
     * the URL of the endpoint created by AppSync
     */
    public readonly graphQlUrl: string;
    /**
     * the name of the API
     */
    public name: string;
    /**
     * underlying CFN schema resource
     */
    public readonly schema: CfnGraphQLSchema;

    private api: CfnGraphQLApi;
    private authenticationType: string;

    constructor(scope: Construct, id: string, props: GraphQLApiProps) {
        super(scope, id);

        let apiLogsRole;
        if (props.logConfig) {
            apiLogsRole = new Role(this, 'ApiLogsRole', { assumedBy: new ServicePrincipal('appsync') });
            apiLogsRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'));
        }

        if (props.userPoolConfig) {
            this.authenticationType = 'AMAZON_COGNITO_USER_POOLS';
        } else {
            this.authenticationType = 'API_KEY';
        }

        this.api = new CfnGraphQLApi(this, 'Resource', {
            name: props.name,
            authenticationType: this.authenticationType,
            ...props.userPoolConfig && {
                userPoolConfig: {
                    userPoolId: props.userPoolConfig.userPool.userPoolId,
                    awsRegion: props.userPoolConfig.userPool.stack.region,
                    defaultAction: props.userPoolConfig.defaultAction ? props.userPoolConfig.defaultAction.toString() : 'ALLOW',
                },
            },
            ...props.logConfig && {
                logConfig: {
                    cloudWatchLogsRoleArn: apiLogsRole ? apiLogsRole.roleArn : undefined,
                    excludeVerboseContent: props.logConfig.excludeVerboseContent,
                    fieldLogLevel: props.logConfig.fieldLogLevel ? props.logConfig.fieldLogLevel.toString() : undefined,
                },
            }
        });

        this.apiId = this.api.attrApiId;
        this.arn = this.api.attrArn;
        this.graphQlUrl = this.api.attrGraphQlUrl;
        this.name = this.api.name;

        let definition;
        if (props.schemaDefinition) {
            definition = props.schemaDefinition;
        } else if (props.schemaDefinitionFile) {
            definition = readFileSync(props.schemaDefinitionFile).toString('UTF-8');
        } else {
            throw new Error('Missing Schema definition. Provide schemaDefinition or schemaDefinitionFile');
        }
        this.schema = new CfnGraphQLSchema(this, 'Schema', {
            apiId: this.apiId,
            definition,
        });
    }

    /**
     * add a new DynamoDB data source to this API
     * @param name The name of the data source
     * @param description The description of the data source
     * @param table The DynamoDB table backing this data source [disable-awslint:ref-via-interface]
     */
    public addDynamoDbDataSource(name: string, description: string, table: Table): DynamoDbDataSource {
        return new DynamoDbDataSource(this, `${name}DS`, {
            api: this,
            description,
            name,
            table
        });
    }

    /**
     * add a new Lambda data source to this API
     * @param name The name of the data source
     * @param description The description of the data source
     * @param lambdaFunction The Lambda function to call to interact with this data source
     */
    public addLambdaDataSource(name: string, description: string, lambdaFunction: IFunction): LambdaDataSource {
        return new LambdaDataSource(this, `${name}DS`, {
            api: this,
            description,
            name,
            lambdaFunction
        });
    }

}

export interface BaseDataSourceProps {
    /**
     * The API to attach this data source to
     */
    readonly api: GraphQLApi;
    /**
     * The name of the data source
     */
    readonly name: string;
    /**
     * the description of the data source
     * @default - None
     */
    readonly description?: string;
    /**
     * The IAM service role to be assumed by AppSync to interact with the data source
     * @default -  Create a new role
     */
    readonly serviceRole?: IRole;
}

/**
 * props used by implementations of BaseDataSource to provide configuration. Should not be used directly.
 */
export interface ExtendedDataSourceProps {
    readonly type: string;
    readonly dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | IResolvable;
    readonly elasticsearchConfig?: CfnDataSource.ElasticsearchConfigProperty | IResolvable;
    readonly httpConfig?: CfnDataSource.HttpConfigProperty | IResolvable;
    readonly lambdaConfig?: CfnDataSource.LambdaConfigProperty | IResolvable;
    readonly relationalDatabaseConfig?: CfnDataSource.RelationalDatabaseConfigProperty | IResolvable;
}

export abstract class BaseDataSource extends Construct implements IGrantable {

    /**
     * the principal of the data source to be IGrantable
     */
    public readonly grantPrincipal: IPrincipal;
    /**
     * the name of the data source
     */
    public readonly name: string;
    /**
     * the underlying CFNN data source resource
     */
    public readonly ds: CfnDataSource;

    protected api: GraphQLApi;
    protected serviceRole: IRole;

    constructor(scope: Construct, id: string, props: BaseDataSourceProps, extended: ExtendedDataSourceProps) {
        super(scope, id);

        this.serviceRole = props.serviceRole || new Role(this, 'ServiceRole', { assumedBy: new ServicePrincipal('appsync') });
        this.grantPrincipal = this.serviceRole;

        this.ds = new CfnDataSource(this, 'Resource', {
            apiId: props.api.apiId,
            name: props.name,
            description: props.description,
            serviceRoleArn: this.serviceRole.roleArn,
            ...extended,
        });
        this.name = props.name;
        this.api = props.api;
    }

    public createResolver(props: BaseResolverProps): Resolver {
        return new Resolver(this, `${props.typeName}${props.fieldName}Resolver`, {
            api: this.api,
            dataSource: this,
            ...props,
        });
    }

}

export interface DynamoDbDataSourceProps extends BaseDataSourceProps {
    /**
     * The DynamoDB table backing this data source
     * [disable-awslint:ref-via-interface]
     */
    readonly table: Table;
    /**
     * Specify whether this DS is read only or has read and write permissions to the DynamoDB table
     * @default false
     */
    readonly readOnlyAccess?: boolean;
    /**
     * TODO
     * @default false
     */
    readonly useCallerCredentials?: boolean;
}

export class DynamoDbDataSource extends BaseDataSource {
    constructor(scope: Construct, id: string, props: DynamoDbDataSourceProps) {
        super(scope, id, props, {
            type: 'AMAZON_DYNAMODB',
            dynamoDbConfig: {
                tableName: props.table.tableName,
                awsRegion: props.table.stack.region,
                useCallerCredentials: props.useCallerCredentials,
            },
        });
        if (props.readOnlyAccess) {
            props.table.grantReadData(this.serviceRole);
        } else {
            props.table.grantReadWriteData(this.serviceRole);
        }
    }
}

export interface LambdaDataSourceProps extends BaseDataSourceProps {
    /**
     * The Lambda function to call to interact with this data source
     */
    readonly lambdaFunction: IFunction;
}

export class LambdaDataSource extends BaseDataSource {
    constructor(scope: Construct, id: string, props: LambdaDataSourceProps) {
        super(scope, id, props, {
            type: 'AWS_LAMBDA',
            lambdaConfig: {
                lambdaFunctionArn: props.lambdaFunction.functionArn,
            },
        });
        props.lambdaFunction.grantInvoke(this.serviceRole);
    }
}

// TODO more datasource types

export abstract class MappingTemplate {

    /**
     * Create a mapping template from the given string
     */
    public static fromString(template: string): MappingTemplate {
        return new StringMappingTemplate(template);
    }

    /**
     * Create a mapping template from the given file
     */
    public static fromFile(fileName: string): MappingTemplate {
        return new StringMappingTemplate(readFileSync(fileName).toString('UTF-8'));
    }

    /**
     * Mapping template for a result list from DynamoDB
     */
    public static dynamoDbResultList(): MappingTemplate {
        return this.fromString('$util.toJson($ctx.result.items)');
    }

    /**
     * Mapping template for a single result item from DynamoDB
     */
    public static dynamoDbResultItem(): MappingTemplate {
        return this.fromString('$util.toJson($ctx.result)');
    }

    /**
     * Mapping template to scan a DynamoDB table to fetch all entries
     */
    public static dynamoDbScanTable(): MappingTemplate {
        return this.fromString('{"version" : "2017-02-28", "operation" : "Scan"}');
    }

    /**
     * Mapping template to get a single item from a DynamoDB table
     *
     * @param keyName the name of the hash key field
     * @param idArg the name of the Query argument
     */
    public static dynamoDbGetItem(keyName: string, idArg: string): MappingTemplate {
        return this.fromString(`{"version": "2017-02-28", "operation": "GetItem", "key": {"${keyName}": $util.dynamodb.toDynamoDBJson($ctx.args.${idArg})}}`);
    }

    /**
     * Mapping template to delete a single item from a DynamoDB table
     *
     * @param keyName the name of the hash key field
     * @param idArg the name of the Mutation argument
     */
    public static dynamoDbDeleteItem(keyName: string, idArg: string): MappingTemplate {
        return this.fromString(`{"version": "2017-02-28", "operation": "DeleteItem", "key": {"${keyName}": $util.dynamodb.toDynamoDBJson($ctx.args.${idArg})}}`);
    }

    /**
     * Mapping template to save a single item to a DynamoDB table
     *
     * @param keyName the name of the hash key field
     * @param valueArg the name of the Mutation argument to use as attributes. By default it uses all arguments
     * @param idArg the name of the Mutation argument to use as id value. By default it generates a new id
     */
    public static dynamoDbPutItem(keyName: string, valueArg?: string, idArg?: string): MappingTemplate {
        return this.fromString(`{
            "version" : "2017-02-28",
            "operation" : "PutItem",
            "key" : {
                "${keyName}": $util.dynamodb.toDynamoDBJson(${idArg ? `$ctx.args.${idArg}` : '$util.autoId()'}),
            },
            "attributeValues" : $util.dynamodb.toMapValuesJson(${valueArg ? `$ctx.args.${valueArg}` : '$ctx.args'})
        }`);
    }

    /**
     * Mapping template to invoke a Lambda function
     * @param payload the VTL template snippet of the payload to send to the lambda
     */
    public static lambdaRequest(payload: string): MappingTemplate {
        return this.fromString(`{"version": "2017-02-28", "operation": "Invoke", "payload": ${payload}}`);
    }

    /**
     * Mapping template to return the Lambda result to the caller
     */
    public static lambdaResult(): MappingTemplate {
        return this.fromString('$util.toJson($ctx.result)');
    }

    /**
     * this is called to render the mapping template to a VTL string
     */
    public abstract renderTemplate(): string;

}

class StringMappingTemplate extends MappingTemplate {

    constructor(private readonly template: string) {
        super();
    }

    public renderTemplate() {
        return this.template;
    }
}

export interface BaseResolverProps {
    /**
     * name of the GraphQL type this resolver is attached to
     */
    readonly typeName: string;
    /**
     * name of the GraphQL fiel din the given type this resolver is attached to
     */
    readonly fieldName: string;
    /**
     * configuration of the pipeline resolver
     * @default - create a UNIT resolver
     */
    readonly pipelineConfig?: CfnResolver.PipelineConfigProperty | IResolvable;
    /**
     * The request mapping template for this resolver
     * @default - No mapping template
     */
    readonly requestMappingTemplate?: MappingTemplate;
    /**
     * The response mapping template for this resolver
     * @default - No mapping template
     */
    readonly responseMappingTemplate?: MappingTemplate;
}

export interface ResolverProps extends BaseResolverProps {
    /**
     * The API this resolver is attached to
     */
    readonly api: GraphQLApi;
    /**
     * The data source this resolver is using
     */
    readonly dataSource?: BaseDataSource;
}

export class Resolver extends Construct {

    /**
     * the ARN of the resolver
     */
    public readonly arn: string;

    private resolver: CfnResolver;

    constructor(scope: Construct, id: string, props: ResolverProps) {
        super(scope, id);

        this.resolver = new CfnResolver(this, 'Resource', {
            apiId: props.api.apiId,
            typeName: props.typeName,
            fieldName: props.fieldName,
            dataSourceName: props.dataSource ? props.dataSource.name : undefined,
            kind: props.pipelineConfig ? 'PIPELINE' : 'UNIT',
            requestMappingTemplate: props.requestMappingTemplate ? props.requestMappingTemplate.renderTemplate() : undefined,
            responseMappingTemplate: props.responseMappingTemplate ? props.responseMappingTemplate.renderTemplate() : undefined,
        });
        this.resolver.addDependsOn(props.api.schema);
        if (props.dataSource) {
            this.resolver.addDependsOn(props.dataSource.ds);
        }
        this.arn = this.resolver.attrResolverArn;
    }
}
