import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { State } from './states/state';
/**
 * A collection of connected states
 *
 * A StateGraph is used to keep track of all states that are connected (have
 * transitions between them). It does not include the substatemachines in
 * a Parallel's branches: those are their own StateGraphs, but the graphs
 * themselves have a hierarchical relationship as well.
 *
 * By assigning states to a definitive StateGraph, we verify that no state
 * machines are constructed. In particular:
 *
 * - Every state object can only ever be in 1 StateGraph, and not inadvertently
 *   be used in two graphs.
 * - Every stateId must be unique across all states in the entire state
 *   machine.
 *
 * All policy statements in all states in all substatemachines are bubbled so
 * that the top-level StateMachine instantiation can read them all and add
 * them to the IAM Role.
 *
 * You do not need to instantiate this class; it is used internally.
 */
export declare class StateGraph {
    readonly startState: State;
    private readonly graphDescription;
    /**
     * Set a timeout to render into the graph JSON.
     *
     * Read/write. Only makes sense on the top-level graph, subgraphs
     * do not support this feature.
     *
     * @default No timeout
     */
    timeout?: Duration;
    /**
     * The accumulated policy statements
     */
    readonly policyStatements: iam.PolicyStatement[];
    /**
     * All states in this graph
     */
    private readonly allStates;
    /**
     * A mapping of stateId -> Graph for all states in this graph and subgraphs
     */
    private readonly allContainedStates;
    /**
     * Containing graph of this graph
     */
    private superGraph?;
    /**
     * @param startState state that gets executed when the state machine is launched
     * @param graphDescription description of the state machine
     */
    constructor(startState: State, graphDescription: string);
    /**
     * Register a state as part of this graph
     *
     * Called by State.bindToGraph().
     */
    registerState(state: State): void;
    /**
     * Register a Policy Statement used by states in this graph
     */
    registerPolicyStatement(statement: iam.PolicyStatement): void;
    /**
     * Register this graph as a child of the given graph
     *
     * Resource changes will be bubbled up to the given graph.
     */
    registerSuperGraph(graph: StateGraph): void;
    /**
     * Return the Amazon States Language JSON for this graph
     */
    toGraphJson(): object;
    /**
     * Return a string description of this graph
     */
    toString(): string;
    /**
     * Register a stateId and graph where it was registered
     */
    private registerContainedState;
    /**
     * Push all contained state info up to the given super graph
     */
    private pushContainedStatesUp;
    /**
     * Push all policy statements to into the given super graph
     */
    private pushPolicyStatementsUp;
}
