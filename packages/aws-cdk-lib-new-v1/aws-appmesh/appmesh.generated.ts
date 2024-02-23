/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a gateway route.
 *
 * A gateway route is attached to a virtual gateway and routes traffic to an existing virtual service. If a route matches a request, it can distribute traffic to a target virtual service.
 *
 * For more information about gateway routes, see [Gateway routes](https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html) .
 *
 * @cloudformationResource AWS::AppMesh::GatewayRoute
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html
 */
export class CfnGatewayRoute extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::GatewayRoute";

  /**
   * Build a CfnGatewayRoute from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGatewayRoute {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGatewayRoutePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGatewayRoute(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the gateway route.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the gateway route.
   *
   * @cloudformationAttribute GatewayRouteName
   */
  public readonly attrGatewayRouteName: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the gateway route resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the gateway route.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual gateway that the gateway route is associated with.
   *
   * @cloudformationAttribute VirtualGatewayName
   */
  public readonly attrVirtualGatewayName: string;

  /**
   * The name of the gateway route.
   */
  public gatewayRouteName?: string;

  /**
   * The name of the service mesh that the resource resides in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The specifications of the gateway route.
   */
  public spec: CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the gateway route to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The virtual gateway that the gateway route is associated with.
   */
  public virtualGatewayName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGatewayRouteProps) {
    super(scope, id, {
      "type": CfnGatewayRoute.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);
    cdk.requireProperty(props, "virtualGatewayName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrGatewayRouteName = cdk.Token.asString(this.getAtt("GatewayRouteName", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualGatewayName = cdk.Token.asString(this.getAtt("VirtualGatewayName", cdk.ResolutionTypeHint.STRING));
    this.gatewayRouteName = props.gatewayRouteName;
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::GatewayRoute", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualGatewayName = props.virtualGatewayName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "gatewayRouteName": this.gatewayRouteName,
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualGatewayName": this.virtualGatewayName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGatewayRoute.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGatewayRoutePropsToCloudFormation(props);
  }
}

export namespace CfnGatewayRoute {
  /**
   * An object that represents a gateway route specification.
   *
   * Specify one gateway route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html
   */
  export interface GatewayRouteSpecProperty {
    /**
     * An object that represents the specification of a gRPC gateway route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-grpcroute
     */
    readonly grpcRoute?: CfnGatewayRoute.GrpcGatewayRouteProperty | cdk.IResolvable;

    /**
     * An object that represents the specification of an HTTP/2 gateway route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-http2route
     */
    readonly http2Route?: CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable;

    /**
     * An object that represents the specification of an HTTP gateway route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-httproute
     */
    readonly httpRoute?: CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable;

    /**
     * The ordering of the gateway routes spec.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-priority
     */
    readonly priority?: number;
  }

  /**
   * An object that represents an HTTP gateway route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html
   */
  export interface HttpGatewayRouteProperty {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html#cfn-appmesh-gatewayroute-httpgatewayroute-action
     */
    readonly action: CfnGatewayRoute.HttpGatewayRouteActionProperty | cdk.IResolvable;

    /**
     * An object that represents the criteria for determining a request match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html#cfn-appmesh-gatewayroute-httpgatewayroute-match
     */
    readonly match: CfnGatewayRoute.HttpGatewayRouteMatchProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the action to take if a match is determined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html
   */
  export interface HttpGatewayRouteActionProperty {
    /**
     * The gateway route action to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html#cfn-appmesh-gatewayroute-httpgatewayrouteaction-rewrite
     */
    readonly rewrite?: CfnGatewayRoute.HttpGatewayRouteRewriteProperty | cdk.IResolvable;

    /**
     * An object that represents the target that traffic is routed to when a request matches the gateway route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html#cfn-appmesh-gatewayroute-httpgatewayrouteaction-target
     */
    readonly target: CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable;
  }

  /**
   * An object that represents a gateway route target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html
   */
  export interface GatewayRouteTargetProperty {
    /**
     * The port number of the gateway route target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html#cfn-appmesh-gatewayroute-gatewayroutetarget-port
     */
    readonly port?: number;

    /**
     * An object that represents a virtual service gateway route target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html#cfn-appmesh-gatewayroute-gatewayroutetarget-virtualservice
     */
    readonly virtualService: CfnGatewayRoute.GatewayRouteVirtualServiceProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the virtual service that traffic is routed to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutevirtualservice.html
   */
  export interface GatewayRouteVirtualServiceProperty {
    /**
     * The name of the virtual service that traffic is routed to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutevirtualservice.html#cfn-appmesh-gatewayroute-gatewayroutevirtualservice-virtualservicename
     */
    readonly virtualServiceName: string;
  }

  /**
   * An object representing the gateway route to rewrite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html
   */
  export interface HttpGatewayRouteRewriteProperty {
    /**
     * The host name to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-hostname
     */
    readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable;

    /**
     * The path to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-path
     */
    readonly path?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty | cdk.IResolvable;

    /**
     * The specified beginning characters to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-prefix
     */
    readonly prefix?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the path to rewrite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutepathrewrite.html
   */
  export interface HttpGatewayRoutePathRewriteProperty {
    /**
     * The exact path to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutepathrewrite.html#cfn-appmesh-gatewayroute-httpgatewayroutepathrewrite-exact
     */
    readonly exact?: string;
  }

  /**
   * An object representing the gateway route host name to rewrite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamerewrite.html
   */
  export interface GatewayRouteHostnameRewriteProperty {
    /**
     * The default target host name to write to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamerewrite.html#cfn-appmesh-gatewayroute-gatewayroutehostnamerewrite-defaulttargethostname
     */
    readonly defaultTargetHostname?: string;
  }

  /**
   * An object representing the beginning characters of the route to rewrite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html
   */
  export interface HttpGatewayRoutePrefixRewriteProperty {
    /**
     * The default prefix used to replace the incoming route prefix when rewritten.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouteprefixrewrite-defaultprefix
     */
    readonly defaultPrefix?: string;

    /**
     * The value used to replace the incoming route prefix when rewritten.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouteprefixrewrite-value
     */
    readonly value?: string;
  }

  /**
   * An object that represents the criteria for determining a request match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html
   */
  export interface HttpGatewayRouteMatchProperty {
    /**
     * The client request headers to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-headers
     */
    readonly headers?: Array<CfnGatewayRoute.HttpGatewayRouteHeaderProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The host name to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-hostname
     */
    readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable;

    /**
     * The method to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-method
     */
    readonly method?: string;

    /**
     * The path to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-path
     */
    readonly path?: CfnGatewayRoute.HttpPathMatchProperty | cdk.IResolvable;

    /**
     * The port number to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-port
     */
    readonly port?: number;

    /**
     * Specifies the path to match requests with.
     *
     * This parameter must always start with `/` , which by itself matches all requests to the virtual service name. You can also match for path-based routing of requests. For example, if your virtual service name is `my-service.local` and you want the route to match requests to `my-service.local/metrics` , your prefix should be `/metrics` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-prefix
     */
    readonly prefix?: string;

    /**
     * The query parameter to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-queryparameters
     */
    readonly queryParameters?: Array<cdk.IResolvable | CfnGatewayRoute.QueryParameterProperty> | cdk.IResolvable;
  }

  /**
   * An object representing the path to match in the request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html
   */
  export interface HttpPathMatchProperty {
    /**
     * The exact path to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html#cfn-appmesh-gatewayroute-httppathmatch-exact
     */
    readonly exact?: string;

    /**
     * The regex used to match the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html#cfn-appmesh-gatewayroute-httppathmatch-regex
     */
    readonly regex?: string;
  }

  /**
   * An object that represents the HTTP header in the gateway route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html
   */
  export interface HttpGatewayRouteHeaderProperty {
    /**
     * Specify `True` to match anything except the match criteria.
     *
     * The default value is `False` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-invert
     */
    readonly invert?: boolean | cdk.IResolvable;

    /**
     * An object that represents the method and value to match with the header value sent in a request.
     *
     * Specify one match method.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-match
     */
    readonly match?: CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty | cdk.IResolvable;

    /**
     * A name for the HTTP header in the gateway route that will be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-name
     */
    readonly name: string;
  }

  /**
   * An object that represents the method and value to match with the header value sent in a request.
   *
   * Specify one match method.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html
   */
  export interface HttpGatewayRouteHeaderMatchProperty {
    /**
     * The value sent by the client must match the specified value exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-exact
     */
    readonly exact?: string;

    /**
     * The value sent by the client must begin with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-prefix
     */
    readonly prefix?: string;

    /**
     * An object that represents the range of values to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-range
     */
    readonly range?: CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable;

    /**
     * The value sent by the client must include the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-regex
     */
    readonly regex?: string;

    /**
     * The value sent by the client must end with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-suffix
     */
    readonly suffix?: string;
  }

  /**
   * An object that represents the range of values to match on.
   *
   * The first character of the range is included in the range, though the last character is not. For example, if the range specified were 1-100, only values 1-99 would be matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html
   */
  export interface GatewayRouteRangeMatchProperty {
    /**
     * The end of the range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html#cfn-appmesh-gatewayroute-gatewayrouterangematch-end
     */
    readonly end: number;

    /**
     * The start of the range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html#cfn-appmesh-gatewayroute-gatewayrouterangematch-start
     */
    readonly start: number;
  }

  /**
   * An object representing the gateway route host name to match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html
   */
  export interface GatewayRouteHostnameMatchProperty {
    /**
     * The exact host name to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html#cfn-appmesh-gatewayroute-gatewayroutehostnamematch-exact
     */
    readonly exact?: string;

    /**
     * The specified ending characters of the host name to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html#cfn-appmesh-gatewayroute-gatewayroutehostnamematch-suffix
     */
    readonly suffix?: string;
  }

  /**
   * An object that represents the query parameter in the request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html
   */
  export interface QueryParameterProperty {
    /**
     * The query parameter to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html#cfn-appmesh-gatewayroute-queryparameter-match
     */
    readonly match?: CfnGatewayRoute.HttpQueryParameterMatchProperty | cdk.IResolvable;

    /**
     * A name for the query parameter that will be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html#cfn-appmesh-gatewayroute-queryparameter-name
     */
    readonly name: string;
  }

  /**
   * An object representing the query parameter to match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpqueryparametermatch.html
   */
  export interface HttpQueryParameterMatchProperty {
    /**
     * The exact query parameter to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpqueryparametermatch.html#cfn-appmesh-gatewayroute-httpqueryparametermatch-exact
     */
    readonly exact?: string;
  }

  /**
   * An object that represents a gRPC gateway route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html
   */
  export interface GrpcGatewayRouteProperty {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html#cfn-appmesh-gatewayroute-grpcgatewayroute-action
     */
    readonly action: CfnGatewayRoute.GrpcGatewayRouteActionProperty | cdk.IResolvable;

    /**
     * An object that represents the criteria for determining a request match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html#cfn-appmesh-gatewayroute-grpcgatewayroute-match
     */
    readonly match: CfnGatewayRoute.GrpcGatewayRouteMatchProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the action to take if a match is determined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html
   */
  export interface GrpcGatewayRouteActionProperty {
    /**
     * The gateway route action to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html#cfn-appmesh-gatewayroute-grpcgatewayrouteaction-rewrite
     */
    readonly rewrite?: CfnGatewayRoute.GrpcGatewayRouteRewriteProperty | cdk.IResolvable;

    /**
     * An object that represents the target that traffic is routed to when a request matches the gateway route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html#cfn-appmesh-gatewayroute-grpcgatewayrouteaction-target
     */
    readonly target: CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the gateway route to rewrite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouterewrite.html
   */
  export interface GrpcGatewayRouteRewriteProperty {
    /**
     * The host name of the gateway route to rewrite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouterewrite.html#cfn-appmesh-gatewayroute-grpcgatewayrouterewrite-hostname
     */
    readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the criteria for determining a request match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html
   */
  export interface GrpcGatewayRouteMatchProperty {
    /**
     * The gateway route host name to be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-hostname
     */
    readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable;

    /**
     * The gateway route metadata to be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-metadata
     */
    readonly metadata?: Array<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The gateway route port to be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-port
     */
    readonly port?: number;

    /**
     * The fully qualified domain name for the service to match from the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-servicename
     */
    readonly serviceName?: string;
  }

  /**
   * An object representing the metadata of the gateway route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html
   */
  export interface GrpcGatewayRouteMetadataProperty {
    /**
     * Specify `True` to match anything except the match criteria.
     *
     * The default value is `False` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-invert
     */
    readonly invert?: boolean | cdk.IResolvable;

    /**
     * The criteria for determining a metadata match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-match
     */
    readonly match?: CfnGatewayRoute.GatewayRouteMetadataMatchProperty | cdk.IResolvable;

    /**
     * A name for the gateway route metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-name
     */
    readonly name: string;
  }

  /**
   * An object representing the method header to be matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html
   */
  export interface GatewayRouteMetadataMatchProperty {
    /**
     * The exact method header to be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-exact
     */
    readonly exact?: string;

    /**
     * The specified beginning characters of the method header to be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-prefix
     */
    readonly prefix?: string;

    /**
     * An object that represents the range of values to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-range
     */
    readonly range?: CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable;

    /**
     * The regex used to match the method header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-regex
     */
    readonly regex?: string;

    /**
     * The specified ending characters of the method header to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-suffix
     */
    readonly suffix?: string;
  }
}

/**
 * Properties for defining a `CfnGatewayRoute`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html
 */
export interface CfnGatewayRouteProps {
  /**
   * The name of the gateway route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-gatewayroutename
   */
  readonly gatewayRouteName?: string;

  /**
   * The name of the service mesh that the resource resides in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The specifications of the gateway route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-spec
   */
  readonly spec: CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable;

  /**
   * Optional metadata that you can apply to the gateway route to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The virtual gateway that the gateway route is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-virtualgatewayname
   */
  readonly virtualGatewayName: string;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteVirtualServiceProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteVirtualServiceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteVirtualServicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.requiredValidator)(properties.virtualServiceName));
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.validateString)(properties.virtualServiceName));
  return errors.wrap("supplied properties not correct for \"GatewayRouteVirtualServiceProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteVirtualServicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteVirtualServicePropertyValidator(properties).assertSuccess();
  return {
    "VirtualServiceName": cdk.stringToCloudFormation(properties.virtualServiceName)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteVirtualServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteVirtualServiceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteVirtualServiceProperty>();
  ret.addPropertyResult("virtualServiceName", "VirtualServiceName", (properties.VirtualServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteTargetProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("virtualService", cdk.requiredValidator)(properties.virtualService));
  errors.collect(cdk.propertyValidator("virtualService", CfnGatewayRouteGatewayRouteVirtualServicePropertyValidator)(properties.virtualService));
  return errors.wrap("supplied properties not correct for \"GatewayRouteTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteTargetPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port),
    "VirtualService": convertCfnGatewayRouteGatewayRouteVirtualServicePropertyToCloudFormation(properties.virtualService)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteTargetProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("virtualService", "VirtualService", (properties.VirtualService != null ? CfnGatewayRouteGatewayRouteVirtualServicePropertyFromCloudFormation(properties.VirtualService) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRoutePathRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePathRewriteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePathRewritePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRoutePathRewriteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRoutePathRewritePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRoutePathRewritePropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePathRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteHostnameRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameRewriteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameRewritePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultTargetHostname", cdk.validateString)(properties.defaultTargetHostname));
  return errors.wrap("supplied properties not correct for \"GatewayRouteHostnameRewriteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteHostnameRewritePropertyValidator(properties).assertSuccess();
  return {
    "DefaultTargetHostname": cdk.stringToCloudFormation(properties.defaultTargetHostname)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteHostnameRewriteProperty>();
  ret.addPropertyResult("defaultTargetHostname", "DefaultTargetHostname", (properties.DefaultTargetHostname != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultTargetHostname) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRoutePrefixRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePrefixRewriteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultPrefix", cdk.validateString)(properties.defaultPrefix));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRoutePrefixRewriteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyValidator(properties).assertSuccess();
  return {
    "DefaultPrefix": cdk.stringToCloudFormation(properties.defaultPrefix),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty>();
  ret.addPropertyResult("defaultPrefix", "DefaultPrefix", (properties.DefaultPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultPrefix) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteRewriteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteRewritePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", CfnGatewayRouteGatewayRouteHostnameRewritePropertyValidator)(properties.hostname));
  errors.collect(cdk.propertyValidator("path", CfnGatewayRouteHttpGatewayRoutePathRewritePropertyValidator)(properties.path));
  errors.collect(cdk.propertyValidator("prefix", CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyValidator)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteRewriteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRouteRewritePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRouteRewritePropertyValidator(properties).assertSuccess();
  return {
    "Hostname": convertCfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties.hostname),
    "Path": convertCfnGatewayRouteHttpGatewayRoutePathRewritePropertyToCloudFormation(properties.path),
    "Prefix": convertCfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteRewriteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteRewriteProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties.Hostname) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? CfnGatewayRouteHttpGatewayRoutePathRewritePropertyFromCloudFormation(properties.Path) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyFromCloudFormation(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rewrite", CfnGatewayRouteHttpGatewayRouteRewritePropertyValidator)(properties.rewrite));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", CfnGatewayRouteGatewayRouteTargetPropertyValidator)(properties.target));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRouteActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRouteActionPropertyValidator(properties).assertSuccess();
  return {
    "Rewrite": convertCfnGatewayRouteHttpGatewayRouteRewritePropertyToCloudFormation(properties.rewrite),
    "Target": convertCfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteActionProperty>();
  ret.addPropertyResult("rewrite", "Rewrite", (properties.Rewrite != null ? CfnGatewayRouteHttpGatewayRouteRewritePropertyFromCloudFormation(properties.Rewrite) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpPathMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpPathMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  return errors.wrap("supplied properties not correct for \"HttpPathMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpPathMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpPathMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Regex": cdk.stringToCloudFormation(properties.regex)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpPathMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpPathMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpPathMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteRangeMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteRangeMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteRangeMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.requiredValidator)(properties.end));
  errors.collect(cdk.propertyValidator("end", cdk.validateNumber)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.requiredValidator)(properties.start));
  errors.collect(cdk.propertyValidator("start", cdk.validateNumber)(properties.start));
  return errors.wrap("supplied properties not correct for \"GatewayRouteRangeMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteRangeMatchPropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.numberToCloudFormation(properties.end),
    "Start": cdk.numberToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteRangeMatchProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getNumber(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getNumber(properties.Start) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteHeaderMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("range", CfnGatewayRouteGatewayRouteRangeMatchPropertyValidator)(properties.range));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("suffix", cdk.validateString)(properties.suffix));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteHeaderMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Range": convertCfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties.range),
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "Suffix": cdk.stringToCloudFormation(properties.suffix)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("range", "Range", (properties.Range != null ? CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties.Range) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("suffix", "Suffix", (properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invert", cdk.validateBoolean)(properties.invert));
  errors.collect(cdk.propertyValidator("match", CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRouteHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRouteHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Invert": cdk.booleanToCloudFormation(properties.invert),
    "Match": convertCfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteHeaderProperty>();
  ret.addPropertyResult("invert", "Invert", (properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteHostnameMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("suffix", cdk.validateString)(properties.suffix));
  return errors.wrap("supplied properties not correct for \"GatewayRouteHostnameMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteHostnameMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Suffix": cdk.stringToCloudFormation(properties.suffix)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteHostnameMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("suffix", "Suffix", (properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpQueryParameterMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpQueryParameterMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  return errors.wrap("supplied properties not correct for \"HttpQueryParameterMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpQueryParameterMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpQueryParameterMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpQueryParameterMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpQueryParameterMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryParameterProperty`
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteQueryParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("match", CfnGatewayRouteHttpQueryParameterMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"QueryParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteQueryParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteQueryParameterPropertyValidator(properties).assertSuccess();
  return {
    "Match": convertCfnGatewayRouteHttpQueryParameterMatchPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteQueryParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGatewayRoute.QueryParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.QueryParameterProperty>();
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnGatewayRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(CfnGatewayRouteHttpGatewayRouteHeaderPropertyValidator))(properties.headers));
  errors.collect(cdk.propertyValidator("hostname", CfnGatewayRouteGatewayRouteHostnameMatchPropertyValidator)(properties.hostname));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("path", CfnGatewayRouteHttpPathMatchPropertyValidator)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("queryParameters", cdk.listValidator(CfnGatewayRouteQueryParameterPropertyValidator))(properties.queryParameters));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRouteMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRouteMatchPropertyValidator(properties).assertSuccess();
  return {
    "Headers": cdk.listMapper(convertCfnGatewayRouteHttpGatewayRouteHeaderPropertyToCloudFormation)(properties.headers),
    "Hostname": convertCfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties.hostname),
    "Method": cdk.stringToCloudFormation(properties.method),
    "Path": convertCfnGatewayRouteHttpPathMatchPropertyToCloudFormation(properties.path),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "QueryParameters": cdk.listMapper(convertCfnGatewayRouteQueryParameterPropertyToCloudFormation)(properties.queryParameters)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteMatchProperty>();
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteHttpGatewayRouteHeaderPropertyFromCloudFormation)(properties.Headers) : undefined));
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties.Hostname) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? CfnGatewayRouteHttpPathMatchPropertyFromCloudFormation(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("queryParameters", "QueryParameters", (properties.QueryParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteQueryParameterPropertyFromCloudFormation)(properties.QueryParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnGatewayRouteHttpGatewayRouteActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnGatewayRouteHttpGatewayRouteMatchPropertyValidator)(properties.match));
  return errors.wrap("supplied properties not correct for \"HttpGatewayRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteHttpGatewayRoutePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnGatewayRouteHttpGatewayRouteActionPropertyToCloudFormation(properties.action),
    "Match": convertCfnGatewayRouteHttpGatewayRouteMatchPropertyToCloudFormation(properties.match)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnGatewayRouteHttpGatewayRouteActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnGatewayRouteHttpGatewayRouteMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteRewriteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteRewritePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", CfnGatewayRouteGatewayRouteHostnameRewritePropertyValidator)(properties.hostname));
  return errors.wrap("supplied properties not correct for \"GrpcGatewayRouteRewriteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGrpcGatewayRouteRewritePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGrpcGatewayRouteRewritePropertyValidator(properties).assertSuccess();
  return {
    "Hostname": convertCfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties.hostname)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteRewriteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteRewriteProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties.Hostname) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rewrite", CfnGatewayRouteGrpcGatewayRouteRewritePropertyValidator)(properties.rewrite));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", CfnGatewayRouteGatewayRouteTargetPropertyValidator)(properties.target));
  return errors.wrap("supplied properties not correct for \"GrpcGatewayRouteActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGrpcGatewayRouteActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGrpcGatewayRouteActionPropertyValidator(properties).assertSuccess();
  return {
    "Rewrite": convertCfnGatewayRouteGrpcGatewayRouteRewritePropertyToCloudFormation(properties.rewrite),
    "Target": convertCfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteActionProperty>();
  ret.addPropertyResult("rewrite", "Rewrite", (properties.Rewrite != null ? CfnGatewayRouteGrpcGatewayRouteRewritePropertyFromCloudFormation(properties.Rewrite) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteMetadataMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteMetadataMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteMetadataMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("range", CfnGatewayRouteGatewayRouteRangeMatchPropertyValidator)(properties.range));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("suffix", cdk.validateString)(properties.suffix));
  return errors.wrap("supplied properties not correct for \"GatewayRouteMetadataMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteMetadataMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteMetadataMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Range": convertCfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties.range),
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "Suffix": cdk.stringToCloudFormation(properties.suffix)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteMetadataMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteMetadataMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteMetadataMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("range", "Range", (properties.Range != null ? CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties.Range) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("suffix", "Suffix", (properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invert", cdk.validateBoolean)(properties.invert));
  errors.collect(cdk.propertyValidator("match", CfnGatewayRouteGatewayRouteMetadataMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"GrpcGatewayRouteMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGrpcGatewayRouteMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGrpcGatewayRouteMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Invert": cdk.booleanToCloudFormation(properties.invert),
    "Match": convertCfnGatewayRouteGatewayRouteMetadataMatchPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty>();
  ret.addPropertyResult("invert", "Invert", (properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnGatewayRouteGatewayRouteMetadataMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", CfnGatewayRouteGatewayRouteHostnameMatchPropertyValidator)(properties.hostname));
  errors.collect(cdk.propertyValidator("metadata", cdk.listValidator(CfnGatewayRouteGrpcGatewayRouteMetadataPropertyValidator))(properties.metadata));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  return errors.wrap("supplied properties not correct for \"GrpcGatewayRouteMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGrpcGatewayRouteMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGrpcGatewayRouteMatchPropertyValidator(properties).assertSuccess();
  return {
    "Hostname": convertCfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties.hostname),
    "Metadata": cdk.listMapper(convertCfnGatewayRouteGrpcGatewayRouteMetadataPropertyToCloudFormation)(properties.metadata),
    "Port": cdk.numberToCloudFormation(properties.port),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteMatchProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties.Hostname) : undefined));
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteGrpcGatewayRouteMetadataPropertyFromCloudFormation)(properties.Metadata) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnGatewayRouteGrpcGatewayRouteActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnGatewayRouteGrpcGatewayRouteMatchPropertyValidator)(properties.match));
  return errors.wrap("supplied properties not correct for \"GrpcGatewayRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGrpcGatewayRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGrpcGatewayRoutePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnGatewayRouteGrpcGatewayRouteActionPropertyToCloudFormation(properties.action),
    "Match": convertCfnGatewayRouteGrpcGatewayRouteMatchPropertyToCloudFormation(properties.match)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnGatewayRouteGrpcGatewayRouteActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnGatewayRouteGrpcGatewayRouteMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayRouteSpecProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpcRoute", CfnGatewayRouteGrpcGatewayRoutePropertyValidator)(properties.grpcRoute));
  errors.collect(cdk.propertyValidator("http2Route", CfnGatewayRouteHttpGatewayRoutePropertyValidator)(properties.http2Route));
  errors.collect(cdk.propertyValidator("httpRoute", CfnGatewayRouteHttpGatewayRoutePropertyValidator)(properties.httpRoute));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  return errors.wrap("supplied properties not correct for \"GatewayRouteSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRouteGatewayRouteSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRouteGatewayRouteSpecPropertyValidator(properties).assertSuccess();
  return {
    "GrpcRoute": convertCfnGatewayRouteGrpcGatewayRoutePropertyToCloudFormation(properties.grpcRoute),
    "Http2Route": convertCfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties.http2Route),
    "HttpRoute": convertCfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties.httpRoute),
    "Priority": cdk.numberToCloudFormation(properties.priority)
  };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteSpecProperty>();
  ret.addPropertyResult("grpcRoute", "GrpcRoute", (properties.GrpcRoute != null ? CfnGatewayRouteGrpcGatewayRoutePropertyFromCloudFormation(properties.GrpcRoute) : undefined));
  ret.addPropertyResult("http2Route", "Http2Route", (properties.Http2Route != null ? CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties.Http2Route) : undefined));
  ret.addPropertyResult("httpRoute", "HttpRoute", (properties.HttpRoute != null ? CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties.HttpRoute) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGatewayRouteProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayRouteProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayRoutePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gatewayRouteName", cdk.validateString)(properties.gatewayRouteName));
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnGatewayRouteGatewayRouteSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualGatewayName", cdk.requiredValidator)(properties.virtualGatewayName));
  errors.collect(cdk.propertyValidator("virtualGatewayName", cdk.validateString)(properties.virtualGatewayName));
  return errors.wrap("supplied properties not correct for \"CfnGatewayRouteProps\"");
}

// @ts-ignore TS6133
function convertCfnGatewayRoutePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayRoutePropsValidator(properties).assertSuccess();
  return {
    "GatewayRouteName": cdk.stringToCloudFormation(properties.gatewayRouteName),
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "Spec": convertCfnGatewayRouteGatewayRouteSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualGatewayName": cdk.stringToCloudFormation(properties.virtualGatewayName)
  };
}

// @ts-ignore TS6133
function CfnGatewayRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRouteProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRouteProps>();
  ret.addPropertyResult("gatewayRouteName", "GatewayRouteName", (properties.GatewayRouteName != null ? cfn_parse.FromCloudFormation.getString(properties.GatewayRouteName) : undefined));
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnGatewayRouteGatewayRouteSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualGatewayName", "VirtualGatewayName", (properties.VirtualGatewayName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualGatewayName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a service mesh.
 *
 * A service mesh is a logical boundary for network traffic between services that are represented by resources within the mesh. After you create your service mesh, you can create virtual services, virtual nodes, virtual routers, and routes to distribute traffic between the applications in your mesh.
 *
 * For more information about service meshes, see [Service meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/meshes.html) .
 *
 * @cloudformationResource AWS::AppMesh::Mesh
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html
 */
export class CfnMesh extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::Mesh";

  /**
   * Build a CfnMesh from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMesh {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMeshPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMesh(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the mesh.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the mesh.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name to use for the service mesh.
   */
  public meshName?: string;

  /**
   * The service mesh specification to apply.
   */
  public spec?: cdk.IResolvable | CfnMesh.MeshSpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the service mesh to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMeshProps = {}) {
    super(scope, id, {
      "type": CfnMesh.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::Mesh", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "spec": this.spec,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMesh.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMeshPropsToCloudFormation(props);
  }
}

export namespace CfnMesh {
  /**
   * An object that represents the specification of a service mesh.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html
   */
  export interface MeshSpecProperty {
    /**
     * The egress filter rules for the service mesh.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html#cfn-appmesh-mesh-meshspec-egressfilter
     */
    readonly egressFilter?: CfnMesh.EgressFilterProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html#cfn-appmesh-mesh-meshspec-servicediscovery
     */
    readonly serviceDiscovery?: cdk.IResolvable | CfnMesh.MeshServiceDiscoveryProperty;
  }

  /**
   * An object that represents the egress filter rules for a service mesh.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html
   */
  export interface EgressFilterProperty {
    /**
     * The egress filter type.
     *
     * By default, the type is `DROP_ALL` , which allows egress only from virtual nodes to other defined resources in the service mesh (and any traffic to `*.amazonaws.com` for AWS API calls). You can set the egress filter type to `ALLOW_ALL` to allow egress to any endpoint inside or outside of the service mesh.
     *
     * > If you specify any backends on a virtual node when using `ALLOW_ALL` , you must specifiy all egress for that virtual node as backends. Otherwise, `ALLOW_ALL` will no longer work for that virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html#cfn-appmesh-mesh-egressfilter-type
     */
    readonly type: string;
  }

  /**
   * An object that represents the service discovery information for a service mesh.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshservicediscovery.html
   */
  export interface MeshServiceDiscoveryProperty {
    /**
     * The IP version to use to control traffic within the mesh.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshservicediscovery.html#cfn-appmesh-mesh-meshservicediscovery-ippreference
     */
    readonly ipPreference?: string;
  }
}

/**
 * Properties for defining a `CfnMesh`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html
 */
export interface CfnMeshProps {
  /**
   * The name to use for the service mesh.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-meshname
   */
  readonly meshName?: string;

  /**
   * The service mesh specification to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-spec
   */
  readonly spec?: cdk.IResolvable | CfnMesh.MeshSpecProperty;

  /**
   * Optional metadata that you can apply to the service mesh to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EgressFilterProperty`
 *
 * @param properties - the TypeScript properties of a `EgressFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMeshEgressFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EgressFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnMeshEgressFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMeshEgressFilterPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnMeshEgressFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMesh.EgressFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.EgressFilterProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MeshServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `MeshServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMeshMeshServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipPreference", cdk.validateString)(properties.ipPreference));
  return errors.wrap("supplied properties not correct for \"MeshServiceDiscoveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnMeshMeshServiceDiscoveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMeshMeshServiceDiscoveryPropertyValidator(properties).assertSuccess();
  return {
    "IpPreference": cdk.stringToCloudFormation(properties.ipPreference)
  };
}

// @ts-ignore TS6133
function CfnMeshMeshServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMesh.MeshServiceDiscoveryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.MeshServiceDiscoveryProperty>();
  ret.addPropertyResult("ipPreference", "IpPreference", (properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MeshSpecProperty`
 *
 * @param properties - the TypeScript properties of a `MeshSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMeshMeshSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressFilter", CfnMeshEgressFilterPropertyValidator)(properties.egressFilter));
  errors.collect(cdk.propertyValidator("serviceDiscovery", CfnMeshMeshServiceDiscoveryPropertyValidator)(properties.serviceDiscovery));
  return errors.wrap("supplied properties not correct for \"MeshSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnMeshMeshSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMeshMeshSpecPropertyValidator(properties).assertSuccess();
  return {
    "EgressFilter": convertCfnMeshEgressFilterPropertyToCloudFormation(properties.egressFilter),
    "ServiceDiscovery": convertCfnMeshMeshServiceDiscoveryPropertyToCloudFormation(properties.serviceDiscovery)
  };
}

// @ts-ignore TS6133
function CfnMeshMeshSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMesh.MeshSpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.MeshSpecProperty>();
  ret.addPropertyResult("egressFilter", "EgressFilter", (properties.EgressFilter != null ? CfnMeshEgressFilterPropertyFromCloudFormation(properties.EgressFilter) : undefined));
  ret.addPropertyResult("serviceDiscovery", "ServiceDiscovery", (properties.ServiceDiscovery != null ? CfnMeshMeshServiceDiscoveryPropertyFromCloudFormation(properties.ServiceDiscovery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMeshProps`
 *
 * @param properties - the TypeScript properties of a `CfnMeshProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMeshPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("spec", CfnMeshMeshSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMeshProps\"");
}

// @ts-ignore TS6133
function convertCfnMeshPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMeshPropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "Spec": convertCfnMeshMeshSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMeshPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMeshProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMeshProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnMeshMeshSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a route that is associated with a virtual router.
 *
 * You can route several different protocols and define a retry policy for a route. Traffic can be routed to one or more virtual nodes.
 *
 * For more information about routes, see [Routes](https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html) .
 *
 * @cloudformationResource AWS::AppMesh::Route
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html
 */
export class CfnRoute extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::Route";

  /**
   * Build a CfnRoute from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoute {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoutePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoute(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the route.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the route resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The name of the route.
   *
   * @cloudformationAttribute RouteName
   */
  public readonly attrRouteName: string;

  /**
   * The unique identifier for the route.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual router that the route is associated with.
   *
   * @cloudformationAttribute VirtualRouterName
   */
  public readonly attrVirtualRouterName: string;

  /**
   * The name of the service mesh to create the route in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The name to use for the route.
   */
  public routeName?: string;

  /**
   * The route specification to apply.
   */
  public spec: cdk.IResolvable | CfnRoute.RouteSpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the route to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the virtual router in which to create the route.
   */
  public virtualRouterName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRouteProps) {
    super(scope, id, {
      "type": CfnRoute.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);
    cdk.requireProperty(props, "virtualRouterName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrRouteName = cdk.Token.asString(this.getAtt("RouteName", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualRouterName = cdk.Token.asString(this.getAtt("VirtualRouterName", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.routeName = props.routeName;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::Route", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualRouterName = props.virtualRouterName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "routeName": this.routeName,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualRouterName": this.virtualRouterName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoute.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoutePropsToCloudFormation(props);
  }
}

export namespace CfnRoute {
  /**
   * An object that represents a route specification.
   *
   * Specify one route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html
   */
  export interface RouteSpecProperty {
    /**
     * An object that represents the specification of a gRPC route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-grpcroute
     */
    readonly grpcRoute?: CfnRoute.GrpcRouteProperty | cdk.IResolvable;

    /**
     * An object that represents the specification of an HTTP/2 route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-http2route
     */
    readonly http2Route?: CfnRoute.HttpRouteProperty | cdk.IResolvable;

    /**
     * An object that represents the specification of an HTTP route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-httproute
     */
    readonly httpRoute?: CfnRoute.HttpRouteProperty | cdk.IResolvable;

    /**
     * The priority for the route.
     *
     * Routes are matched based on the specified value, where 0 is the highest priority.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-priority
     */
    readonly priority?: number;

    /**
     * An object that represents the specification of a TCP route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-tcproute
     */
    readonly tcpRoute?: cdk.IResolvable | CfnRoute.TcpRouteProperty;
  }

  /**
   * An object that represents an HTTP or HTTP/2 route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html
   */
  export interface HttpRouteProperty {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-action
     */
    readonly action: CfnRoute.HttpRouteActionProperty | cdk.IResolvable;

    /**
     * An object that represents the criteria for determining a request match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-match
     */
    readonly match: CfnRoute.HttpRouteMatchProperty | cdk.IResolvable;

    /**
     * An object that represents a retry policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-retrypolicy
     */
    readonly retryPolicy?: CfnRoute.HttpRetryPolicyProperty | cdk.IResolvable;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-timeout
     */
    readonly timeout?: CfnRoute.HttpTimeoutProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the action to take if a match is determined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteaction.html
   */
  export interface HttpRouteActionProperty {
    /**
     * An object that represents the targets that traffic is routed to when a request matches the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteaction.html#cfn-appmesh-route-httprouteaction-weightedtargets
     */
    readonly weightedTargets: Array<cdk.IResolvable | CfnRoute.WeightedTargetProperty> | cdk.IResolvable;
  }

  /**
   * An object that represents a target and its relative weight.
   *
   * Traffic is distributed across targets according to their relative weight. For example, a weighted target with a relative weight of 50 receives five times as much traffic as one with a relative weight of 10. The total weight for all targets combined must be less than or equal to 100.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html
   */
  export interface WeightedTargetProperty {
    /**
     * The targeted port of the weighted object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-port
     */
    readonly port?: number;

    /**
     * The virtual node to associate with the weighted target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-virtualnode
     */
    readonly virtualNode: string;

    /**
     * The relative weight of the weighted target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-weight
     */
    readonly weight: number;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html
   */
  export interface HttpTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html#cfn-appmesh-route-httptimeout-idle
     */
    readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;

    /**
     * An object that represents a per request timeout.
     *
     * The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html#cfn-appmesh-route-httptimeout-perrequest
     */
    readonly perRequest?: CfnRoute.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object that represents a duration of time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html
   */
  export interface DurationProperty {
    /**
     * A unit of time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html#cfn-appmesh-route-duration-unit
     */
    readonly unit: string;

    /**
     * A number of time units.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html#cfn-appmesh-route-duration-value
     */
    readonly value: number;
  }

  /**
   * An object that represents a retry policy.
   *
   * Specify at least one value for at least one of the types of `RetryEvents` , a value for `maxRetries` , and a value for `perRetryTimeout` . Both `server-error` and `gateway-error` under `httpRetryEvents` include the Envoy `reset` policy. For more information on the `reset` policy, see the [Envoy documentation](https://docs.aws.amazon.com/https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html
   */
  export interface HttpRetryPolicyProperty {
    /**
     * Specify at least one of the following values.
     *
     * - *server-error* – HTTP status codes 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, and 511
     * - *gateway-error* – HTTP status codes 502, 503, and 504
     * - *client-error* – HTTP status code 409
     * - *stream-error* – Retry on refused stream
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-httpretryevents
     */
    readonly httpRetryEvents?: Array<string>;

    /**
     * The maximum number of retry attempts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-maxretries
     */
    readonly maxRetries: number;

    /**
     * The timeout for each retry attempt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-perretrytimeout
     */
    readonly perRetryTimeout: CfnRoute.DurationProperty | cdk.IResolvable;

    /**
     * Specify a valid value.
     *
     * The event occurs before any processing of a request has started and is encountered when the upstream is temporarily or permanently unavailable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-tcpretryevents
     */
    readonly tcpRetryEvents?: Array<string>;
  }

  /**
   * An object that represents the requirements for a route to match HTTP requests for a virtual router.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html
   */
  export interface HttpRouteMatchProperty {
    /**
     * The client request headers to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-headers
     */
    readonly headers?: Array<CfnRoute.HttpRouteHeaderProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The client request method to match on.
     *
     * Specify only one.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-method
     */
    readonly method?: string;

    /**
     * The client request path to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-path
     */
    readonly path?: CfnRoute.HttpPathMatchProperty | cdk.IResolvable;

    /**
     * The port number to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-port
     */
    readonly port?: number;

    /**
     * Specifies the path to match requests with.
     *
     * This parameter must always start with `/` , which by itself matches all requests to the virtual service name. You can also match for path-based routing of requests. For example, if your virtual service name is `my-service.local` and you want the route to match requests to `my-service.local/metrics` , your prefix should be `/metrics` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-prefix
     */
    readonly prefix?: string;

    /**
     * The client request query parameters to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-queryparameters
     */
    readonly queryParameters?: Array<cdk.IResolvable | CfnRoute.QueryParameterProperty> | cdk.IResolvable;

    /**
     * The client request scheme to match on.
     *
     * Specify only one. Applicable only for HTTP2 routes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-scheme
     */
    readonly scheme?: string;
  }

  /**
   * An object representing the path to match in the request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html
   */
  export interface HttpPathMatchProperty {
    /**
     * The exact path to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html#cfn-appmesh-route-httppathmatch-exact
     */
    readonly exact?: string;

    /**
     * The regex used to match the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html#cfn-appmesh-route-httppathmatch-regex
     */
    readonly regex?: string;
  }

  /**
   * An object that represents the HTTP header in the request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html
   */
  export interface HttpRouteHeaderProperty {
    /**
     * Specify `True` to match anything except the match criteria.
     *
     * The default value is `False` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-invert
     */
    readonly invert?: boolean | cdk.IResolvable;

    /**
     * The `HeaderMatchMethod` object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-match
     */
    readonly match?: CfnRoute.HeaderMatchMethodProperty | cdk.IResolvable;

    /**
     * A name for the HTTP header in the client request that will be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-name
     */
    readonly name: string;
  }

  /**
   * An object that represents the method and value to match with the header value sent in a request.
   *
   * Specify one match method.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html
   */
  export interface HeaderMatchMethodProperty {
    /**
     * The value sent by the client must match the specified value exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-exact
     */
    readonly exact?: string;

    /**
     * The value sent by the client must begin with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-prefix
     */
    readonly prefix?: string;

    /**
     * An object that represents the range of values to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-range
     */
    readonly range?: cdk.IResolvable | CfnRoute.MatchRangeProperty;

    /**
     * The value sent by the client must include the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-regex
     */
    readonly regex?: string;

    /**
     * The value sent by the client must end with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-suffix
     */
    readonly suffix?: string;
  }

  /**
   * An object that represents the range of values to match on.
   *
   * The first character of the range is included in the range, though the last character is not. For example, if the range specified were 1-100, only values 1-99 would be matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html
   */
  export interface MatchRangeProperty {
    /**
     * The end of the range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html#cfn-appmesh-route-matchrange-end
     */
    readonly end: number;

    /**
     * The start of the range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html#cfn-appmesh-route-matchrange-start
     */
    readonly start: number;
  }

  /**
   * An object that represents the query parameter in the request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html
   */
  export interface QueryParameterProperty {
    /**
     * The query parameter to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html#cfn-appmesh-route-queryparameter-match
     */
    readonly match?: CfnRoute.HttpQueryParameterMatchProperty | cdk.IResolvable;

    /**
     * A name for the query parameter that will be matched on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html#cfn-appmesh-route-queryparameter-name
     */
    readonly name: string;
  }

  /**
   * An object representing the query parameter to match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpqueryparametermatch.html
   */
  export interface HttpQueryParameterMatchProperty {
    /**
     * The exact query parameter to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpqueryparametermatch.html#cfn-appmesh-route-httpqueryparametermatch-exact
     */
    readonly exact?: string;
  }

  /**
   * An object that represents a gRPC route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html
   */
  export interface GrpcRouteProperty {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-action
     */
    readonly action: CfnRoute.GrpcRouteActionProperty | cdk.IResolvable;

    /**
     * An object that represents the criteria for determining a request match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-match
     */
    readonly match: CfnRoute.GrpcRouteMatchProperty | cdk.IResolvable;

    /**
     * An object that represents a retry policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-retrypolicy
     */
    readonly retryPolicy?: CfnRoute.GrpcRetryPolicyProperty | cdk.IResolvable;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-timeout
     */
    readonly timeout?: CfnRoute.GrpcTimeoutProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the action to take if a match is determined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcrouteaction.html
   */
  export interface GrpcRouteActionProperty {
    /**
     * An object that represents the targets that traffic is routed to when a request matches the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcrouteaction.html#cfn-appmesh-route-grpcrouteaction-weightedtargets
     */
    readonly weightedTargets: Array<cdk.IResolvable | CfnRoute.WeightedTargetProperty> | cdk.IResolvable;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html
   */
  export interface GrpcTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html#cfn-appmesh-route-grpctimeout-idle
     */
    readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;

    /**
     * An object that represents a per request timeout.
     *
     * The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html#cfn-appmesh-route-grpctimeout-perrequest
     */
    readonly perRequest?: CfnRoute.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object that represents a retry policy.
   *
   * Specify at least one value for at least one of the types of `RetryEvents` , a value for `maxRetries` , and a value for `perRetryTimeout` . Both `server-error` and `gateway-error` under `httpRetryEvents` include the Envoy `reset` policy. For more information on the `reset` policy, see the [Envoy documentation](https://docs.aws.amazon.com/https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html
   */
  export interface GrpcRetryPolicyProperty {
    /**
     * Specify at least one of the valid values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-grpcretryevents
     */
    readonly grpcRetryEvents?: Array<string>;

    /**
     * Specify at least one of the following values.
     *
     * - *server-error* – HTTP status codes 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, and 511
     * - *gateway-error* – HTTP status codes 502, 503, and 504
     * - *client-error* – HTTP status code 409
     * - *stream-error* – Retry on refused stream
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-httpretryevents
     */
    readonly httpRetryEvents?: Array<string>;

    /**
     * The maximum number of retry attempts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-maxretries
     */
    readonly maxRetries: number;

    /**
     * The timeout for each retry attempt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-perretrytimeout
     */
    readonly perRetryTimeout: CfnRoute.DurationProperty | cdk.IResolvable;

    /**
     * Specify a valid value.
     *
     * The event occurs before any processing of a request has started and is encountered when the upstream is temporarily or permanently unavailable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-tcpretryevents
     */
    readonly tcpRetryEvents?: Array<string>;
  }

  /**
   * An object that represents the criteria for determining a request match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html
   */
  export interface GrpcRouteMatchProperty {
    /**
     * An object that represents the data to match from the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-metadata
     */
    readonly metadata?: Array<CfnRoute.GrpcRouteMetadataProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The method name to match from the request.
     *
     * If you specify a name, you must also specify a `serviceName` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-methodname
     */
    readonly methodName?: string;

    /**
     * The port number to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-port
     */
    readonly port?: number;

    /**
     * The fully qualified domain name for the service to match from the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-servicename
     */
    readonly serviceName?: string;
  }

  /**
   * An object that represents the match metadata for the route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html
   */
  export interface GrpcRouteMetadataProperty {
    /**
     * Specify `True` to match anything except the match criteria.
     *
     * The default value is `False` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-invert
     */
    readonly invert?: boolean | cdk.IResolvable;

    /**
     * An object that represents the data to match from the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-match
     */
    readonly match?: CfnRoute.GrpcRouteMetadataMatchMethodProperty | cdk.IResolvable;

    /**
     * The name of the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-name
     */
    readonly name: string;
  }

  /**
   * An object that represents the match method.
   *
   * Specify one of the match values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html
   */
  export interface GrpcRouteMetadataMatchMethodProperty {
    /**
     * The value sent by the client must match the specified value exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-exact
     */
    readonly exact?: string;

    /**
     * The value sent by the client must begin with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-prefix
     */
    readonly prefix?: string;

    /**
     * An object that represents the range of values to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-range
     */
    readonly range?: cdk.IResolvable | CfnRoute.MatchRangeProperty;

    /**
     * The value sent by the client must include the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-regex
     */
    readonly regex?: string;

    /**
     * The value sent by the client must end with the specified characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-suffix
     */
    readonly suffix?: string;
  }

  /**
   * An object that represents a TCP route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html
   */
  export interface TcpRouteProperty {
    /**
     * The action to take if a match is determined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-action
     */
    readonly action: cdk.IResolvable | CfnRoute.TcpRouteActionProperty;

    /**
     * An object that represents the criteria for determining a request match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-match
     */
    readonly match?: cdk.IResolvable | CfnRoute.TcpRouteMatchProperty;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-timeout
     */
    readonly timeout?: cdk.IResolvable | CfnRoute.TcpTimeoutProperty;
  }

  /**
   * An object that represents the action to take if a match is determined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcprouteaction.html
   */
  export interface TcpRouteActionProperty {
    /**
     * An object that represents the targets that traffic is routed to when a request matches the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcprouteaction.html#cfn-appmesh-route-tcprouteaction-weightedtargets
     */
    readonly weightedTargets: Array<cdk.IResolvable | CfnRoute.WeightedTargetProperty> | cdk.IResolvable;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcptimeout.html
   */
  export interface TcpTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcptimeout.html#cfn-appmesh-route-tcptimeout-idle
     */
    readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object representing the TCP route to match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproutematch.html
   */
  export interface TcpRouteMatchProperty {
    /**
     * The port number to match on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproutematch.html#cfn-appmesh-route-tcproutematch-port
     */
    readonly port?: number;
  }
}

/**
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html
 */
export interface CfnRouteProps {
  /**
   * The name of the service mesh to create the route in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The name to use for the route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-routename
   */
  readonly routeName?: string;

  /**
   * The route specification to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-spec
   */
  readonly spec: cdk.IResolvable | CfnRoute.RouteSpecProperty;

  /**
   * Optional metadata that you can apply to the route to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the virtual router in which to create the route.
   *
   * If the virtual router is in a shared mesh, then you must be the owner of the virtual router resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-virtualroutername
   */
  readonly virtualRouterName: string;
}

/**
 * Determine whether the given properties match those of a `WeightedTargetProperty`
 *
 * @param properties - the TypeScript properties of a `WeightedTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteWeightedTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("virtualNode", cdk.requiredValidator)(properties.virtualNode));
  errors.collect(cdk.propertyValidator("virtualNode", cdk.validateString)(properties.virtualNode));
  errors.collect(cdk.propertyValidator("weight", cdk.requiredValidator)(properties.weight));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"WeightedTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteWeightedTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteWeightedTargetPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port),
    "VirtualNode": cdk.stringToCloudFormation(properties.virtualNode),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnRouteWeightedTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.WeightedTargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.WeightedTargetProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("virtualNode", "VirtualNode", (properties.VirtualNode != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualNode) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.requiredValidator)(properties.weightedTargets));
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.listValidator(CfnRouteWeightedTargetPropertyValidator))(properties.weightedTargets));
  return errors.wrap("supplied properties not correct for \"HttpRouteActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpRouteActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpRouteActionPropertyValidator(properties).assertSuccess();
  return {
    "WeightedTargets": cdk.listMapper(convertCfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteActionProperty>();
  ret.addPropertyResult("weightedTargets", "WeightedTargets", (properties.WeightedTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DurationProperty`
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteDurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"DurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteDurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteDurationPropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRouteDurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.DurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.DurationProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnRouteDurationPropertyValidator)(properties.idle));
  errors.collect(cdk.propertyValidator("perRequest", CfnRouteDurationPropertyValidator)(properties.perRequest));
  return errors.wrap("supplied properties not correct for \"HttpTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnRouteDurationPropertyToCloudFormation(properties.idle),
    "PerRequest": convertCfnRouteDurationPropertyToCloudFormation(properties.perRequest)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpTimeoutProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addPropertyResult("perRequest", "PerRequest", (properties.PerRequest != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpRetryEvents", cdk.listValidator(cdk.validateString))(properties.httpRetryEvents));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.requiredValidator)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("perRetryTimeout", cdk.requiredValidator)(properties.perRetryTimeout));
  errors.collect(cdk.propertyValidator("perRetryTimeout", CfnRouteDurationPropertyValidator)(properties.perRetryTimeout));
  errors.collect(cdk.propertyValidator("tcpRetryEvents", cdk.listValidator(cdk.validateString))(properties.tcpRetryEvents));
  return errors.wrap("supplied properties not correct for \"HttpRetryPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpRetryPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpRetryPolicyPropertyValidator(properties).assertSuccess();
  return {
    "HttpRetryEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.httpRetryEvents),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "PerRetryTimeout": convertCfnRouteDurationPropertyToCloudFormation(properties.perRetryTimeout),
    "TcpRetryEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.tcpRetryEvents)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRetryPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRetryPolicyProperty>();
  ret.addPropertyResult("httpRetryEvents", "HttpRetryEvents", (properties.HttpRetryEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HttpRetryEvents) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("perRetryTimeout", "PerRetryTimeout", (properties.PerRetryTimeout != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRetryTimeout) : undefined));
  ret.addPropertyResult("tcpRetryEvents", "TcpRetryEvents", (properties.TcpRetryEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TcpRetryEvents) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpPathMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpPathMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  return errors.wrap("supplied properties not correct for \"HttpPathMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpPathMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpPathMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Regex": cdk.stringToCloudFormation(properties.regex)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpPathMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpPathMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpPathMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchRangeProperty`
 *
 * @param properties - the TypeScript properties of a `MatchRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteMatchRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.requiredValidator)(properties.end));
  errors.collect(cdk.propertyValidator("end", cdk.validateNumber)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.requiredValidator)(properties.start));
  errors.collect(cdk.propertyValidator("start", cdk.validateNumber)(properties.start));
  return errors.wrap("supplied properties not correct for \"MatchRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteMatchRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteMatchRangePropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.numberToCloudFormation(properties.end),
    "Start": cdk.numberToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnRouteMatchRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.MatchRangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.MatchRangeProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getNumber(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getNumber(properties.Start) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderMatchMethodProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchMethodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHeaderMatchMethodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("range", CfnRouteMatchRangePropertyValidator)(properties.range));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("suffix", cdk.validateString)(properties.suffix));
  return errors.wrap("supplied properties not correct for \"HeaderMatchMethodProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHeaderMatchMethodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHeaderMatchMethodPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Range": convertCfnRouteMatchRangePropertyToCloudFormation(properties.range),
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "Suffix": cdk.stringToCloudFormation(properties.suffix)
  };
}

// @ts-ignore TS6133
function CfnRouteHeaderMatchMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HeaderMatchMethodProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HeaderMatchMethodProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("range", "Range", (properties.Range != null ? CfnRouteMatchRangePropertyFromCloudFormation(properties.Range) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("suffix", "Suffix", (properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRouteHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpRouteHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invert", cdk.validateBoolean)(properties.invert));
  errors.collect(cdk.propertyValidator("match", CfnRouteHeaderMatchMethodPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"HttpRouteHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpRouteHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpRouteHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Invert": cdk.booleanToCloudFormation(properties.invert),
    "Match": convertCfnRouteHeaderMatchMethodPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteHeaderProperty>();
  ret.addPropertyResult("invert", "Invert", (properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteHeaderMatchMethodPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpQueryParameterMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpQueryParameterMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  return errors.wrap("supplied properties not correct for \"HttpQueryParameterMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpQueryParameterMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpQueryParameterMatchPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpQueryParameterMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpQueryParameterMatchProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryParameterProperty`
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteQueryParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("match", CfnRouteHttpQueryParameterMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"QueryParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteQueryParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteQueryParameterPropertyValidator(properties).assertSuccess();
  return {
    "Match": convertCfnRouteHttpQueryParameterMatchPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRouteQueryParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.QueryParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.QueryParameterProperty>();
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(CfnRouteHttpRouteHeaderPropertyValidator))(properties.headers));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("path", CfnRouteHttpPathMatchPropertyValidator)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("queryParameters", cdk.listValidator(CfnRouteQueryParameterPropertyValidator))(properties.queryParameters));
  errors.collect(cdk.propertyValidator("scheme", cdk.validateString)(properties.scheme));
  return errors.wrap("supplied properties not correct for \"HttpRouteMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpRouteMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpRouteMatchPropertyValidator(properties).assertSuccess();
  return {
    "Headers": cdk.listMapper(convertCfnRouteHttpRouteHeaderPropertyToCloudFormation)(properties.headers),
    "Method": cdk.stringToCloudFormation(properties.method),
    "Path": convertCfnRouteHttpPathMatchPropertyToCloudFormation(properties.path),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "QueryParameters": cdk.listMapper(convertCfnRouteQueryParameterPropertyToCloudFormation)(properties.queryParameters),
    "Scheme": cdk.stringToCloudFormation(properties.scheme)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteMatchProperty>();
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteHttpRouteHeaderPropertyFromCloudFormation)(properties.Headers) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? CfnRouteHttpPathMatchPropertyFromCloudFormation(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("queryParameters", "QueryParameters", (properties.QueryParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteQueryParameterPropertyFromCloudFormation)(properties.QueryParameters) : undefined));
  ret.addPropertyResult("scheme", "Scheme", (properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRouteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteHttpRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnRouteHttpRouteActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnRouteHttpRouteMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("retryPolicy", CfnRouteHttpRetryPolicyPropertyValidator)(properties.retryPolicy));
  errors.collect(cdk.propertyValidator("timeout", CfnRouteHttpTimeoutPropertyValidator)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"HttpRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteHttpRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteHttpRoutePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRouteHttpRouteActionPropertyToCloudFormation(properties.action),
    "Match": convertCfnRouteHttpRouteMatchPropertyToCloudFormation(properties.match),
    "RetryPolicy": convertCfnRouteHttpRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
    "Timeout": convertCfnRouteHttpTimeoutPropertyToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnRouteHttpRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRouteHttpRouteActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteHttpRouteMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("retryPolicy", "RetryPolicy", (properties.RetryPolicy != null ? CfnRouteHttpRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? CfnRouteHttpTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.requiredValidator)(properties.weightedTargets));
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.listValidator(CfnRouteWeightedTargetPropertyValidator))(properties.weightedTargets));
  return errors.wrap("supplied properties not correct for \"GrpcRouteActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRouteActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRouteActionPropertyValidator(properties).assertSuccess();
  return {
    "WeightedTargets": cdk.listMapper(convertCfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteActionProperty>();
  ret.addPropertyResult("weightedTargets", "WeightedTargets", (properties.WeightedTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnRouteDurationPropertyValidator)(properties.idle));
  errors.collect(cdk.propertyValidator("perRequest", CfnRouteDurationPropertyValidator)(properties.perRequest));
  return errors.wrap("supplied properties not correct for \"GrpcTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnRouteDurationPropertyToCloudFormation(properties.idle),
    "PerRequest": convertCfnRouteDurationPropertyToCloudFormation(properties.perRequest)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcTimeoutProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addPropertyResult("perRequest", "PerRequest", (properties.PerRequest != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpcRetryEvents", cdk.listValidator(cdk.validateString))(properties.grpcRetryEvents));
  errors.collect(cdk.propertyValidator("httpRetryEvents", cdk.listValidator(cdk.validateString))(properties.httpRetryEvents));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.requiredValidator)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("perRetryTimeout", cdk.requiredValidator)(properties.perRetryTimeout));
  errors.collect(cdk.propertyValidator("perRetryTimeout", CfnRouteDurationPropertyValidator)(properties.perRetryTimeout));
  errors.collect(cdk.propertyValidator("tcpRetryEvents", cdk.listValidator(cdk.validateString))(properties.tcpRetryEvents));
  return errors.wrap("supplied properties not correct for \"GrpcRetryPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRetryPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRetryPolicyPropertyValidator(properties).assertSuccess();
  return {
    "GrpcRetryEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.grpcRetryEvents),
    "HttpRetryEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.httpRetryEvents),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "PerRetryTimeout": convertCfnRouteDurationPropertyToCloudFormation(properties.perRetryTimeout),
    "TcpRetryEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.tcpRetryEvents)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRetryPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRetryPolicyProperty>();
  ret.addPropertyResult("grpcRetryEvents", "GrpcRetryEvents", (properties.GrpcRetryEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.GrpcRetryEvents) : undefined));
  ret.addPropertyResult("httpRetryEvents", "HttpRetryEvents", (properties.HttpRetryEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HttpRetryEvents) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("perRetryTimeout", "PerRetryTimeout", (properties.PerRetryTimeout != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRetryTimeout) : undefined));
  ret.addPropertyResult("tcpRetryEvents", "TcpRetryEvents", (properties.TcpRetryEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TcpRetryEvents) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMetadataMatchMethodProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataMatchMethodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataMatchMethodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("range", CfnRouteMatchRangePropertyValidator)(properties.range));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("suffix", cdk.validateString)(properties.suffix));
  return errors.wrap("supplied properties not correct for \"GrpcRouteMetadataMatchMethodProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRouteMetadataMatchMethodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRouteMetadataMatchMethodPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Range": convertCfnRouteMatchRangePropertyToCloudFormation(properties.range),
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "Suffix": cdk.stringToCloudFormation(properties.suffix)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataMatchMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMetadataMatchMethodProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMetadataMatchMethodProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("range", "Range", (properties.Range != null ? CfnRouteMatchRangePropertyFromCloudFormation(properties.Range) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("suffix", "Suffix", (properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invert", cdk.validateBoolean)(properties.invert));
  errors.collect(cdk.propertyValidator("match", CfnRouteGrpcRouteMetadataMatchMethodPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"GrpcRouteMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRouteMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRouteMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Invert": cdk.booleanToCloudFormation(properties.invert),
    "Match": convertCfnRouteGrpcRouteMetadataMatchMethodPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMetadataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMetadataProperty>();
  ret.addPropertyResult("invert", "Invert", (properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteGrpcRouteMetadataMatchMethodPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metadata", cdk.listValidator(CfnRouteGrpcRouteMetadataPropertyValidator))(properties.metadata));
  errors.collect(cdk.propertyValidator("methodName", cdk.validateString)(properties.methodName));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  return errors.wrap("supplied properties not correct for \"GrpcRouteMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRouteMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRouteMatchPropertyValidator(properties).assertSuccess();
  return {
    "Metadata": cdk.listMapper(convertCfnRouteGrpcRouteMetadataPropertyToCloudFormation)(properties.metadata),
    "MethodName": cdk.stringToCloudFormation(properties.methodName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMatchProperty>();
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteGrpcRouteMetadataPropertyFromCloudFormation)(properties.Metadata) : undefined));
  ret.addPropertyResult("methodName", "MethodName", (properties.MethodName != null ? cfn_parse.FromCloudFormation.getString(properties.MethodName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcRouteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteGrpcRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnRouteGrpcRouteActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnRouteGrpcRouteMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("retryPolicy", CfnRouteGrpcRetryPolicyPropertyValidator)(properties.retryPolicy));
  errors.collect(cdk.propertyValidator("timeout", CfnRouteGrpcTimeoutPropertyValidator)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"GrpcRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteGrpcRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteGrpcRoutePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRouteGrpcRouteActionPropertyToCloudFormation(properties.action),
    "Match": convertCfnRouteGrpcRouteMatchPropertyToCloudFormation(properties.match),
    "RetryPolicy": convertCfnRouteGrpcRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
    "Timeout": convertCfnRouteGrpcTimeoutPropertyToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnRouteGrpcRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRouteGrpcRouteActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteGrpcRouteMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("retryPolicy", "RetryPolicy", (properties.RetryPolicy != null ? CfnRouteGrpcRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? CfnRouteGrpcTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TcpRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteTcpRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.requiredValidator)(properties.weightedTargets));
  errors.collect(cdk.propertyValidator("weightedTargets", cdk.listValidator(CfnRouteWeightedTargetPropertyValidator))(properties.weightedTargets));
  return errors.wrap("supplied properties not correct for \"TcpRouteActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteTcpRouteActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteTcpRouteActionPropertyValidator(properties).assertSuccess();
  return {
    "WeightedTargets": cdk.listMapper(convertCfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets)
  };
}

// @ts-ignore TS6133
function CfnRouteTcpRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.TcpRouteActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteActionProperty>();
  ret.addPropertyResult("weightedTargets", "WeightedTargets", (properties.WeightedTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TcpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteTcpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnRouteDurationPropertyValidator)(properties.idle));
  return errors.wrap("supplied properties not correct for \"TcpTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteTcpTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteTcpTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnRouteDurationPropertyToCloudFormation(properties.idle)
  };
}

// @ts-ignore TS6133
function CfnRouteTcpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.TcpTimeoutProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TcpRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteTcpRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"TcpRouteMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteTcpRouteMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteTcpRouteMatchPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnRouteTcpRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.TcpRouteMatchProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteMatchProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TcpRouteProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteTcpRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnRouteTcpRouteActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("match", CfnRouteTcpRouteMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("timeout", CfnRouteTcpTimeoutPropertyValidator)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"TcpRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteTcpRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteTcpRoutePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRouteTcpRouteActionPropertyToCloudFormation(properties.action),
    "Match": convertCfnRouteTcpRouteMatchPropertyToCloudFormation(properties.match),
    "Timeout": convertCfnRouteTcpTimeoutPropertyToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnRouteTcpRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.TcpRouteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRouteTcpRouteActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRouteTcpRouteMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? CfnRouteTcpTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteSpecProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteRouteSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpcRoute", CfnRouteGrpcRoutePropertyValidator)(properties.grpcRoute));
  errors.collect(cdk.propertyValidator("http2Route", CfnRouteHttpRoutePropertyValidator)(properties.http2Route));
  errors.collect(cdk.propertyValidator("httpRoute", CfnRouteHttpRoutePropertyValidator)(properties.httpRoute));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("tcpRoute", CfnRouteTcpRoutePropertyValidator)(properties.tcpRoute));
  return errors.wrap("supplied properties not correct for \"RouteSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteRouteSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteRouteSpecPropertyValidator(properties).assertSuccess();
  return {
    "GrpcRoute": convertCfnRouteGrpcRoutePropertyToCloudFormation(properties.grpcRoute),
    "Http2Route": convertCfnRouteHttpRoutePropertyToCloudFormation(properties.http2Route),
    "HttpRoute": convertCfnRouteHttpRoutePropertyToCloudFormation(properties.httpRoute),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "TcpRoute": convertCfnRouteTcpRoutePropertyToCloudFormation(properties.tcpRoute)
  };
}

// @ts-ignore TS6133
function CfnRouteRouteSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.RouteSpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.RouteSpecProperty>();
  ret.addPropertyResult("grpcRoute", "GrpcRoute", (properties.GrpcRoute != null ? CfnRouteGrpcRoutePropertyFromCloudFormation(properties.GrpcRoute) : undefined));
  ret.addPropertyResult("http2Route", "Http2Route", (properties.Http2Route != null ? CfnRouteHttpRoutePropertyFromCloudFormation(properties.Http2Route) : undefined));
  ret.addPropertyResult("httpRoute", "HttpRoute", (properties.HttpRoute != null ? CfnRouteHttpRoutePropertyFromCloudFormation(properties.HttpRoute) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("tcpRoute", "TcpRoute", (properties.TcpRoute != null ? CfnRouteTcpRoutePropertyFromCloudFormation(properties.TcpRoute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRouteProps`
 *
 * @param properties - the TypeScript properties of a `CfnRouteProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("routeName", cdk.validateString)(properties.routeName));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnRouteRouteSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualRouterName", cdk.requiredValidator)(properties.virtualRouterName));
  errors.collect(cdk.propertyValidator("virtualRouterName", cdk.validateString)(properties.virtualRouterName));
  return errors.wrap("supplied properties not correct for \"CfnRouteProps\"");
}

// @ts-ignore TS6133
function convertCfnRoutePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutePropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "RouteName": cdk.stringToCloudFormation(properties.routeName),
    "Spec": convertCfnRouteRouteSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualRouterName": cdk.stringToCloudFormation(properties.virtualRouterName)
  };
}

// @ts-ignore TS6133
function CfnRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("routeName", "RouteName", (properties.RouteName != null ? cfn_parse.FromCloudFormation.getString(properties.RouteName) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnRouteRouteSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualRouterName", "VirtualRouterName", (properties.VirtualRouterName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a virtual gateway.
 *
 * A virtual gateway allows resources outside your mesh to communicate to resources that are inside your mesh. The virtual gateway represents an Envoy proxy running in an Amazon ECS task, in a Kubernetes service, or on an Amazon EC2 instance. Unlike a virtual node, which represents an Envoy running with an application, a virtual gateway represents Envoy deployed by itself.
 *
 * For more information about virtual gateways, see [Virtual gateways](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_gateways.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualGateway
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html
 */
export class CfnVirtualGateway extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::VirtualGateway";

  /**
   * Build a CfnVirtualGateway from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualGateway {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVirtualGatewayPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVirtualGateway(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the virtual gateway.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the virtual gateway resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the virtual gateway.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual gateway.
   *
   * @cloudformationAttribute VirtualGatewayName
   */
  public readonly attrVirtualGatewayName: string;

  /**
   * The name of the service mesh that the virtual gateway resides in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The specifications of the virtual gateway.
   */
  public spec: cdk.IResolvable | CfnVirtualGateway.VirtualGatewaySpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the virtual gateway to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the virtual gateway.
   */
  public virtualGatewayName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVirtualGatewayProps) {
    super(scope, id, {
      "type": CfnVirtualGateway.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualGatewayName = cdk.Token.asString(this.getAtt("VirtualGatewayName", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualGateway", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualGatewayName = props.virtualGatewayName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualGatewayName": this.virtualGatewayName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualGateway.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVirtualGatewayPropsToCloudFormation(props);
  }
}

export namespace CfnVirtualGateway {
  /**
   * An object that represents the specification of a service mesh resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html
   */
  export interface VirtualGatewaySpecProperty {
    /**
     * A reference to an object that represents the defaults for backends.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-backenddefaults
     */
    readonly backendDefaults?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty;

    /**
     * The listeners that the mesh endpoint is expected to receive inbound traffic from.
     *
     * You can specify one listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-listeners
     */
    readonly listeners: Array<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerProperty> | cdk.IResolvable;

    /**
     * An object that represents logging information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-logging
     */
    readonly logging?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayLoggingProperty;
  }

  /**
   * An object that represents logging information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylogging.html
   */
  export interface VirtualGatewayLoggingProperty {
    /**
     * The access log configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylogging.html#cfn-appmesh-virtualgateway-virtualgatewaylogging-accesslog
     */
    readonly accessLog?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayAccessLogProperty;
  }

  /**
   * The access log configuration for a virtual gateway.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayaccesslog.html
   */
  export interface VirtualGatewayAccessLogProperty {
    /**
     * The file object to send virtual gateway access logs to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayaccesslog-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayFileAccessLogProperty;
  }

  /**
   * An object that represents an access log file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html
   */
  export interface VirtualGatewayFileAccessLogProperty {
    /**
     * The specified format for the virtual gateway access logs.
     *
     * It can be either `json_format` or `text_format` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayfileaccesslog-format
     */
    readonly format?: cdk.IResolvable | CfnVirtualGateway.LoggingFormatProperty;

    /**
     * The file path to write access logs to.
     *
     * You can use `/dev/stdout` to send access logs to standard out and configure your Envoy container to use a log driver, such as `awslogs` , to export the access logs to a log storage service such as Amazon CloudWatch Logs. You can also specify a path in the Envoy container's file system to write the files to disk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayfileaccesslog-path
     */
    readonly path: string;
  }

  /**
   * An object that represents the format for the logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html
   */
  export interface LoggingFormatProperty {
    /**
     * The logging format for JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html#cfn-appmesh-virtualgateway-loggingformat-json
     */
    readonly json?: Array<cdk.IResolvable | CfnVirtualGateway.JsonFormatRefProperty> | cdk.IResolvable;

    /**
     * The logging format for text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html#cfn-appmesh-virtualgateway-loggingformat-text
     */
    readonly text?: string;
  }

  /**
   * An object that represents the key value pairs for the JSON.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html
   */
  export interface JsonFormatRefProperty {
    /**
     * The specified key for the JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html#cfn-appmesh-virtualgateway-jsonformatref-key
     */
    readonly key: string;

    /**
     * The specified value for the JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html#cfn-appmesh-virtualgateway-jsonformatref-value
     */
    readonly value: string;
  }

  /**
   * An object that represents a listener for a virtual gateway.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html
   */
  export interface VirtualGatewayListenerProperty {
    /**
     * The connection pool information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-connectionpool
     */
    readonly connectionPool?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayConnectionPoolProperty;

    /**
     * The health check information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-healthcheck
     */
    readonly healthCheck?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty;

    /**
     * The port mapping information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-portmapping
     */
    readonly portMapping: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayPortMappingProperty;

    /**
     * A reference to an object that represents the Transport Layer Security (TLS) properties for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-tls
     */
    readonly tls?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsProperty;
  }

  /**
   * An object that represents the type of virtual gateway connection pool.
   *
   * Only one protocol is used at a time and should be the same protocol as the one chosen under port mapping.
   *
   * If not present the default value for `maxPendingRequests` is `2147483647` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html
   */
  export interface VirtualGatewayConnectionPoolProperty {
    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-grpc
     */
    readonly grpc?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty;

    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-http
     */
    readonly http?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty;

    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-http2
     */
    readonly http2?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttp2connectionpool.html
   */
  export interface VirtualGatewayHttp2ConnectionPoolProperty {
    /**
     * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttp2connectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttp2connectionpool-maxrequests
     */
    readonly maxRequests: number;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html
   */
  export interface VirtualGatewayHttpConnectionPoolProperty {
    /**
     * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttpconnectionpool-maxconnections
     */
    readonly maxConnections: number;

    /**
     * Number of overflowing requests after `max_connections` Envoy will queue to upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttpconnectionpool-maxpendingrequests
     */
    readonly maxPendingRequests?: number;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool.html
   */
  export interface VirtualGatewayGrpcConnectionPoolProperty {
    /**
     * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool-maxrequests
     */
    readonly maxRequests: number;
  }

  /**
   * An object that represents the health check policy for a virtual gateway's listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html
   */
  export interface VirtualGatewayHealthCheckPolicyProperty {
    /**
     * The number of consecutive successful health checks that must occur before declaring the listener healthy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-healthythreshold
     */
    readonly healthyThreshold: number;

    /**
     * The time period in milliseconds between each health check execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-intervalmillis
     */
    readonly intervalMillis: number;

    /**
     * The destination path for the health check request.
     *
     * This value is only used if the specified protocol is HTTP or HTTP/2. For any other protocol, this value is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-path
     */
    readonly path?: string;

    /**
     * The destination port for the health check request.
     *
     * This port must match the port defined in the `PortMapping` for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-port
     */
    readonly port?: number;

    /**
     * The protocol for the health check request.
     *
     * If you specify `grpc` , then your service must conform to the [GRPC Health Checking Protocol](https://docs.aws.amazon.com/https://github.com/grpc/grpc/blob/master/doc/health-checking.md) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-protocol
     */
    readonly protocol: string;

    /**
     * The amount of time to wait when receiving a response from the health check, in milliseconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-timeoutmillis
     */
    readonly timeoutMillis: number;

    /**
     * The number of consecutive failed health checks that must occur before declaring a virtual gateway unhealthy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-unhealthythreshold
     */
    readonly unhealthyThreshold: number;
  }

  /**
   * An object that represents the Transport Layer Security (TLS) properties for a listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html
   */
  export interface VirtualGatewayListenerTlsProperty {
    /**
     * An object that represents a Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-certificate
     */
    readonly certificate: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty;

    /**
     * Specify one of the following modes.
     *
     * - ** STRICT – Listener only accepts connections with TLS enabled.
     * - ** PERMISSIVE – Listener accepts connections with or without TLS enabled.
     * - ** DISABLED – Listener only accepts connections without TLS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-mode
     */
    readonly mode: string;

    /**
     * A reference to an object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-validation
     */
    readonly validation?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty;
  }

  /**
   * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html
   */
  export interface VirtualGatewayListenerTlsValidationContextProperty {
    /**
     * A reference to an object that represents the SANs for a virtual gateway listener's Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext-subjectalternativenames
     */
    readonly subjectAlternativeNames?: cdk.IResolvable | CfnVirtualGateway.SubjectAlternativeNamesProperty;

    /**
     * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext-trust
     */
    readonly trust: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty;
  }

  /**
   * An object that represents the subject alternative names secured by the certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenames.html
   */
  export interface SubjectAlternativeNamesProperty {
    /**
     * An object that represents the criteria for determining a SANs match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenames.html#cfn-appmesh-virtualgateway-subjectalternativenames-match
     */
    readonly match: cdk.IResolvable | CfnVirtualGateway.SubjectAlternativeNameMatchersProperty;
  }

  /**
   * An object that represents the methods by which a subject alternative name on a peer Transport Layer Security (TLS) certificate can be matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenamematchers.html
   */
  export interface SubjectAlternativeNameMatchersProperty {
    /**
     * The values sent must match the specified values exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenamematchers.html#cfn-appmesh-virtualgateway-subjectalternativenamematchers-exact
     */
    readonly exact?: Array<string>;
  }

  /**
   * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context trust.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html
   */
  export interface VirtualGatewayListenerTlsValidationContextTrustProperty {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty;

    /**
     * A reference to an object that represents a virtual gateway's listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty;
  }

  /**
   * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
   *
   * The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust.html
   */
  export interface VirtualGatewayTlsValidationContextSdsTrustProperty {
    /**
     * A reference to an object that represents the name of the secret for a virtual gateway's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust-secretname
     */
    readonly secretName: string;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust.html
   */
  export interface VirtualGatewayTlsValidationContextFileTrustProperty {
    /**
     * The certificate trust chain for a certificate stored on the file system of the virtual node that the proxy is running on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust-certificatechain
     */
    readonly certificateChain: string;
  }

  /**
   * An object that represents a listener's Transport Layer Security (TLS) certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html
   */
  export interface VirtualGatewayListenerTlsCertificateProperty {
    /**
     * A reference to an object that represents an AWS Certificate Manager certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-acm
     */
    readonly acm?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty;

    /**
     * A reference to an object that represents a local file certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty;

    /**
     * A reference to an object that represents a virtual gateway's listener's Secret Discovery Service certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty;
  }

  /**
   * An object that represents the virtual gateway's listener's Secret Discovery Service certificate.The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate.html
   */
  export interface VirtualGatewayListenerTlsSdsCertificateProperty {
    /**
     * A reference to an object that represents the name of the secret secret requested from the Secret Discovery Service provider representing Transport Layer Security (TLS) materials like a certificate or certificate chain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate-secretname
     */
    readonly secretName: string;
  }

  /**
   * An object that represents an AWS Certificate Manager certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate.html
   */
  export interface VirtualGatewayListenerTlsAcmCertificateProperty {
    /**
     * The Amazon Resource Name (ARN) for the certificate.
     *
     * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate-certificatearn
     */
    readonly certificateArn: string;
  }

  /**
   * An object that represents a local file certificate.
   *
   * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html
   */
  export interface VirtualGatewayListenerTlsFileCertificateProperty {
    /**
     * The certificate chain for the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate-certificatechain
     */
    readonly certificateChain: string;

    /**
     * The private key for a certificate stored on the file system of the mesh endpoint that the proxy is running on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate-privatekey
     */
    readonly privateKey: string;
  }

  /**
   * An object that represents a port mapping.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html
   */
  export interface VirtualGatewayPortMappingProperty {
    /**
     * The port used for the port mapping.
     *
     * Specify one protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html#cfn-appmesh-virtualgateway-virtualgatewayportmapping-port
     */
    readonly port: number;

    /**
     * The protocol used for the port mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html#cfn-appmesh-virtualgateway-virtualgatewayportmapping-protocol
     */
    readonly protocol: string;
  }

  /**
   * An object that represents the default properties for a backend.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaybackenddefaults.html
   */
  export interface VirtualGatewayBackendDefaultsProperty {
    /**
     * A reference to an object that represents a client policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaybackenddefaults.html#cfn-appmesh-virtualgateway-virtualgatewaybackenddefaults-clientpolicy
     */
    readonly clientPolicy?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientPolicyProperty;
  }

  /**
   * An object that represents a client policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicy.html
   */
  export interface VirtualGatewayClientPolicyProperty {
    /**
     * A reference to an object that represents a Transport Layer Security (TLS) client policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicy-tls
     */
    readonly tls?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) client policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html
   */
  export interface VirtualGatewayClientPolicyTlsProperty {
    /**
     * A reference to an object that represents a virtual gateway's client's Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-certificate
     */
    readonly certificate?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty;

    /**
     * Whether the policy is enforced.
     *
     * The default is `True` , if a value isn't specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-enforce
     */
    readonly enforce?: boolean | cdk.IResolvable;

    /**
     * One or more ports that the policy is enforced for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-ports
     */
    readonly ports?: Array<number> | cdk.IResolvable;

    /**
     * A reference to an object that represents a Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-validation
     */
    readonly validation: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html
   */
  export interface VirtualGatewayTlsValidationContextProperty {
    /**
     * A reference to an object that represents the SANs for a virtual gateway's listener's Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext-subjectalternativenames
     */
    readonly subjectAlternativeNames?: cdk.IResolvable | CfnVirtualGateway.SubjectAlternativeNamesProperty;

    /**
     * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext-trust
     */
    readonly trust: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html
   */
  export interface VirtualGatewayTlsValidationContextTrustProperty {
    /**
     * A reference to an object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-acm
     */
    readonly acm?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty;

    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty;

    /**
     * A reference to an object that represents a virtual gateway's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust.html
   */
  export interface VirtualGatewayTlsValidationContextAcmTrustProperty {
    /**
     * One or more ACM Amazon Resource Name (ARN)s.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust-certificateauthorityarns
     */
    readonly certificateAuthorityArns: Array<string>;
  }

  /**
   * An object that represents the virtual gateway's client's Transport Layer Security (TLS) certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html
   */
  export interface VirtualGatewayClientTlsCertificateProperty {
    /**
     * An object that represents a local file certificate.
     *
     * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewayclienttlscertificate-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty;

    /**
     * A reference to an object that represents a virtual gateway's client's Secret Discovery Service certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewayclienttlscertificate-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty;
  }
}

/**
 * Properties for defining a `CfnVirtualGateway`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html
 */
export interface CfnVirtualGatewayProps {
  /**
   * The name of the service mesh that the virtual gateway resides in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The specifications of the virtual gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-spec
   */
  readonly spec: cdk.IResolvable | CfnVirtualGateway.VirtualGatewaySpecProperty;

  /**
   * Optional metadata that you can apply to the virtual gateway to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the virtual gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-virtualgatewayname
   */
  readonly virtualGatewayName?: string;
}

/**
 * Determine whether the given properties match those of a `JsonFormatRefProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayJsonFormatRefPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"JsonFormatRefProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayJsonFormatRefPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayJsonFormatRefPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayJsonFormatRefPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.JsonFormatRefProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.JsonFormatRefProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingFormatProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayLoggingFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("json", cdk.listValidator(CfnVirtualGatewayJsonFormatRefPropertyValidator))(properties.json));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  return errors.wrap("supplied properties not correct for \"LoggingFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayLoggingFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayLoggingFormatPropertyValidator(properties).assertSuccess();
  return {
    "Json": cdk.listMapper(convertCfnVirtualGatewayJsonFormatRefPropertyToCloudFormation)(properties.json),
    "Text": cdk.stringToCloudFormation(properties.text)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayLoggingFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.LoggingFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.LoggingFormatProperty>();
  ret.addPropertyResult("json", "Json", (properties.Json != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualGatewayJsonFormatRefPropertyFromCloudFormation)(properties.Json) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayFileAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayFileAccessLogProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("format", CfnVirtualGatewayLoggingFormatPropertyValidator)(properties.format));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayFileAccessLogProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayFileAccessLogPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyValidator(properties).assertSuccess();
  return {
    "Format": convertCfnVirtualGatewayLoggingFormatPropertyToCloudFormation(properties.format),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayFileAccessLogProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayFileAccessLogProperty>();
  ret.addPropertyResult("format", "Format", (properties.Format != null ? CfnVirtualGatewayLoggingFormatPropertyFromCloudFormation(properties.Format) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayAccessLogProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyValidator)(properties.file));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayAccessLogProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayAccessLogPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayAccessLogPropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualGatewayVirtualGatewayFileAccessLogPropertyToCloudFormation(properties.file)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayAccessLogProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayAccessLogProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyFromCloudFormation(properties.File) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayLoggingProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayLoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLog", CfnVirtualGatewayVirtualGatewayAccessLogPropertyValidator)(properties.accessLog));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayLoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayLoggingPropertyValidator(properties).assertSuccess();
  return {
    "AccessLog": convertCfnVirtualGatewayVirtualGatewayAccessLogPropertyToCloudFormation(properties.accessLog)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayLoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayLoggingProperty>();
  ret.addPropertyResult("accessLog", "AccessLog", (properties.AccessLog != null ? CfnVirtualGatewayVirtualGatewayAccessLogPropertyFromCloudFormation(properties.AccessLog) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHttp2ConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttp2ConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxRequests", cdk.requiredValidator)(properties.maxRequests));
  errors.collect(cdk.propertyValidator("maxRequests", cdk.validateNumber)(properties.maxRequests));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayHttp2ConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxRequests": cdk.numberToCloudFormation(properties.maxRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty>();
  ret.addPropertyResult("maxRequests", "MaxRequests", (properties.MaxRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHttpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxConnections", cdk.requiredValidator)(properties.maxConnections));
  errors.collect(cdk.propertyValidator("maxConnections", cdk.validateNumber)(properties.maxConnections));
  errors.collect(cdk.propertyValidator("maxPendingRequests", cdk.validateNumber)(properties.maxPendingRequests));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayHttpConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxConnections": cdk.numberToCloudFormation(properties.maxConnections),
    "MaxPendingRequests": cdk.numberToCloudFormation(properties.maxPendingRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty>();
  ret.addPropertyResult("maxConnections", "MaxConnections", (properties.MaxConnections != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections) : undefined));
  ret.addPropertyResult("maxPendingRequests", "MaxPendingRequests", (properties.MaxPendingRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxPendingRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayGrpcConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayGrpcConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxRequests", cdk.requiredValidator)(properties.maxRequests));
  errors.collect(cdk.propertyValidator("maxRequests", cdk.validateNumber)(properties.maxRequests));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayGrpcConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxRequests": cdk.numberToCloudFormation(properties.maxRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty>();
  ret.addPropertyResult("maxRequests", "MaxRequests", (properties.MaxRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpc", CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyValidator)(properties.grpc));
  errors.collect(cdk.propertyValidator("http", CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyValidator)(properties.http));
  errors.collect(cdk.propertyValidator("http2", CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyValidator)(properties.http2));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "GRPC": convertCfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyToCloudFormation(properties.grpc),
    "HTTP": convertCfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyToCloudFormation(properties.http),
    "HTTP2": convertCfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyToCloudFormation(properties.http2)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayConnectionPoolProperty>();
  ret.addPropertyResult("grpc", "GRPC", (properties.GRPC != null ? CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyFromCloudFormation(properties.GRPC) : undefined));
  ret.addPropertyResult("http", "HTTP", (properties.HTTP != null ? CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyFromCloudFormation(properties.HTTP) : undefined));
  ret.addPropertyResult("http2", "HTTP2", (properties.HTTP2 != null ? CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyFromCloudFormation(properties.HTTP2) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHealthCheckPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHealthCheckPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.requiredValidator)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.validateNumber)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("intervalMillis", cdk.requiredValidator)(properties.intervalMillis));
  errors.collect(cdk.propertyValidator("intervalMillis", cdk.validateNumber)(properties.intervalMillis));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("timeoutMillis", cdk.requiredValidator)(properties.timeoutMillis));
  errors.collect(cdk.propertyValidator("timeoutMillis", cdk.validateNumber)(properties.timeoutMillis));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.requiredValidator)(properties.unhealthyThreshold));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.validateNumber)(properties.unhealthyThreshold));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayHealthCheckPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyValidator(properties).assertSuccess();
  return {
    "HealthyThreshold": cdk.numberToCloudFormation(properties.healthyThreshold),
    "IntervalMillis": cdk.numberToCloudFormation(properties.intervalMillis),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "TimeoutMillis": cdk.numberToCloudFormation(properties.timeoutMillis),
    "UnhealthyThreshold": cdk.numberToCloudFormation(properties.unhealthyThreshold)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty>();
  ret.addPropertyResult("healthyThreshold", "HealthyThreshold", (properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold) : undefined));
  ret.addPropertyResult("intervalMillis", "IntervalMillis", (properties.IntervalMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalMillis) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("timeoutMillis", "TimeoutMillis", (properties.TimeoutMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMillis) : undefined));
  ret.addPropertyResult("unhealthyThreshold", "UnhealthyThreshold", (properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNameMatchersProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.listValidator(cdk.validateString))(properties.exact));
  return errors.wrap("supplied properties not correct for \"SubjectAlternativeNameMatchersProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewaySubjectAlternativeNameMatchersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.listMapper(cdk.stringToCloudFormation)(properties.exact)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.SubjectAlternativeNameMatchersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.SubjectAlternativeNameMatchersProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exact) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNamesProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNamesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyValidator)(properties.match));
  return errors.wrap("supplied properties not correct for \"SubjectAlternativeNamesProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewaySubjectAlternativeNamesPropertyValidator(properties).assertSuccess();
  return {
    "Match": convertCfnVirtualGatewaySubjectAlternativeNameMatchersPropertyToCloudFormation(properties.match)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.SubjectAlternativeNamesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.SubjectAlternativeNamesProperty>();
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextSdsTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextSdsTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretName", cdk.requiredValidator)(properties.secretName));
  errors.collect(cdk.propertyValidator("secretName", cdk.validateString)(properties.secretName));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayTlsValidationContextSdsTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyValidator(properties).assertSuccess();
  return {
    "SecretName": cdk.stringToCloudFormation(properties.secretName)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty>();
  ret.addPropertyResult("secretName", "SecretName", (properties.SecretName != null ? cfn_parse.FromCloudFormation.getString(properties.SecretName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextFileTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextFileTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateChain", cdk.requiredValidator)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayTlsValidationContextFileTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyValidator(properties).assertSuccess();
  return {
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty>();
  ret.addPropertyResult("certificateChain", "CertificateChain", (properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsValidationContextTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subjectAlternativeNames", CfnVirtualGatewaySubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
  errors.collect(cdk.propertyValidator("trust", cdk.requiredValidator)(properties.trust));
  errors.collect(cdk.propertyValidator("trust", CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyValidator)(properties.trust));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsValidationContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyValidator(properties).assertSuccess();
  return {
    "SubjectAlternativeNames": convertCfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
    "Trust": convertCfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyToCloudFormation(properties.trust)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty>();
  ret.addPropertyResult("subjectAlternativeNames", "SubjectAlternativeNames", (properties.SubjectAlternativeNames != null ? CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined));
  ret.addPropertyResult("trust", "Trust", (properties.Trust != null ? CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsSdsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsSdsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretName", cdk.requiredValidator)(properties.secretName));
  errors.collect(cdk.propertyValidator("secretName", cdk.validateString)(properties.secretName));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsSdsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "SecretName": cdk.stringToCloudFormation(properties.secretName)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty>();
  ret.addPropertyResult("secretName", "SecretName", (properties.SecretName != null ? cfn_parse.FromCloudFormation.getString(properties.SecretName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsAcmCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsAcmCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsAcmCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsFileCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsFileCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateChain", cdk.requiredValidator)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("privateKey", cdk.requiredValidator)(properties.privateKey));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsFileCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty>();
  ret.addPropertyResult("certificateChain", "CertificateChain", (properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acm", CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyValidator)(properties.acm));
  errors.collect(cdk.propertyValidator("file", CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "ACM": convertCfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyToCloudFormation(properties.acm),
    "File": convertCfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty>();
  ret.addPropertyResult("acm", "ACM", (properties.ACM != null ? CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyFromCloudFormation(properties.ACM) : undefined));
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", cdk.requiredValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("certificate", CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("validation", CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyValidator)(properties.validation));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerTlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerTlsPropertyValidator(properties).assertSuccess();
  return {
    "Certificate": convertCfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyToCloudFormation(properties.certificate),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Validation": convertCfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyToCloudFormation(properties.validation)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerTlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsProperty>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("validation", "Validation", (properties.Validation != null ? CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayPortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayPortMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayPortMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayPortMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayPortMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayPortMappingPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayPortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayPortMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayPortMappingProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionPool", CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyValidator)(properties.connectionPool));
  errors.collect(cdk.propertyValidator("healthCheck", CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("portMapping", cdk.requiredValidator)(properties.portMapping));
  errors.collect(cdk.propertyValidator("portMapping", CfnVirtualGatewayVirtualGatewayPortMappingPropertyValidator)(properties.portMapping));
  errors.collect(cdk.propertyValidator("tls", CfnVirtualGatewayVirtualGatewayListenerTlsPropertyValidator)(properties.tls));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayListenerProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayListenerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayListenerPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionPool": convertCfnVirtualGatewayVirtualGatewayConnectionPoolPropertyToCloudFormation(properties.connectionPool),
    "HealthCheck": convertCfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyToCloudFormation(properties.healthCheck),
    "PortMapping": convertCfnVirtualGatewayVirtualGatewayPortMappingPropertyToCloudFormation(properties.portMapping),
    "TLS": convertCfnVirtualGatewayVirtualGatewayListenerTlsPropertyToCloudFormation(properties.tls)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayListenerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerProperty>();
  ret.addPropertyResult("connectionPool", "ConnectionPool", (properties.ConnectionPool != null ? CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyFromCloudFormation(properties.ConnectionPool) : undefined));
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyFromCloudFormation(properties.HealthCheck) : undefined));
  ret.addPropertyResult("portMapping", "PortMapping", (properties.PortMapping != null ? CfnVirtualGatewayVirtualGatewayPortMappingPropertyFromCloudFormation(properties.PortMapping) : undefined));
  ret.addPropertyResult("tls", "TLS", (properties.TLS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsPropertyFromCloudFormation(properties.TLS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextAcmTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextAcmTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArns", cdk.requiredValidator)(properties.certificateAuthorityArns));
  errors.collect(cdk.propertyValidator("certificateAuthorityArns", cdk.listValidator(cdk.validateString))(properties.certificateAuthorityArns));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayTlsValidationContextAcmTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAuthorityArns)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty>();
  ret.addPropertyResult("certificateAuthorityArns", "CertificateAuthorityArns", (properties.CertificateAuthorityArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateAuthorityArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acm", CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyValidator)(properties.acm));
  errors.collect(cdk.propertyValidator("file", CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayTlsValidationContextTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
  return {
    "ACM": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyToCloudFormation(properties.acm),
    "File": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty>();
  ret.addPropertyResult("acm", "ACM", (properties.ACM != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyFromCloudFormation(properties.ACM) : undefined));
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subjectAlternativeNames", CfnVirtualGatewaySubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
  errors.collect(cdk.propertyValidator("trust", cdk.requiredValidator)(properties.trust));
  errors.collect(cdk.propertyValidator("trust", CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyValidator)(properties.trust));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayTlsValidationContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyValidator(properties).assertSuccess();
  return {
    "SubjectAlternativeNames": convertCfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
    "Trust": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyToCloudFormation(properties.trust)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty>();
  ret.addPropertyResult("subjectAlternativeNames", "SubjectAlternativeNames", (properties.SubjectAlternativeNames != null ? CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined));
  ret.addPropertyResult("trust", "Trust", (properties.Trust != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayClientTlsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientPolicyTlsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyTlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("enforce", cdk.validateBoolean)(properties.enforce));
  errors.collect(cdk.propertyValidator("ports", cdk.listValidator(cdk.validateNumber))(properties.ports));
  errors.collect(cdk.propertyValidator("validation", cdk.requiredValidator)(properties.validation));
  errors.collect(cdk.propertyValidator("validation", CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyValidator)(properties.validation));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayClientPolicyTlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyValidator(properties).assertSuccess();
  return {
    "Certificate": convertCfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyToCloudFormation(properties.certificate),
    "Enforce": cdk.booleanToCloudFormation(properties.enforce),
    "Ports": cdk.listMapper(cdk.numberToCloudFormation)(properties.ports),
    "Validation": convertCfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyToCloudFormation(properties.validation)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined));
  ret.addPropertyResult("enforce", "Enforce", (properties.Enforce != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enforce) : undefined));
  ret.addPropertyResult("ports", "Ports", (properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Ports) : undefined));
  ret.addPropertyResult("validation", "Validation", (properties.Validation != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tls", CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyValidator)(properties.tls));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayClientPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayClientPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayClientPolicyPropertyValidator(properties).assertSuccess();
  return {
    "TLS": convertCfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyToCloudFormation(properties.tls)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayClientPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientPolicyProperty>();
  ret.addPropertyResult("tls", "TLS", (properties.TLS != null ? CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyFromCloudFormation(properties.TLS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayBackendDefaultsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayBackendDefaultsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientPolicy", CfnVirtualGatewayVirtualGatewayClientPolicyPropertyValidator)(properties.clientPolicy));
  return errors.wrap("supplied properties not correct for \"VirtualGatewayBackendDefaultsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyValidator(properties).assertSuccess();
  return {
    "ClientPolicy": convertCfnVirtualGatewayVirtualGatewayClientPolicyPropertyToCloudFormation(properties.clientPolicy)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty>();
  ret.addPropertyResult("clientPolicy", "ClientPolicy", (properties.ClientPolicy != null ? CfnVirtualGatewayVirtualGatewayClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualGatewaySpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewaySpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewaySpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backendDefaults", CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyValidator)(properties.backendDefaults));
  errors.collect(cdk.propertyValidator("listeners", cdk.requiredValidator)(properties.listeners));
  errors.collect(cdk.propertyValidator("listeners", cdk.listValidator(CfnVirtualGatewayVirtualGatewayListenerPropertyValidator))(properties.listeners));
  errors.collect(cdk.propertyValidator("logging", CfnVirtualGatewayVirtualGatewayLoggingPropertyValidator)(properties.logging));
  return errors.wrap("supplied properties not correct for \"VirtualGatewaySpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayVirtualGatewaySpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayVirtualGatewaySpecPropertyValidator(properties).assertSuccess();
  return {
    "BackendDefaults": convertCfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyToCloudFormation(properties.backendDefaults),
    "Listeners": cdk.listMapper(convertCfnVirtualGatewayVirtualGatewayListenerPropertyToCloudFormation)(properties.listeners),
    "Logging": convertCfnVirtualGatewayVirtualGatewayLoggingPropertyToCloudFormation(properties.logging)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewaySpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualGateway.VirtualGatewaySpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewaySpecProperty>();
  ret.addPropertyResult("backendDefaults", "BackendDefaults", (properties.BackendDefaults != null ? CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyFromCloudFormation(properties.BackendDefaults) : undefined));
  ret.addPropertyResult("listeners", "Listeners", (properties.Listeners != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualGatewayVirtualGatewayListenerPropertyFromCloudFormation)(properties.Listeners) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnVirtualGatewayVirtualGatewayLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualGatewayProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualGatewayPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnVirtualGatewayVirtualGatewaySpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualGatewayName", cdk.validateString)(properties.virtualGatewayName));
  return errors.wrap("supplied properties not correct for \"CfnVirtualGatewayProps\"");
}

// @ts-ignore TS6133
function convertCfnVirtualGatewayPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualGatewayPropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "Spec": convertCfnVirtualGatewayVirtualGatewaySpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualGatewayName": cdk.stringToCloudFormation(properties.virtualGatewayName)
  };
}

// @ts-ignore TS6133
function CfnVirtualGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGatewayProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGatewayProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnVirtualGatewayVirtualGatewaySpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualGatewayName", "VirtualGatewayName", (properties.VirtualGatewayName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualGatewayName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a virtual node within a service mesh.
 *
 * A virtual node acts as a logical pointer to a particular task group, such as an Amazon ECS service or a Kubernetes deployment. When you create a virtual node, you can specify the service discovery information for your task group, and whether the proxy running in a task group will communicate with other proxies using Transport Layer Security (TLS).
 *
 * You define a `listener` for any inbound traffic that your virtual node expects. Any virtual service that your virtual node expects to communicate to is specified as a `backend` .
 *
 * The response metadata for your new virtual node contains the `arn` that is associated with the virtual node. Set this value to the full ARN; for example, `arn:aws:appmesh:us-west-2:123456789012:myMesh/default/virtualNode/myApp` ) as the `APPMESH_RESOURCE_ARN` environment variable for your task group's Envoy proxy container in your task definition or pod spec. This is then mapped to the `node.id` and `node.cluster` Envoy parameters.
 *
 * > By default, App Mesh uses the name of the resource you specified in `APPMESH_RESOURCE_ARN` when Envoy is referring to itself in metrics and traces. You can override this behavior by setting the `APPMESH_RESOURCE_CLUSTER` environment variable with your own name.
 *
 * For more information about virtual nodes, see [Virtual nodes](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html) . You must be using `1.15.0` or later of the Envoy image when setting these variables. For more information about App Mesh Envoy variables, see [Envoy image](https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html) in the AWS App Mesh User Guide.
 *
 * @cloudformationResource AWS::AppMesh::VirtualNode
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html
 */
export class CfnVirtualNode extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::VirtualNode";

  /**
   * Build a CfnVirtualNode from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualNode {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVirtualNodePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVirtualNode(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the virtual node.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the virtual node resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the virtual node.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual node.
   *
   * @cloudformationAttribute VirtualNodeName
   */
  public readonly attrVirtualNodeName: string;

  /**
   * The name of the service mesh to create the virtual node in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The virtual node specification to apply.
   */
  public spec: cdk.IResolvable | CfnVirtualNode.VirtualNodeSpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the virtual node to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual node.
   */
  public virtualNodeName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVirtualNodeProps) {
    super(scope, id, {
      "type": CfnVirtualNode.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualNodeName = cdk.Token.asString(this.getAtt("VirtualNodeName", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualNode", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualNodeName = props.virtualNodeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualNodeName": this.virtualNodeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualNode.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVirtualNodePropsToCloudFormation(props);
  }
}

export namespace CfnVirtualNode {
  /**
   * An object that represents the specification of a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html
   */
  export interface VirtualNodeSpecProperty {
    /**
     * A reference to an object that represents the defaults for backends.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-backenddefaults
     */
    readonly backendDefaults?: CfnVirtualNode.BackendDefaultsProperty | cdk.IResolvable;

    /**
     * The backends that the virtual node is expected to send outbound traffic to.
     *
     * > App Mesh doesn't validate the existence of those virtual services specified in backends. This is to prevent a cyclic dependency between virtual nodes and virtual services creation. Make sure the virtual service name is correct. The virtual service can be created afterwards if it doesn't already exist.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-backends
     */
    readonly backends?: Array<CfnVirtualNode.BackendProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The listener that the virtual node is expected to receive inbound traffic from.
     *
     * You can specify one listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-listeners
     */
    readonly listeners?: Array<cdk.IResolvable | CfnVirtualNode.ListenerProperty> | cdk.IResolvable;

    /**
     * The inbound and outbound access logging information for the virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-logging
     */
    readonly logging?: cdk.IResolvable | CfnVirtualNode.LoggingProperty;

    /**
     * The service discovery information for the virtual node.
     *
     * If your virtual node does not expect ingress traffic, you can omit this parameter. If you specify a `listener` , then you must specify service discovery information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-servicediscovery
     */
    readonly serviceDiscovery?: cdk.IResolvable | CfnVirtualNode.ServiceDiscoveryProperty;
  }

  /**
   * An object that represents the logging information for a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-logging.html
   */
  export interface LoggingProperty {
    /**
     * The access log configuration for a virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-logging.html#cfn-appmesh-virtualnode-logging-accesslog
     */
    readonly accessLog?: CfnVirtualNode.AccessLogProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the access logging information for a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-accesslog.html
   */
  export interface AccessLogProperty {
    /**
     * The file object to send virtual node access logs to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-accesslog.html#cfn-appmesh-virtualnode-accesslog-file
     */
    readonly file?: CfnVirtualNode.FileAccessLogProperty | cdk.IResolvable;
  }

  /**
   * An object that represents an access log file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html
   */
  export interface FileAccessLogProperty {
    /**
     * The specified format for the logs.
     *
     * The format is either `json_format` or `text_format` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html#cfn-appmesh-virtualnode-fileaccesslog-format
     */
    readonly format?: cdk.IResolvable | CfnVirtualNode.LoggingFormatProperty;

    /**
     * The file path to write access logs to.
     *
     * You can use `/dev/stdout` to send access logs to standard out and configure your Envoy container to use a log driver, such as `awslogs` , to export the access logs to a log storage service such as Amazon CloudWatch Logs. You can also specify a path in the Envoy container's file system to write the files to disk.
     *
     * > The Envoy process must have write permissions to the path that you specify here. Otherwise, Envoy fails to bootstrap properly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html#cfn-appmesh-virtualnode-fileaccesslog-path
     */
    readonly path: string;
  }

  /**
   * An object that represents the format for the logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html
   */
  export interface LoggingFormatProperty {
    /**
     * The logging format for JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html#cfn-appmesh-virtualnode-loggingformat-json
     */
    readonly json?: Array<cdk.IResolvable | CfnVirtualNode.JsonFormatRefProperty> | cdk.IResolvable;

    /**
     * The logging format for text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html#cfn-appmesh-virtualnode-loggingformat-text
     */
    readonly text?: string;
  }

  /**
   * An object that represents the key value pairs for the JSON.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html
   */
  export interface JsonFormatRefProperty {
    /**
     * The specified key for the JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html#cfn-appmesh-virtualnode-jsonformatref-key
     */
    readonly key: string;

    /**
     * The specified value for the JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html#cfn-appmesh-virtualnode-jsonformatref-value
     */
    readonly value: string;
  }

  /**
   * An object that represents the backends that a virtual node is expected to send outbound traffic to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html
   */
  export interface BackendProperty {
    /**
     * Specifies a virtual service to use as a backend.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html#cfn-appmesh-virtualnode-backend-virtualservice
     */
    readonly virtualService?: cdk.IResolvable | CfnVirtualNode.VirtualServiceBackendProperty;
  }

  /**
   * An object that represents a virtual service backend for a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html
   */
  export interface VirtualServiceBackendProperty {
    /**
     * A reference to an object that represents the client policy for a backend.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html#cfn-appmesh-virtualnode-virtualservicebackend-clientpolicy
     */
    readonly clientPolicy?: CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable;

    /**
     * The name of the virtual service that is acting as a virtual node backend.
     *
     * > App Mesh doesn't validate the existence of those virtual services specified in backends. This is to prevent a cyclic dependency between virtual nodes and virtual services creation. Make sure the virtual service name is correct. The virtual service can be created afterwards if it doesn't already exist.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html#cfn-appmesh-virtualnode-virtualservicebackend-virtualservicename
     */
    readonly virtualServiceName: string;
  }

  /**
   * An object that represents a client policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicy.html
   */
  export interface ClientPolicyProperty {
    /**
     * A reference to an object that represents a Transport Layer Security (TLS) client policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicy.html#cfn-appmesh-virtualnode-clientpolicy-tls
     */
    readonly tls?: CfnVirtualNode.ClientPolicyTlsProperty | cdk.IResolvable;
  }

  /**
   * A reference to an object that represents a Transport Layer Security (TLS) client policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html
   */
  export interface ClientPolicyTlsProperty {
    /**
     * A reference to an object that represents a client's TLS certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-certificate
     */
    readonly certificate?: CfnVirtualNode.ClientTlsCertificateProperty | cdk.IResolvable;

    /**
     * Whether the policy is enforced.
     *
     * The default is `True` , if a value isn't specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-enforce
     */
    readonly enforce?: boolean | cdk.IResolvable;

    /**
     * One or more ports that the policy is enforced for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-ports
     */
    readonly ports?: Array<number> | cdk.IResolvable;

    /**
     * A reference to an object that represents a TLS validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-validation
     */
    readonly validation: cdk.IResolvable | CfnVirtualNode.TlsValidationContextProperty;
  }

  /**
   * An object that represents how the proxy will validate its peer during Transport Layer Security (TLS) negotiation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html
   */
  export interface TlsValidationContextProperty {
    /**
     * A reference to an object that represents the SANs for a Transport Layer Security (TLS) validation context.
     *
     * If you don't specify SANs on the *terminating* mesh endpoint, the Envoy proxy for that node doesn't verify the SAN on a peer client certificate. If you don't specify SANs on the *originating* mesh endpoint, the SAN on the certificate provided by the terminating endpoint must match the mesh endpoint service discovery configuration. Since SPIRE vended certificates have a SPIFFE ID as a name, you must set the SAN since the name doesn't match the service discovery name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html#cfn-appmesh-virtualnode-tlsvalidationcontext-subjectalternativenames
     */
    readonly subjectAlternativeNames?: cdk.IResolvable | CfnVirtualNode.SubjectAlternativeNamesProperty;

    /**
     * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html#cfn-appmesh-virtualnode-tlsvalidationcontext-trust
     */
    readonly trust: cdk.IResolvable | CfnVirtualNode.TlsValidationContextTrustProperty;
  }

  /**
   * An object that represents the subject alternative names secured by the certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenames.html
   */
  export interface SubjectAlternativeNamesProperty {
    /**
     * An object that represents the criteria for determining a SANs match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenames.html#cfn-appmesh-virtualnode-subjectalternativenames-match
     */
    readonly match: cdk.IResolvable | CfnVirtualNode.SubjectAlternativeNameMatchersProperty;
  }

  /**
   * An object that represents the methods by which a subject alternative name on a peer Transport Layer Security (TLS) certificate can be matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenamematchers.html
   */
  export interface SubjectAlternativeNameMatchersProperty {
    /**
     * The values sent must match the specified values exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenamematchers.html#cfn-appmesh-virtualnode-subjectalternativenamematchers-exact
     */
    readonly exact?: Array<string>;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html
   */
  export interface TlsValidationContextTrustProperty {
    /**
     * A reference to an object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-acm
     */
    readonly acm?: cdk.IResolvable | CfnVirtualNode.TlsValidationContextAcmTrustProperty;

    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualNode.TlsValidationContextFileTrustProperty;

    /**
     * A reference to an object that represents a Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualNode.TlsValidationContextSdsTrustProperty;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) Secret Discovery Service validation context trust.
   *
   * The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextsdstrust.html
   */
  export interface TlsValidationContextSdsTrustProperty {
    /**
     * A reference to an object that represents the name of the secret for a Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextsdstrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextsdstrust-secretname
     */
    readonly secretName: string;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextacmtrust.html
   */
  export interface TlsValidationContextAcmTrustProperty {
    /**
     * One or more ACM Amazon Resource Name (ARN)s.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextacmtrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextacmtrust-certificateauthorityarns
     */
    readonly certificateAuthorityArns: Array<string>;
  }

  /**
   * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextfiletrust.html
   */
  export interface TlsValidationContextFileTrustProperty {
    /**
     * The certificate trust chain for a certificate stored on the file system of the virtual node that the proxy is running on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextfiletrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextfiletrust-certificatechain
     */
    readonly certificateChain: string;
  }

  /**
   * An object that represents the client's certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html
   */
  export interface ClientTlsCertificateProperty {
    /**
     * An object that represents a local file certificate.
     *
     * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html#cfn-appmesh-virtualnode-clienttlscertificate-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualNode.ListenerTlsFileCertificateProperty;

    /**
     * A reference to an object that represents a client's TLS Secret Discovery Service certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html#cfn-appmesh-virtualnode-clienttlscertificate-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualNode.ListenerTlsSdsCertificateProperty;
  }

  /**
   * An object that represents the listener's Secret Discovery Service certificate.
   *
   * The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlssdscertificate.html
   */
  export interface ListenerTlsSdsCertificateProperty {
    /**
     * A reference to an object that represents the name of the secret requested from the Secret Discovery Service provider representing Transport Layer Security (TLS) materials like a certificate or certificate chain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlssdscertificate.html#cfn-appmesh-virtualnode-listenertlssdscertificate-secretname
     */
    readonly secretName: string;
  }

  /**
   * An object that represents a local file certificate.
   *
   * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html
   */
  export interface ListenerTlsFileCertificateProperty {
    /**
     * The certificate chain for the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html#cfn-appmesh-virtualnode-listenertlsfilecertificate-certificatechain
     */
    readonly certificateChain: string;

    /**
     * The private key for a certificate stored on the file system of the virtual node that the proxy is running on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html#cfn-appmesh-virtualnode-listenertlsfilecertificate-privatekey
     */
    readonly privateKey: string;
  }

  /**
   * An object that represents a listener for a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html
   */
  export interface ListenerProperty {
    /**
     * The connection pool information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-connectionpool
     */
    readonly connectionPool?: cdk.IResolvable | CfnVirtualNode.VirtualNodeConnectionPoolProperty;

    /**
     * The health check information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-healthcheck
     */
    readonly healthCheck?: CfnVirtualNode.HealthCheckProperty | cdk.IResolvable;

    /**
     * The outlier detection information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-outlierdetection
     */
    readonly outlierDetection?: cdk.IResolvable | CfnVirtualNode.OutlierDetectionProperty;

    /**
     * The port mapping information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-portmapping
     */
    readonly portMapping: cdk.IResolvable | CfnVirtualNode.PortMappingProperty;

    /**
     * An object that represents timeouts for different protocols.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-timeout
     */
    readonly timeout?: cdk.IResolvable | CfnVirtualNode.ListenerTimeoutProperty;

    /**
     * A reference to an object that represents the Transport Layer Security (TLS) properties for a listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-tls
     */
    readonly tls?: cdk.IResolvable | CfnVirtualNode.ListenerTlsProperty;
  }

  /**
   * An object that represents the type of virtual node connection pool.
   *
   * Only one protocol is used at a time and should be the same protocol as the one chosen under port mapping.
   *
   * If not present the default value for `maxPendingRequests` is `2147483647` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html
   */
  export interface VirtualNodeConnectionPoolProperty {
    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-grpc
     */
    readonly grpc?: cdk.IResolvable | CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty;

    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-http
     */
    readonly http?: cdk.IResolvable | CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty;

    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-http2
     */
    readonly http2?: cdk.IResolvable | CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty;

    /**
     * An object that represents a type of connection pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-tcp
     */
    readonly tcp?: cdk.IResolvable | CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodetcpconnectionpool.html
   */
  export interface VirtualNodeTcpConnectionPoolProperty {
    /**
     * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodetcpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodetcpconnectionpool-maxconnections
     */
    readonly maxConnections: number;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttp2connectionpool.html
   */
  export interface VirtualNodeHttp2ConnectionPoolProperty {
    /**
     * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttp2connectionpool.html#cfn-appmesh-virtualnode-virtualnodehttp2connectionpool-maxrequests
     */
    readonly maxRequests: number;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html
   */
  export interface VirtualNodeHttpConnectionPoolProperty {
    /**
     * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodehttpconnectionpool-maxconnections
     */
    readonly maxConnections: number;

    /**
     * Number of overflowing requests after `max_connections` Envoy will queue to upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodehttpconnectionpool-maxpendingrequests
     */
    readonly maxPendingRequests?: number;
  }

  /**
   * An object that represents a type of connection pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodegrpcconnectionpool.html
   */
  export interface VirtualNodeGrpcConnectionPoolProperty {
    /**
     * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodegrpcconnectionpool.html#cfn-appmesh-virtualnode-virtualnodegrpcconnectionpool-maxrequests
     */
    readonly maxRequests: number;
  }

  /**
   * An object that represents timeouts for different protocols.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html
   */
  export interface ListenerTimeoutProperty {
    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-grpc
     */
    readonly grpc?: CfnVirtualNode.GrpcTimeoutProperty | cdk.IResolvable;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-http
     */
    readonly http?: CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-http2
     */
    readonly http2?: CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable;

    /**
     * An object that represents types of timeouts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-tcp
     */
    readonly tcp?: cdk.IResolvable | CfnVirtualNode.TcpTimeoutProperty;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tcptimeout.html
   */
  export interface TcpTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tcptimeout.html#cfn-appmesh-virtualnode-tcptimeout-idle
     */
    readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object that represents a duration of time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html
   */
  export interface DurationProperty {
    /**
     * A unit of time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html#cfn-appmesh-virtualnode-duration-unit
     */
    readonly unit: string;

    /**
     * A number of time units.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html#cfn-appmesh-virtualnode-duration-value
     */
    readonly value: number;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html
   */
  export interface HttpTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html#cfn-appmesh-virtualnode-httptimeout-idle
     */
    readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;

    /**
     * An object that represents a per request timeout.
     *
     * The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html#cfn-appmesh-virtualnode-httptimeout-perrequest
     */
    readonly perRequest?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object that represents types of timeouts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html
   */
  export interface GrpcTimeoutProperty {
    /**
     * An object that represents an idle timeout.
     *
     * An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html#cfn-appmesh-virtualnode-grpctimeout-idle
     */
    readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;

    /**
     * An object that represents a per request timeout.
     *
     * The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html#cfn-appmesh-virtualnode-grpctimeout-perrequest
     */
    readonly perRequest?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the health check policy for a virtual node's listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html
   */
  export interface HealthCheckProperty {
    /**
     * The number of consecutive successful health checks that must occur before declaring listener healthy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-healthythreshold
     */
    readonly healthyThreshold: number;

    /**
     * The time period in milliseconds between each health check execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-intervalmillis
     */
    readonly intervalMillis: number;

    /**
     * The destination path for the health check request.
     *
     * This value is only used if the specified protocol is HTTP or HTTP/2. For any other protocol, this value is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-path
     */
    readonly path?: string;

    /**
     * The destination port for the health check request.
     *
     * This port must match the port defined in the `PortMapping` for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-port
     */
    readonly port?: number;

    /**
     * The protocol for the health check request.
     *
     * If you specify `grpc` , then your service must conform to the [GRPC Health Checking Protocol](https://docs.aws.amazon.com/https://github.com/grpc/grpc/blob/master/doc/health-checking.md) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-protocol
     */
    readonly protocol: string;

    /**
     * The amount of time to wait when receiving a response from the health check, in milliseconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-timeoutmillis
     */
    readonly timeoutMillis: number;

    /**
     * The number of consecutive failed health checks that must occur before declaring a virtual node unhealthy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-unhealthythreshold
     */
    readonly unhealthyThreshold: number;
  }

  /**
   * An object that represents the Transport Layer Security (TLS) properties for a listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html
   */
  export interface ListenerTlsProperty {
    /**
     * A reference to an object that represents a listener's Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-certificate
     */
    readonly certificate: cdk.IResolvable | CfnVirtualNode.ListenerTlsCertificateProperty;

    /**
     * Specify one of the following modes.
     *
     * - ** STRICT – Listener only accepts connections with TLS enabled.
     * - ** PERMISSIVE – Listener accepts connections with or without TLS enabled.
     * - ** DISABLED – Listener only accepts connections without TLS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-mode
     */
    readonly mode: string;

    /**
     * A reference to an object that represents a listener's Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-validation
     */
    readonly validation?: cdk.IResolvable | CfnVirtualNode.ListenerTlsValidationContextProperty;
  }

  /**
   * An object that represents a listener's Transport Layer Security (TLS) validation context.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html
   */
  export interface ListenerTlsValidationContextProperty {
    /**
     * A reference to an object that represents the SANs for a listener's Transport Layer Security (TLS) validation context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html#cfn-appmesh-virtualnode-listenertlsvalidationcontext-subjectalternativenames
     */
    readonly subjectAlternativeNames?: cdk.IResolvable | CfnVirtualNode.SubjectAlternativeNamesProperty;

    /**
     * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html#cfn-appmesh-virtualnode-listenertlsvalidationcontext-trust
     */
    readonly trust: cdk.IResolvable | CfnVirtualNode.ListenerTlsValidationContextTrustProperty;
  }

  /**
   * An object that represents a listener's Transport Layer Security (TLS) validation context trust.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html
   */
  export interface ListenerTlsValidationContextTrustProperty {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-listenertlsvalidationcontexttrust-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualNode.TlsValidationContextFileTrustProperty;

    /**
     * A reference to an object that represents a listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-listenertlsvalidationcontexttrust-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualNode.TlsValidationContextSdsTrustProperty;
  }

  /**
   * An object that represents a listener's Transport Layer Security (TLS) certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html
   */
  export interface ListenerTlsCertificateProperty {
    /**
     * A reference to an object that represents an AWS Certificate Manager certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-acm
     */
    readonly acm?: cdk.IResolvable | CfnVirtualNode.ListenerTlsAcmCertificateProperty;

    /**
     * A reference to an object that represents a local file certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-file
     */
    readonly file?: cdk.IResolvable | CfnVirtualNode.ListenerTlsFileCertificateProperty;

    /**
     * A reference to an object that represents a listener's Secret Discovery Service certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-sds
     */
    readonly sds?: cdk.IResolvable | CfnVirtualNode.ListenerTlsSdsCertificateProperty;
  }

  /**
   * An object that represents an AWS Certificate Manager certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsacmcertificate.html
   */
  export interface ListenerTlsAcmCertificateProperty {
    /**
     * The Amazon Resource Name (ARN) for the certificate.
     *
     * The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsacmcertificate.html#cfn-appmesh-virtualnode-listenertlsacmcertificate-certificatearn
     */
    readonly certificateArn: string;
  }

  /**
   * An object representing a virtual node or virtual router listener port mapping.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html
   */
  export interface PortMappingProperty {
    /**
     * The port used for the port mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html#cfn-appmesh-virtualnode-portmapping-port
     */
    readonly port: number;

    /**
     * The protocol used for the port mapping.
     *
     * Specify `http` , `http2` , `grpc` , or `tcp` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html#cfn-appmesh-virtualnode-portmapping-protocol
     */
    readonly protocol: string;
  }

  /**
   * An object that represents the outlier detection for a virtual node's listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html
   */
  export interface OutlierDetectionProperty {
    /**
     * The base amount of time for which a host is ejected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-baseejectionduration
     */
    readonly baseEjectionDuration: CfnVirtualNode.DurationProperty | cdk.IResolvable;

    /**
     * The time interval between ejection sweep analysis.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-interval
     */
    readonly interval: CfnVirtualNode.DurationProperty | cdk.IResolvable;

    /**
     * Maximum percentage of hosts in load balancing pool for upstream service that can be ejected.
     *
     * Will eject at least one host regardless of the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-maxejectionpercent
     */
    readonly maxEjectionPercent: number;

    /**
     * Number of consecutive `5xx` errors required for ejection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-maxservererrors
     */
    readonly maxServerErrors: number;
  }

  /**
   * An object that represents the default properties for a backend.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backenddefaults.html
   */
  export interface BackendDefaultsProperty {
    /**
     * A reference to an object that represents a client policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backenddefaults.html#cfn-appmesh-virtualnode-backenddefaults-clientpolicy
     */
    readonly clientPolicy?: CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the service discovery information for a virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html
   */
  export interface ServiceDiscoveryProperty {
    /**
     * Specifies any AWS Cloud Map information for the virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html#cfn-appmesh-virtualnode-servicediscovery-awscloudmap
     */
    readonly awsCloudMap?: CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty | cdk.IResolvable;

    /**
     * Specifies the DNS information for the virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html#cfn-appmesh-virtualnode-servicediscovery-dns
     */
    readonly dns?: CfnVirtualNode.DnsServiceDiscoveryProperty | cdk.IResolvable;
  }

  /**
   * An object that represents the DNS service discovery information for your virtual node.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html
   */
  export interface DnsServiceDiscoveryProperty {
    /**
     * Specifies the DNS service discovery hostname for the virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-hostname
     */
    readonly hostname: string;

    /**
     * The preferred IP version that this virtual node uses.
     *
     * Setting the IP preference on the virtual node only overrides the IP preference set for the mesh on this specific node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-ippreference
     */
    readonly ipPreference?: string;

    /**
     * Specifies the DNS response type for the virtual node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-responsetype
     */
    readonly responseType?: string;
  }

  /**
   * An object that represents the AWS Cloud Map service discovery information for your virtual node.
   *
   * > AWS Cloud Map is not available in the eu-south-1 Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html
   */
  export interface AwsCloudMapServiceDiscoveryProperty {
    /**
     * A string map that contains attributes with values that you can use to filter instances by any custom attribute that you specified when you registered the instance.
     *
     * Only instances that match all of the specified key/value pairs will be returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-attributes
     */
    readonly attributes?: Array<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The preferred IP version that this virtual node uses.
     *
     * Setting the IP preference on the virtual node only overrides the IP preference set for the mesh on this specific node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-ippreference
     */
    readonly ipPreference?: string;

    /**
     * The HTTP name of the AWS Cloud Map namespace to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-namespacename
     */
    readonly namespaceName: string;

    /**
     * The name of the AWS Cloud Map service to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-servicename
     */
    readonly serviceName: string;
  }

  /**
   * An object that represents the AWS Cloud Map attribute information for your virtual node.
   *
   * > AWS Cloud Map is not available in the eu-south-1 Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html
   */
  export interface AwsCloudMapInstanceAttributeProperty {
    /**
     * The name of an AWS Cloud Map service instance attribute key.
     *
     * Any AWS Cloud Map service instance that contains the specified key and value is returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html#cfn-appmesh-virtualnode-awscloudmapinstanceattribute-key
     */
    readonly key: string;

    /**
     * The value of an AWS Cloud Map service instance attribute key.
     *
     * Any AWS Cloud Map service instance that contains the specified key and value is returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html#cfn-appmesh-virtualnode-awscloudmapinstanceattribute-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnVirtualNode`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html
 */
export interface CfnVirtualNodeProps {
  /**
   * The name of the service mesh to create the virtual node in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The virtual node specification to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-spec
   */
  readonly spec: cdk.IResolvable | CfnVirtualNode.VirtualNodeSpecProperty;

  /**
   * Optional metadata that you can apply to the virtual node to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual node.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-virtualnodename
   */
  readonly virtualNodeName?: string;
}

/**
 * Determine whether the given properties match those of a `JsonFormatRefProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeJsonFormatRefPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"JsonFormatRefProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeJsonFormatRefPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeJsonFormatRefPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeJsonFormatRefPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.JsonFormatRefProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.JsonFormatRefProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingFormatProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeLoggingFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("json", cdk.listValidator(CfnVirtualNodeJsonFormatRefPropertyValidator))(properties.json));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  return errors.wrap("supplied properties not correct for \"LoggingFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeLoggingFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeLoggingFormatPropertyValidator(properties).assertSuccess();
  return {
    "Json": cdk.listMapper(convertCfnVirtualNodeJsonFormatRefPropertyToCloudFormation)(properties.json),
    "Text": cdk.stringToCloudFormation(properties.text)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeLoggingFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.LoggingFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.LoggingFormatProperty>();
  ret.addPropertyResult("json", "Json", (properties.Json != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeJsonFormatRefPropertyFromCloudFormation)(properties.Json) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `FileAccessLogProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeFileAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("format", CfnVirtualNodeLoggingFormatPropertyValidator)(properties.format));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"FileAccessLogProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeFileAccessLogPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeFileAccessLogPropertyValidator(properties).assertSuccess();
  return {
    "Format": convertCfnVirtualNodeLoggingFormatPropertyToCloudFormation(properties.format),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeFileAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.FileAccessLogProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.FileAccessLogProperty>();
  ret.addPropertyResult("format", "Format", (properties.Format != null ? CfnVirtualNodeLoggingFormatPropertyFromCloudFormation(properties.Format) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualNodeFileAccessLogPropertyValidator)(properties.file));
  return errors.wrap("supplied properties not correct for \"AccessLogProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeAccessLogPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeAccessLogPropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualNodeFileAccessLogPropertyToCloudFormation(properties.file)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AccessLogProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AccessLogProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualNodeFileAccessLogPropertyFromCloudFormation(properties.File) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLog", CfnVirtualNodeAccessLogPropertyValidator)(properties.accessLog));
  return errors.wrap("supplied properties not correct for \"LoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeLoggingPropertyValidator(properties).assertSuccess();
  return {
    "AccessLog": convertCfnVirtualNodeAccessLogPropertyToCloudFormation(properties.accessLog)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.LoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.LoggingProperty>();
  ret.addPropertyResult("accessLog", "AccessLog", (properties.AccessLog != null ? CfnVirtualNodeAccessLogPropertyFromCloudFormation(properties.AccessLog) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNameMatchersProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNameMatchersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.listValidator(cdk.validateString))(properties.exact));
  return errors.wrap("supplied properties not correct for \"SubjectAlternativeNameMatchersProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeSubjectAlternativeNameMatchersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeSubjectAlternativeNameMatchersPropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.listMapper(cdk.stringToCloudFormation)(properties.exact)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNameMatchersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.SubjectAlternativeNameMatchersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.SubjectAlternativeNameMatchersProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exact) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNamesProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNamesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnVirtualNodeSubjectAlternativeNameMatchersPropertyValidator)(properties.match));
  return errors.wrap("supplied properties not correct for \"SubjectAlternativeNamesProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeSubjectAlternativeNamesPropertyValidator(properties).assertSuccess();
  return {
    "Match": convertCfnVirtualNodeSubjectAlternativeNameMatchersPropertyToCloudFormation(properties.match)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.SubjectAlternativeNamesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.SubjectAlternativeNamesProperty>();
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnVirtualNodeSubjectAlternativeNameMatchersPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextSdsTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextSdsTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextSdsTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretName", cdk.requiredValidator)(properties.secretName));
  errors.collect(cdk.propertyValidator("secretName", cdk.validateString)(properties.secretName));
  return errors.wrap("supplied properties not correct for \"TlsValidationContextSdsTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTlsValidationContextSdsTrustPropertyValidator(properties).assertSuccess();
  return {
    "SecretName": cdk.stringToCloudFormation(properties.secretName)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TlsValidationContextSdsTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextSdsTrustProperty>();
  ret.addPropertyResult("secretName", "SecretName", (properties.SecretName != null ? cfn_parse.FromCloudFormation.getString(properties.SecretName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextAcmTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextAcmTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextAcmTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArns", cdk.requiredValidator)(properties.certificateAuthorityArns));
  errors.collect(cdk.propertyValidator("certificateAuthorityArns", cdk.listValidator(cdk.validateString))(properties.certificateAuthorityArns));
  return errors.wrap("supplied properties not correct for \"TlsValidationContextAcmTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTlsValidationContextAcmTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTlsValidationContextAcmTrustPropertyValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAuthorityArns)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextAcmTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TlsValidationContextAcmTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextAcmTrustProperty>();
  ret.addPropertyResult("certificateAuthorityArns", "CertificateAuthorityArns", (properties.CertificateAuthorityArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateAuthorityArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextFileTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextFileTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextFileTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateChain", cdk.requiredValidator)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  return errors.wrap("supplied properties not correct for \"TlsValidationContextFileTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTlsValidationContextFileTrustPropertyValidator(properties).assertSuccess();
  return {
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TlsValidationContextFileTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextFileTrustProperty>();
  ret.addPropertyResult("certificateChain", "CertificateChain", (properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acm", CfnVirtualNodeTlsValidationContextAcmTrustPropertyValidator)(properties.acm));
  errors.collect(cdk.propertyValidator("file", CfnVirtualNodeTlsValidationContextFileTrustPropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualNodeTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"TlsValidationContextTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
  return {
    "ACM": convertCfnVirtualNodeTlsValidationContextAcmTrustPropertyToCloudFormation(properties.acm),
    "File": convertCfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TlsValidationContextTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextTrustProperty>();
  ret.addPropertyResult("acm", "ACM", (properties.ACM != null ? CfnVirtualNodeTlsValidationContextAcmTrustPropertyFromCloudFormation(properties.ACM) : undefined));
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subjectAlternativeNames", CfnVirtualNodeSubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
  errors.collect(cdk.propertyValidator("trust", cdk.requiredValidator)(properties.trust));
  errors.collect(cdk.propertyValidator("trust", CfnVirtualNodeTlsValidationContextTrustPropertyValidator)(properties.trust));
  return errors.wrap("supplied properties not correct for \"TlsValidationContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTlsValidationContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTlsValidationContextPropertyValidator(properties).assertSuccess();
  return {
    "SubjectAlternativeNames": convertCfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
    "Trust": convertCfnVirtualNodeTlsValidationContextTrustPropertyToCloudFormation(properties.trust)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TlsValidationContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextProperty>();
  ret.addPropertyResult("subjectAlternativeNames", "SubjectAlternativeNames", (properties.SubjectAlternativeNames != null ? CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined));
  ret.addPropertyResult("trust", "Trust", (properties.Trust != null ? CfnVirtualNodeTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsSdsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsSdsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsSdsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretName", cdk.requiredValidator)(properties.secretName));
  errors.collect(cdk.propertyValidator("secretName", cdk.validateString)(properties.secretName));
  return errors.wrap("supplied properties not correct for \"ListenerTlsSdsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsSdsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "SecretName": cdk.stringToCloudFormation(properties.secretName)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsSdsCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsSdsCertificateProperty>();
  ret.addPropertyResult("secretName", "SecretName", (properties.SecretName != null ? cfn_parse.FromCloudFormation.getString(properties.SecretName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsFileCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsFileCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsFileCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateChain", cdk.requiredValidator)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("privateKey", cdk.requiredValidator)(properties.privateKey));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  return errors.wrap("supplied properties not correct for \"ListenerTlsFileCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsFileCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsFileCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsFileCertificateProperty>();
  ret.addPropertyResult("certificateChain", "CertificateChain", (properties.CertificateChain != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateChain) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ClientTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeClientTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualNodeListenerTlsFileCertificatePropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualNodeListenerTlsSdsCertificatePropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"ClientTlsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeClientTlsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeClientTlsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientTlsCertificateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientTlsCertificateProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientPolicyTlsProperty`
 *
 * @param properties - the TypeScript properties of a `ClientPolicyTlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", CfnVirtualNodeClientTlsCertificatePropertyValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("enforce", cdk.validateBoolean)(properties.enforce));
  errors.collect(cdk.propertyValidator("ports", cdk.listValidator(cdk.validateNumber))(properties.ports));
  errors.collect(cdk.propertyValidator("validation", cdk.requiredValidator)(properties.validation));
  errors.collect(cdk.propertyValidator("validation", CfnVirtualNodeTlsValidationContextPropertyValidator)(properties.validation));
  return errors.wrap("supplied properties not correct for \"ClientPolicyTlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeClientPolicyTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeClientPolicyTlsPropertyValidator(properties).assertSuccess();
  return {
    "Certificate": convertCfnVirtualNodeClientTlsCertificatePropertyToCloudFormation(properties.certificate),
    "Enforce": cdk.booleanToCloudFormation(properties.enforce),
    "Ports": cdk.listMapper(cdk.numberToCloudFormation)(properties.ports),
    "Validation": convertCfnVirtualNodeTlsValidationContextPropertyToCloudFormation(properties.validation)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientPolicyTlsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientPolicyTlsProperty>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? CfnVirtualNodeClientTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined));
  ret.addPropertyResult("enforce", "Enforce", (properties.Enforce != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enforce) : undefined));
  ret.addPropertyResult("ports", "Ports", (properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Ports) : undefined));
  ret.addPropertyResult("validation", "Validation", (properties.Validation != null ? CfnVirtualNodeTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ClientPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tls", CfnVirtualNodeClientPolicyTlsPropertyValidator)(properties.tls));
  return errors.wrap("supplied properties not correct for \"ClientPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeClientPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeClientPolicyPropertyValidator(properties).assertSuccess();
  return {
    "TLS": convertCfnVirtualNodeClientPolicyTlsPropertyToCloudFormation(properties.tls)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientPolicyProperty>();
  ret.addPropertyResult("tls", "TLS", (properties.TLS != null ? CfnVirtualNodeClientPolicyTlsPropertyFromCloudFormation(properties.TLS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualServiceBackendProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceBackendProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualServiceBackendPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientPolicy", CfnVirtualNodeClientPolicyPropertyValidator)(properties.clientPolicy));
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.requiredValidator)(properties.virtualServiceName));
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.validateString)(properties.virtualServiceName));
  return errors.wrap("supplied properties not correct for \"VirtualServiceBackendProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualServiceBackendPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualServiceBackendPropertyValidator(properties).assertSuccess();
  return {
    "ClientPolicy": convertCfnVirtualNodeClientPolicyPropertyToCloudFormation(properties.clientPolicy),
    "VirtualServiceName": cdk.stringToCloudFormation(properties.virtualServiceName)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualServiceBackendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualServiceBackendProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualServiceBackendProperty>();
  ret.addPropertyResult("clientPolicy", "ClientPolicy", (properties.ClientPolicy != null ? CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined));
  ret.addPropertyResult("virtualServiceName", "VirtualServiceName", (properties.VirtualServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackendProperty`
 *
 * @param properties - the TypeScript properties of a `BackendProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeBackendPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("virtualService", CfnVirtualNodeVirtualServiceBackendPropertyValidator)(properties.virtualService));
  return errors.wrap("supplied properties not correct for \"BackendProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeBackendPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeBackendPropertyValidator(properties).assertSuccess();
  return {
    "VirtualService": convertCfnVirtualNodeVirtualServiceBackendPropertyToCloudFormation(properties.virtualService)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeBackendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.BackendProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.BackendProperty>();
  ret.addPropertyResult("virtualService", "VirtualService", (properties.VirtualService != null ? CfnVirtualNodeVirtualServiceBackendPropertyFromCloudFormation(properties.VirtualService) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeTcpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeTcpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxConnections", cdk.requiredValidator)(properties.maxConnections));
  errors.collect(cdk.propertyValidator("maxConnections", cdk.validateNumber)(properties.maxConnections));
  return errors.wrap("supplied properties not correct for \"VirtualNodeTcpConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxConnections": cdk.numberToCloudFormation(properties.maxConnections)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty>();
  ret.addPropertyResult("maxConnections", "MaxConnections", (properties.MaxConnections != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeHttp2ConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttp2ConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxRequests", cdk.requiredValidator)(properties.maxRequests));
  errors.collect(cdk.propertyValidator("maxRequests", cdk.validateNumber)(properties.maxRequests));
  return errors.wrap("supplied properties not correct for \"VirtualNodeHttp2ConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxRequests": cdk.numberToCloudFormation(properties.maxRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty>();
  ret.addPropertyResult("maxRequests", "MaxRequests", (properties.MaxRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeHttpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxConnections", cdk.requiredValidator)(properties.maxConnections));
  errors.collect(cdk.propertyValidator("maxConnections", cdk.validateNumber)(properties.maxConnections));
  errors.collect(cdk.propertyValidator("maxPendingRequests", cdk.validateNumber)(properties.maxPendingRequests));
  return errors.wrap("supplied properties not correct for \"VirtualNodeHttpConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxConnections": cdk.numberToCloudFormation(properties.maxConnections),
    "MaxPendingRequests": cdk.numberToCloudFormation(properties.maxPendingRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty>();
  ret.addPropertyResult("maxConnections", "MaxConnections", (properties.MaxConnections != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections) : undefined));
  ret.addPropertyResult("maxPendingRequests", "MaxPendingRequests", (properties.MaxPendingRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxPendingRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeGrpcConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeGrpcConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxRequests", cdk.requiredValidator)(properties.maxRequests));
  errors.collect(cdk.propertyValidator("maxRequests", cdk.validateNumber)(properties.maxRequests));
  return errors.wrap("supplied properties not correct for \"VirtualNodeGrpcConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "MaxRequests": cdk.numberToCloudFormation(properties.maxRequests)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty>();
  ret.addPropertyResult("maxRequests", "MaxRequests", (properties.MaxRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpc", CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyValidator)(properties.grpc));
  errors.collect(cdk.propertyValidator("http", CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyValidator)(properties.http));
  errors.collect(cdk.propertyValidator("http2", CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyValidator)(properties.http2));
  errors.collect(cdk.propertyValidator("tcp", CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyValidator)(properties.tcp));
  return errors.wrap("supplied properties not correct for \"VirtualNodeConnectionPoolProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeConnectionPoolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeConnectionPoolPropertyValidator(properties).assertSuccess();
  return {
    "GRPC": convertCfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyToCloudFormation(properties.grpc),
    "HTTP": convertCfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyToCloudFormation(properties.http),
    "HTTP2": convertCfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyToCloudFormation(properties.http2),
    "TCP": convertCfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyToCloudFormation(properties.tcp)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeConnectionPoolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeConnectionPoolProperty>();
  ret.addPropertyResult("grpc", "GRPC", (properties.GRPC != null ? CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyFromCloudFormation(properties.GRPC) : undefined));
  ret.addPropertyResult("http", "HTTP", (properties.HTTP != null ? CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyFromCloudFormation(properties.HTTP) : undefined));
  ret.addPropertyResult("http2", "HTTP2", (properties.HTTP2 != null ? CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyFromCloudFormation(properties.HTTP2) : undefined));
  ret.addPropertyResult("tcp", "TCP", (properties.TCP != null ? CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyFromCloudFormation(properties.TCP) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DurationProperty`
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeDurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"DurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeDurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeDurationPropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeDurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.DurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.DurationProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TcpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeTcpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnVirtualNodeDurationPropertyValidator)(properties.idle));
  return errors.wrap("supplied properties not correct for \"TcpTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeTcpTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeTcpTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.idle)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeTcpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.TcpTimeoutProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TcpTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeHttpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnVirtualNodeDurationPropertyValidator)(properties.idle));
  errors.collect(cdk.propertyValidator("perRequest", CfnVirtualNodeDurationPropertyValidator)(properties.perRequest));
  return errors.wrap("supplied properties not correct for \"HttpTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeHttpTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.idle),
    "PerRequest": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.perRequest)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.HttpTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addPropertyResult("perRequest", "PerRequest", (properties.PerRequest != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.PerRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrpcTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeGrpcTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idle", CfnVirtualNodeDurationPropertyValidator)(properties.idle));
  errors.collect(cdk.propertyValidator("perRequest", CfnVirtualNodeDurationPropertyValidator)(properties.perRequest));
  return errors.wrap("supplied properties not correct for \"GrpcTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeGrpcTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeGrpcTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "Idle": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.idle),
    "PerRequest": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.perRequest)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeGrpcTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.GrpcTimeoutProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.GrpcTimeoutProperty>();
  ret.addPropertyResult("idle", "Idle", (properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined));
  ret.addPropertyResult("perRequest", "PerRequest", (properties.PerRequest != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.PerRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpc", CfnVirtualNodeGrpcTimeoutPropertyValidator)(properties.grpc));
  errors.collect(cdk.propertyValidator("http", CfnVirtualNodeHttpTimeoutPropertyValidator)(properties.http));
  errors.collect(cdk.propertyValidator("http2", CfnVirtualNodeHttpTimeoutPropertyValidator)(properties.http2));
  errors.collect(cdk.propertyValidator("tcp", CfnVirtualNodeTcpTimeoutPropertyValidator)(properties.tcp));
  return errors.wrap("supplied properties not correct for \"ListenerTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "GRPC": convertCfnVirtualNodeGrpcTimeoutPropertyToCloudFormation(properties.grpc),
    "HTTP": convertCfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties.http),
    "HTTP2": convertCfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties.http2),
    "TCP": convertCfnVirtualNodeTcpTimeoutPropertyToCloudFormation(properties.tcp)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTimeoutProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTimeoutProperty>();
  ret.addPropertyResult("grpc", "GRPC", (properties.GRPC != null ? CfnVirtualNodeGrpcTimeoutPropertyFromCloudFormation(properties.GRPC) : undefined));
  ret.addPropertyResult("http", "HTTP", (properties.HTTP != null ? CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties.HTTP) : undefined));
  ret.addPropertyResult("http2", "HTTP2", (properties.HTTP2 != null ? CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties.HTTP2) : undefined));
  ret.addPropertyResult("tcp", "TCP", (properties.TCP != null ? CfnVirtualNodeTcpTimeoutPropertyFromCloudFormation(properties.TCP) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthCheckProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeHealthCheckPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.requiredValidator)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.validateNumber)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("intervalMillis", cdk.requiredValidator)(properties.intervalMillis));
  errors.collect(cdk.propertyValidator("intervalMillis", cdk.validateNumber)(properties.intervalMillis));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("timeoutMillis", cdk.requiredValidator)(properties.timeoutMillis));
  errors.collect(cdk.propertyValidator("timeoutMillis", cdk.validateNumber)(properties.timeoutMillis));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.requiredValidator)(properties.unhealthyThreshold));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.validateNumber)(properties.unhealthyThreshold));
  return errors.wrap("supplied properties not correct for \"HealthCheckProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeHealthCheckPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeHealthCheckPropertyValidator(properties).assertSuccess();
  return {
    "HealthyThreshold": cdk.numberToCloudFormation(properties.healthyThreshold),
    "IntervalMillis": cdk.numberToCloudFormation(properties.intervalMillis),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "TimeoutMillis": cdk.numberToCloudFormation(properties.timeoutMillis),
    "UnhealthyThreshold": cdk.numberToCloudFormation(properties.unhealthyThreshold)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeHealthCheckPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.HealthCheckProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.HealthCheckProperty>();
  ret.addPropertyResult("healthyThreshold", "HealthyThreshold", (properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold) : undefined));
  ret.addPropertyResult("intervalMillis", "IntervalMillis", (properties.IntervalMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalMillis) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("timeoutMillis", "TimeoutMillis", (properties.TimeoutMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMillis) : undefined));
  ret.addPropertyResult("unhealthyThreshold", "UnhealthyThreshold", (properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("file", CfnVirtualNodeTlsValidationContextFileTrustPropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualNodeTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"ListenerTlsValidationContextTrustProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
  return {
    "File": convertCfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsValidationContextTrustProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsValidationContextTrustProperty>();
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subjectAlternativeNames", CfnVirtualNodeSubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
  errors.collect(cdk.propertyValidator("trust", cdk.requiredValidator)(properties.trust));
  errors.collect(cdk.propertyValidator("trust", CfnVirtualNodeListenerTlsValidationContextTrustPropertyValidator)(properties.trust));
  return errors.wrap("supplied properties not correct for \"ListenerTlsValidationContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsValidationContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsValidationContextPropertyValidator(properties).assertSuccess();
  return {
    "SubjectAlternativeNames": convertCfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
    "Trust": convertCfnVirtualNodeListenerTlsValidationContextTrustPropertyToCloudFormation(properties.trust)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsValidationContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsValidationContextProperty>();
  ret.addPropertyResult("subjectAlternativeNames", "SubjectAlternativeNames", (properties.SubjectAlternativeNames != null ? CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined));
  ret.addPropertyResult("trust", "Trust", (properties.Trust != null ? CfnVirtualNodeListenerTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsAcmCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsAcmCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsAcmCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  return errors.wrap("supplied properties not correct for \"ListenerTlsAcmCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsAcmCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsAcmCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsAcmCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsAcmCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsAcmCertificateProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acm", CfnVirtualNodeListenerTlsAcmCertificatePropertyValidator)(properties.acm));
  errors.collect(cdk.propertyValidator("file", CfnVirtualNodeListenerTlsFileCertificatePropertyValidator)(properties.file));
  errors.collect(cdk.propertyValidator("sds", CfnVirtualNodeListenerTlsSdsCertificatePropertyValidator)(properties.sds));
  return errors.wrap("supplied properties not correct for \"ListenerTlsCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsCertificatePropertyValidator(properties).assertSuccess();
  return {
    "ACM": convertCfnVirtualNodeListenerTlsAcmCertificatePropertyToCloudFormation(properties.acm),
    "File": convertCfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
    "SDS": convertCfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsCertificateProperty>();
  ret.addPropertyResult("acm", "ACM", (properties.ACM != null ? CfnVirtualNodeListenerTlsAcmCertificatePropertyFromCloudFormation(properties.ACM) : undefined));
  ret.addPropertyResult("file", "File", (properties.File != null ? CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined));
  ret.addPropertyResult("sds", "SDS", (properties.SDS != null ? CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerTlsProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", cdk.requiredValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("certificate", CfnVirtualNodeListenerTlsCertificatePropertyValidator)(properties.certificate));
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("validation", CfnVirtualNodeListenerTlsValidationContextPropertyValidator)(properties.validation));
  return errors.wrap("supplied properties not correct for \"ListenerTlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerTlsPropertyValidator(properties).assertSuccess();
  return {
    "Certificate": convertCfnVirtualNodeListenerTlsCertificatePropertyToCloudFormation(properties.certificate),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Validation": convertCfnVirtualNodeListenerTlsValidationContextPropertyToCloudFormation(properties.validation)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerTlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsProperty>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? CfnVirtualNodeListenerTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("validation", "Validation", (properties.Validation != null ? CfnVirtualNodeListenerTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodePortMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"PortMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodePortMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodePortMappingPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodePortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.PortMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.PortMappingProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutlierDetectionProperty`
 *
 * @param properties - the TypeScript properties of a `OutlierDetectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeOutlierDetectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseEjectionDuration", cdk.requiredValidator)(properties.baseEjectionDuration));
  errors.collect(cdk.propertyValidator("baseEjectionDuration", CfnVirtualNodeDurationPropertyValidator)(properties.baseEjectionDuration));
  errors.collect(cdk.propertyValidator("interval", cdk.requiredValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("interval", CfnVirtualNodeDurationPropertyValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("maxEjectionPercent", cdk.requiredValidator)(properties.maxEjectionPercent));
  errors.collect(cdk.propertyValidator("maxEjectionPercent", cdk.validateNumber)(properties.maxEjectionPercent));
  errors.collect(cdk.propertyValidator("maxServerErrors", cdk.requiredValidator)(properties.maxServerErrors));
  errors.collect(cdk.propertyValidator("maxServerErrors", cdk.validateNumber)(properties.maxServerErrors));
  return errors.wrap("supplied properties not correct for \"OutlierDetectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeOutlierDetectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeOutlierDetectionPropertyValidator(properties).assertSuccess();
  return {
    "BaseEjectionDuration": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.baseEjectionDuration),
    "Interval": convertCfnVirtualNodeDurationPropertyToCloudFormation(properties.interval),
    "MaxEjectionPercent": cdk.numberToCloudFormation(properties.maxEjectionPercent),
    "MaxServerErrors": cdk.numberToCloudFormation(properties.maxServerErrors)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeOutlierDetectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.OutlierDetectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.OutlierDetectionProperty>();
  ret.addPropertyResult("baseEjectionDuration", "BaseEjectionDuration", (properties.BaseEjectionDuration != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.BaseEjectionDuration) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Interval) : undefined));
  ret.addPropertyResult("maxEjectionPercent", "MaxEjectionPercent", (properties.MaxEjectionPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxEjectionPercent) : undefined));
  ret.addPropertyResult("maxServerErrors", "MaxServerErrors", (properties.MaxServerErrors != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxServerErrors) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenerProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeListenerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionPool", CfnVirtualNodeVirtualNodeConnectionPoolPropertyValidator)(properties.connectionPool));
  errors.collect(cdk.propertyValidator("healthCheck", CfnVirtualNodeHealthCheckPropertyValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("outlierDetection", CfnVirtualNodeOutlierDetectionPropertyValidator)(properties.outlierDetection));
  errors.collect(cdk.propertyValidator("portMapping", cdk.requiredValidator)(properties.portMapping));
  errors.collect(cdk.propertyValidator("portMapping", CfnVirtualNodePortMappingPropertyValidator)(properties.portMapping));
  errors.collect(cdk.propertyValidator("tls", CfnVirtualNodeListenerTlsPropertyValidator)(properties.tls));
  errors.collect(cdk.propertyValidator("timeout", CfnVirtualNodeListenerTimeoutPropertyValidator)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"ListenerProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeListenerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeListenerPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionPool": convertCfnVirtualNodeVirtualNodeConnectionPoolPropertyToCloudFormation(properties.connectionPool),
    "HealthCheck": convertCfnVirtualNodeHealthCheckPropertyToCloudFormation(properties.healthCheck),
    "OutlierDetection": convertCfnVirtualNodeOutlierDetectionPropertyToCloudFormation(properties.outlierDetection),
    "PortMapping": convertCfnVirtualNodePortMappingPropertyToCloudFormation(properties.portMapping),
    "TLS": convertCfnVirtualNodeListenerTlsPropertyToCloudFormation(properties.tls),
    "Timeout": convertCfnVirtualNodeListenerTimeoutPropertyToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ListenerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerProperty>();
  ret.addPropertyResult("connectionPool", "ConnectionPool", (properties.ConnectionPool != null ? CfnVirtualNodeVirtualNodeConnectionPoolPropertyFromCloudFormation(properties.ConnectionPool) : undefined));
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? CfnVirtualNodeHealthCheckPropertyFromCloudFormation(properties.HealthCheck) : undefined));
  ret.addPropertyResult("outlierDetection", "OutlierDetection", (properties.OutlierDetection != null ? CfnVirtualNodeOutlierDetectionPropertyFromCloudFormation(properties.OutlierDetection) : undefined));
  ret.addPropertyResult("portMapping", "PortMapping", (properties.PortMapping != null ? CfnVirtualNodePortMappingPropertyFromCloudFormation(properties.PortMapping) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? CfnVirtualNodeListenerTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined));
  ret.addPropertyResult("tls", "TLS", (properties.TLS != null ? CfnVirtualNodeListenerTlsPropertyFromCloudFormation(properties.TLS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackendDefaultsProperty`
 *
 * @param properties - the TypeScript properties of a `BackendDefaultsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeBackendDefaultsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientPolicy", CfnVirtualNodeClientPolicyPropertyValidator)(properties.clientPolicy));
  return errors.wrap("supplied properties not correct for \"BackendDefaultsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeBackendDefaultsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeBackendDefaultsPropertyValidator(properties).assertSuccess();
  return {
    "ClientPolicy": convertCfnVirtualNodeClientPolicyPropertyToCloudFormation(properties.clientPolicy)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeBackendDefaultsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.BackendDefaultsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.BackendDefaultsProperty>();
  ret.addPropertyResult("clientPolicy", "ClientPolicy", (properties.ClientPolicy != null ? CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DnsServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `DnsServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeDnsServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", cdk.requiredValidator)(properties.hostname));
  errors.collect(cdk.propertyValidator("hostname", cdk.validateString)(properties.hostname));
  errors.collect(cdk.propertyValidator("ipPreference", cdk.validateString)(properties.ipPreference));
  errors.collect(cdk.propertyValidator("responseType", cdk.validateString)(properties.responseType));
  return errors.wrap("supplied properties not correct for \"DnsServiceDiscoveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeDnsServiceDiscoveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeDnsServiceDiscoveryPropertyValidator(properties).assertSuccess();
  return {
    "Hostname": cdk.stringToCloudFormation(properties.hostname),
    "IpPreference": cdk.stringToCloudFormation(properties.ipPreference),
    "ResponseType": cdk.stringToCloudFormation(properties.responseType)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeDnsServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.DnsServiceDiscoveryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.DnsServiceDiscoveryProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined));
  ret.addPropertyResult("ipPreference", "IpPreference", (properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined));
  ret.addPropertyResult("responseType", "ResponseType", (properties.ResponseType != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsCloudMapInstanceAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapInstanceAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapInstanceAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AwsCloudMapInstanceAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeAwsCloudMapInstanceAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeAwsCloudMapInstanceAttributePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapInstanceAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsCloudMapServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(CfnVirtualNodeAwsCloudMapInstanceAttributePropertyValidator))(properties.attributes));
  errors.collect(cdk.propertyValidator("ipPreference", cdk.validateString)(properties.ipPreference));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.requiredValidator)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.validateString)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.requiredValidator)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  return errors.wrap("supplied properties not correct for \"AwsCloudMapServiceDiscoveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(convertCfnVirtualNodeAwsCloudMapInstanceAttributePropertyToCloudFormation)(properties.attributes),
    "IpPreference": cdk.stringToCloudFormation(properties.ipPreference),
    "NamespaceName": cdk.stringToCloudFormation(properties.namespaceName),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeAwsCloudMapInstanceAttributePropertyFromCloudFormation)(properties.Attributes) : undefined));
  ret.addPropertyResult("ipPreference", "IpPreference", (properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined));
  ret.addPropertyResult("namespaceName", "NamespaceName", (properties.NamespaceName != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceName) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsCloudMap", CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyValidator)(properties.awsCloudMap));
  errors.collect(cdk.propertyValidator("dns", CfnVirtualNodeDnsServiceDiscoveryPropertyValidator)(properties.dns));
  return errors.wrap("supplied properties not correct for \"ServiceDiscoveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeServiceDiscoveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeServiceDiscoveryPropertyValidator(properties).assertSuccess();
  return {
    "AWSCloudMap": convertCfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyToCloudFormation(properties.awsCloudMap),
    "DNS": convertCfnVirtualNodeDnsServiceDiscoveryPropertyToCloudFormation(properties.dns)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.ServiceDiscoveryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ServiceDiscoveryProperty>();
  ret.addPropertyResult("awsCloudMap", "AWSCloudMap", (properties.AWSCloudMap != null ? CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyFromCloudFormation(properties.AWSCloudMap) : undefined));
  ret.addPropertyResult("dns", "DNS", (properties.DNS != null ? CfnVirtualNodeDnsServiceDiscoveryPropertyFromCloudFormation(properties.DNS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backendDefaults", CfnVirtualNodeBackendDefaultsPropertyValidator)(properties.backendDefaults));
  errors.collect(cdk.propertyValidator("backends", cdk.listValidator(CfnVirtualNodeBackendPropertyValidator))(properties.backends));
  errors.collect(cdk.propertyValidator("listeners", cdk.listValidator(CfnVirtualNodeListenerPropertyValidator))(properties.listeners));
  errors.collect(cdk.propertyValidator("logging", CfnVirtualNodeLoggingPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("serviceDiscovery", CfnVirtualNodeServiceDiscoveryPropertyValidator)(properties.serviceDiscovery));
  return errors.wrap("supplied properties not correct for \"VirtualNodeSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodeVirtualNodeSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodeVirtualNodeSpecPropertyValidator(properties).assertSuccess();
  return {
    "BackendDefaults": convertCfnVirtualNodeBackendDefaultsPropertyToCloudFormation(properties.backendDefaults),
    "Backends": cdk.listMapper(convertCfnVirtualNodeBackendPropertyToCloudFormation)(properties.backends),
    "Listeners": cdk.listMapper(convertCfnVirtualNodeListenerPropertyToCloudFormation)(properties.listeners),
    "Logging": convertCfnVirtualNodeLoggingPropertyToCloudFormation(properties.logging),
    "ServiceDiscovery": convertCfnVirtualNodeServiceDiscoveryPropertyToCloudFormation(properties.serviceDiscovery)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualNode.VirtualNodeSpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeSpecProperty>();
  ret.addPropertyResult("backendDefaults", "BackendDefaults", (properties.BackendDefaults != null ? CfnVirtualNodeBackendDefaultsPropertyFromCloudFormation(properties.BackendDefaults) : undefined));
  ret.addPropertyResult("backends", "Backends", (properties.Backends != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeBackendPropertyFromCloudFormation)(properties.Backends) : undefined));
  ret.addPropertyResult("listeners", "Listeners", (properties.Listeners != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeListenerPropertyFromCloudFormation)(properties.Listeners) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnVirtualNodeLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("serviceDiscovery", "ServiceDiscovery", (properties.ServiceDiscovery != null ? CfnVirtualNodeServiceDiscoveryPropertyFromCloudFormation(properties.ServiceDiscovery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualNodeProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualNodeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualNodePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnVirtualNodeVirtualNodeSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualNodeName", cdk.validateString)(properties.virtualNodeName));
  return errors.wrap("supplied properties not correct for \"CfnVirtualNodeProps\"");
}

// @ts-ignore TS6133
function convertCfnVirtualNodePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualNodePropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "Spec": convertCfnVirtualNodeVirtualNodeSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualNodeName": cdk.stringToCloudFormation(properties.virtualNodeName)
  };
}

// @ts-ignore TS6133
function CfnVirtualNodePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNodeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNodeProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnVirtualNodeVirtualNodeSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualNodeName", "VirtualNodeName", (properties.VirtualNodeName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualNodeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a virtual router within a service mesh.
 *
 * Specify a `listener` for any inbound traffic that your virtual router receives. Create a virtual router for each protocol and port that you need to route. Virtual routers handle traffic for one or more virtual services within your mesh. After you create your virtual router, create and associate routes for your virtual router that direct incoming requests to different virtual nodes.
 *
 * For more information about virtual routers, see [Virtual routers](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_routers.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualRouter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html
 */
export class CfnVirtualRouter extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::VirtualRouter";

  /**
   * Build a CfnVirtualRouter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualRouter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVirtualRouterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVirtualRouter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the virtual router.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the virtual router resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the virtual router.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual router.
   *
   * @cloudformationAttribute VirtualRouterName
   */
  public readonly attrVirtualRouterName: string;

  /**
   * The name of the service mesh to create the virtual router in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The virtual router specification to apply.
   */
  public spec: cdk.IResolvable | CfnVirtualRouter.VirtualRouterSpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the virtual router to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual router.
   */
  public virtualRouterName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVirtualRouterProps) {
    super(scope, id, {
      "type": CfnVirtualRouter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualRouterName = cdk.Token.asString(this.getAtt("VirtualRouterName", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualRouter", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualRouterName = props.virtualRouterName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualRouterName": this.virtualRouterName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualRouter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVirtualRouterPropsToCloudFormation(props);
  }
}

export namespace CfnVirtualRouter {
  /**
   * An object that represents the specification of a virtual router.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterspec.html
   */
  export interface VirtualRouterSpecProperty {
    /**
     * The listeners that the virtual router is expected to receive inbound traffic from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterspec.html#cfn-appmesh-virtualrouter-virtualrouterspec-listeners
     */
    readonly listeners: Array<cdk.IResolvable | CfnVirtualRouter.VirtualRouterListenerProperty> | cdk.IResolvable;
  }

  /**
   * An object that represents a virtual router listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterlistener.html
   */
  export interface VirtualRouterListenerProperty {
    /**
     * The port mapping information for the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterlistener.html#cfn-appmesh-virtualrouter-virtualrouterlistener-portmapping
     */
    readonly portMapping: cdk.IResolvable | CfnVirtualRouter.PortMappingProperty;
  }

  /**
   * An object representing a virtual router listener port mapping.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html
   */
  export interface PortMappingProperty {
    /**
     * The port used for the port mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html#cfn-appmesh-virtualrouter-portmapping-port
     */
    readonly port: number;

    /**
     * The protocol used for the port mapping.
     *
     * Specify one protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html#cfn-appmesh-virtualrouter-portmapping-protocol
     */
    readonly protocol: string;
  }
}

/**
 * Properties for defining a `CfnVirtualRouter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html
 */
export interface CfnVirtualRouterProps {
  /**
   * The name of the service mesh to create the virtual router in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The virtual router specification to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-spec
   */
  readonly spec: cdk.IResolvable | CfnVirtualRouter.VirtualRouterSpecProperty;

  /**
   * Optional metadata that you can apply to the virtual router to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual router.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-virtualroutername
   */
  readonly virtualRouterName?: string;
}

/**
 * Determine whether the given properties match those of a `PortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualRouterPortMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"PortMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualRouterPortMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualRouterPortMappingPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnVirtualRouterPortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualRouter.PortMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.PortMappingProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualRouterListenerProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterListenerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterListenerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("portMapping", cdk.requiredValidator)(properties.portMapping));
  errors.collect(cdk.propertyValidator("portMapping", CfnVirtualRouterPortMappingPropertyValidator)(properties.portMapping));
  return errors.wrap("supplied properties not correct for \"VirtualRouterListenerProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualRouterVirtualRouterListenerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualRouterVirtualRouterListenerPropertyValidator(properties).assertSuccess();
  return {
    "PortMapping": convertCfnVirtualRouterPortMappingPropertyToCloudFormation(properties.portMapping)
  };
}

// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualRouter.VirtualRouterListenerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.VirtualRouterListenerProperty>();
  ret.addPropertyResult("portMapping", "PortMapping", (properties.PortMapping != null ? CfnVirtualRouterPortMappingPropertyFromCloudFormation(properties.PortMapping) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualRouterSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("listeners", cdk.requiredValidator)(properties.listeners));
  errors.collect(cdk.propertyValidator("listeners", cdk.listValidator(CfnVirtualRouterVirtualRouterListenerPropertyValidator))(properties.listeners));
  return errors.wrap("supplied properties not correct for \"VirtualRouterSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualRouterVirtualRouterSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualRouterVirtualRouterSpecPropertyValidator(properties).assertSuccess();
  return {
    "Listeners": cdk.listMapper(convertCfnVirtualRouterVirtualRouterListenerPropertyToCloudFormation)(properties.listeners)
  };
}

// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualRouter.VirtualRouterSpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.VirtualRouterSpecProperty>();
  ret.addPropertyResult("listeners", "Listeners", (properties.Listeners != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualRouterVirtualRouterListenerPropertyFromCloudFormation)(properties.Listeners) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualRouterProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualRouterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualRouterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnVirtualRouterVirtualRouterSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualRouterName", cdk.validateString)(properties.virtualRouterName));
  return errors.wrap("supplied properties not correct for \"CfnVirtualRouterProps\"");
}

// @ts-ignore TS6133
function convertCfnVirtualRouterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualRouterPropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "Spec": convertCfnVirtualRouterVirtualRouterSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualRouterName": cdk.stringToCloudFormation(properties.virtualRouterName)
  };
}

// @ts-ignore TS6133
function CfnVirtualRouterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualRouterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouterProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnVirtualRouterVirtualRouterSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualRouterName", "VirtualRouterName", (properties.VirtualRouterName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a virtual service within a service mesh.
 *
 * A virtual service is an abstraction of a real service that is provided by a virtual node directly or indirectly by means of a virtual router. Dependent services call your virtual service by its `virtualServiceName` , and those requests are routed to the virtual node or virtual router that is specified as the provider for the virtual service.
 *
 * For more information about virtual services, see [Virtual services](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualService
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html
 */
export class CfnVirtualService extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppMesh::VirtualService";

  /**
   * Build a CfnVirtualService from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualService {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVirtualServicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVirtualService(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for the virtual service.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the service mesh that the virtual service resides in.
   *
   * @cloudformationAttribute MeshName
   */
  public readonly attrMeshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute MeshOwner
   */
  public readonly attrMeshOwner: string;

  /**
   * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @cloudformationAttribute ResourceOwner
   */
  public readonly attrResourceOwner: string;

  /**
   * The unique identifier for the virtual service.
   *
   * @cloudformationAttribute Uid
   */
  public readonly attrUid: string;

  /**
   * The name of the virtual service.
   *
   * @cloudformationAttribute VirtualServiceName
   */
  public readonly attrVirtualServiceName: string;

  /**
   * The name of the service mesh to create the virtual service in.
   */
  public meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   */
  public meshOwner?: string;

  /**
   * The virtual service specification to apply.
   */
  public spec: cdk.IResolvable | CfnVirtualService.VirtualServiceSpecProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you can apply to the virtual service to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual service.
   */
  public virtualServiceName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVirtualServiceProps) {
    super(scope, id, {
      "type": CfnVirtualService.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "meshName", this);
    cdk.requireProperty(props, "spec", this);
    cdk.requireProperty(props, "virtualServiceName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMeshName = cdk.Token.asString(this.getAtt("MeshName", cdk.ResolutionTypeHint.STRING));
    this.attrMeshOwner = cdk.Token.asString(this.getAtt("MeshOwner", cdk.ResolutionTypeHint.STRING));
    this.attrResourceOwner = cdk.Token.asString(this.getAtt("ResourceOwner", cdk.ResolutionTypeHint.STRING));
    this.attrUid = cdk.Token.asString(this.getAtt("Uid", cdk.ResolutionTypeHint.STRING));
    this.attrVirtualServiceName = cdk.Token.asString(this.getAtt("VirtualServiceName", cdk.ResolutionTypeHint.STRING));
    this.meshName = props.meshName;
    this.meshOwner = props.meshOwner;
    this.spec = props.spec;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualService", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.virtualServiceName = props.virtualServiceName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "meshName": this.meshName,
      "meshOwner": this.meshOwner,
      "spec": this.spec,
      "tags": this.tags.renderTags(),
      "virtualServiceName": this.virtualServiceName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualService.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVirtualServicePropsToCloudFormation(props);
  }
}

export namespace CfnVirtualService {
  /**
   * An object that represents the specification of a virtual service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualservicespec.html
   */
  export interface VirtualServiceSpecProperty {
    /**
     * The App Mesh object that is acting as the provider for a virtual service.
     *
     * You can specify a single virtual node or virtual router.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualservicespec.html#cfn-appmesh-virtualservice-virtualservicespec-provider
     */
    readonly provider?: cdk.IResolvable | CfnVirtualService.VirtualServiceProviderProperty;
  }

  /**
   * An object that represents the provider for a virtual service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html
   */
  export interface VirtualServiceProviderProperty {
    /**
     * The virtual node associated with a virtual service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html#cfn-appmesh-virtualservice-virtualserviceprovider-virtualnode
     */
    readonly virtualNode?: cdk.IResolvable | CfnVirtualService.VirtualNodeServiceProviderProperty;

    /**
     * The virtual router associated with a virtual service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html#cfn-appmesh-virtualservice-virtualserviceprovider-virtualrouter
     */
    readonly virtualRouter?: cdk.IResolvable | CfnVirtualService.VirtualRouterServiceProviderProperty;
  }

  /**
   * An object that represents a virtual node service provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualnodeserviceprovider.html
   */
  export interface VirtualNodeServiceProviderProperty {
    /**
     * The name of the virtual node that is acting as a service provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualnodeserviceprovider.html#cfn-appmesh-virtualservice-virtualnodeserviceprovider-virtualnodename
     */
    readonly virtualNodeName: string;
  }

  /**
   * An object that represents a virtual node service provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualrouterserviceprovider.html
   */
  export interface VirtualRouterServiceProviderProperty {
    /**
     * The name of the virtual router that is acting as a service provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualrouterserviceprovider.html#cfn-appmesh-virtualservice-virtualrouterserviceprovider-virtualroutername
     */
    readonly virtualRouterName: string;
  }
}

/**
 * Properties for defining a `CfnVirtualService`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html
 */
export interface CfnVirtualServiceProps {
  /**
   * The name of the service mesh to create the virtual service in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshname
   */
  readonly meshName: string;

  /**
   * The AWS IAM account ID of the service mesh owner.
   *
   * If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshowner
   */
  readonly meshOwner?: string;

  /**
   * The virtual service specification to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-spec
   */
  readonly spec: cdk.IResolvable | CfnVirtualService.VirtualServiceSpecProperty;

  /**
   * Optional metadata that you can apply to the virtual service to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name to use for the virtual service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-virtualservicename
   */
  readonly virtualServiceName: string;
}

/**
 * Determine whether the given properties match those of a `VirtualNodeServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualServiceVirtualNodeServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("virtualNodeName", cdk.requiredValidator)(properties.virtualNodeName));
  errors.collect(cdk.propertyValidator("virtualNodeName", cdk.validateString)(properties.virtualNodeName));
  return errors.wrap("supplied properties not correct for \"VirtualNodeServiceProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualServiceVirtualNodeServiceProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualServiceVirtualNodeServiceProviderPropertyValidator(properties).assertSuccess();
  return {
    "VirtualNodeName": cdk.stringToCloudFormation(properties.virtualNodeName)
  };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualNodeServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualService.VirtualNodeServiceProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualNodeServiceProviderProperty>();
  ret.addPropertyResult("virtualNodeName", "VirtualNodeName", (properties.VirtualNodeName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualNodeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualRouterServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualServiceVirtualRouterServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("virtualRouterName", cdk.requiredValidator)(properties.virtualRouterName));
  errors.collect(cdk.propertyValidator("virtualRouterName", cdk.validateString)(properties.virtualRouterName));
  return errors.wrap("supplied properties not correct for \"VirtualRouterServiceProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualServiceVirtualRouterServiceProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualServiceVirtualRouterServiceProviderPropertyValidator(properties).assertSuccess();
  return {
    "VirtualRouterName": cdk.stringToCloudFormation(properties.virtualRouterName)
  };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualRouterServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualService.VirtualRouterServiceProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualRouterServiceProviderProperty>();
  ret.addPropertyResult("virtualRouterName", "VirtualRouterName", (properties.VirtualRouterName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("virtualNode", CfnVirtualServiceVirtualNodeServiceProviderPropertyValidator)(properties.virtualNode));
  errors.collect(cdk.propertyValidator("virtualRouter", CfnVirtualServiceVirtualRouterServiceProviderPropertyValidator)(properties.virtualRouter));
  return errors.wrap("supplied properties not correct for \"VirtualServiceProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualServiceVirtualServiceProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualServiceVirtualServiceProviderPropertyValidator(properties).assertSuccess();
  return {
    "VirtualNode": convertCfnVirtualServiceVirtualNodeServiceProviderPropertyToCloudFormation(properties.virtualNode),
    "VirtualRouter": convertCfnVirtualServiceVirtualRouterServiceProviderPropertyToCloudFormation(properties.virtualRouter)
  };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualService.VirtualServiceProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualServiceProviderProperty>();
  ret.addPropertyResult("virtualNode", "VirtualNode", (properties.VirtualNode != null ? CfnVirtualServiceVirtualNodeServiceProviderPropertyFromCloudFormation(properties.VirtualNode) : undefined));
  ret.addPropertyResult("virtualRouter", "VirtualRouter", (properties.VirtualRouter != null ? CfnVirtualServiceVirtualRouterServiceProviderPropertyFromCloudFormation(properties.VirtualRouter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VirtualServiceSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceSpecProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceSpecPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provider", CfnVirtualServiceVirtualServiceProviderPropertyValidator)(properties.provider));
  return errors.wrap("supplied properties not correct for \"VirtualServiceSpecProperty\"");
}

// @ts-ignore TS6133
function convertCfnVirtualServiceVirtualServiceSpecPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualServiceVirtualServiceSpecPropertyValidator(properties).assertSuccess();
  return {
    "Provider": convertCfnVirtualServiceVirtualServiceProviderPropertyToCloudFormation(properties.provider)
  };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVirtualService.VirtualServiceSpecProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualServiceSpecProperty>();
  ret.addPropertyResult("provider", "Provider", (properties.Provider != null ? CfnVirtualServiceVirtualServiceProviderPropertyFromCloudFormation(properties.Provider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualServiceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualServicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meshName", cdk.requiredValidator)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshName", cdk.validateString)(properties.meshName));
  errors.collect(cdk.propertyValidator("meshOwner", cdk.validateString)(properties.meshOwner));
  errors.collect(cdk.propertyValidator("spec", cdk.requiredValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("spec", CfnVirtualServiceVirtualServiceSpecPropertyValidator)(properties.spec));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.requiredValidator)(properties.virtualServiceName));
  errors.collect(cdk.propertyValidator("virtualServiceName", cdk.validateString)(properties.virtualServiceName));
  return errors.wrap("supplied properties not correct for \"CfnVirtualServiceProps\"");
}

// @ts-ignore TS6133
function convertCfnVirtualServicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualServicePropsValidator(properties).assertSuccess();
  return {
    "MeshName": cdk.stringToCloudFormation(properties.meshName),
    "MeshOwner": cdk.stringToCloudFormation(properties.meshOwner),
    "Spec": convertCfnVirtualServiceVirtualServiceSpecPropertyToCloudFormation(properties.spec),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VirtualServiceName": cdk.stringToCloudFormation(properties.virtualServiceName)
  };
}

// @ts-ignore TS6133
function CfnVirtualServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualServiceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualServiceProps>();
  ret.addPropertyResult("meshName", "MeshName", (properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined));
  ret.addPropertyResult("meshOwner", "MeshOwner", (properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined));
  ret.addPropertyResult("spec", "Spec", (properties.Spec != null ? CfnVirtualServiceVirtualServiceSpecPropertyFromCloudFormation(properties.Spec) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("virtualServiceName", "VirtualServiceName", (properties.VirtualServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}