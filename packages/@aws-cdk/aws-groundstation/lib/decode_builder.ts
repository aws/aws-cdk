import { Frequency } from './config';

/**
 * Edge of decode graph
 */
export interface Edge {
  /**
   * Node from which the edge starts
   */
  readonly from: string

  /**
   * Node to which the edge ends
   */
  readonly to: string
}

/**
 * Different types of operators that can be applied to the decoding of the signal.
 *
 * Better explanations for the following are welcomed!
 */
export enum NodeType {
  /**
   * CODED_SYMBOLS_INGRESS
   */
  CODED_SYMBOLS_INGRESS = 'CODED_SYMBOLS_INGRESS',

  /**
   * IQ_RECOMBINER
   */
  IQ_RECOMBINER = 'IQ_RECOMBINER',

  /**
   * CCSDS_171_133_VITERBI_DECODER
   */
  CCSDS_171_133_VITERBI_DECODER = 'CCSDS_171_133_VITERBI_DECODER',

  /**
   * NRZ_M_DECODER
   */
  NRZ_M_DECODER = 'NRZ_M_DECODER',

  /**
   * UNCODED_FRAMES_EGRESS
   */
  UNCODED_FRAMES_EGRESS = 'UNCODED_FRAMES_EGRESS'
}


/**
 * Node for building decode config.
 */
export interface Node {
  /**
   * The type of decode node.
   */
  readonly type: NodeType
  /**
   * Miscellaneous properties relating to the node.
   */
  readonly [key: string]: any
}

/**
 * Configuration options for DecodeConfigBuilder.
 */
export interface DecodeConfig {
  /**
   * Edges of the decode graph.
   */
  readonly edges: Edge[],

  /**
   * Nodes of the decode graph.
   */
  readonly nodes: {[key: string]: Node}
}


/**
 * Helper class to build a decode object
 *
 * This class is used to build a decode object for a given frequency.
 *
 * @param edges Edges of the decode graph.
 * @param nodes Nodes of the decode graph.
 */
export class DecodeConfigBuilder {
  private edges: Edge[]
  private nodes: {[key: string]: Node}

  constructor({ edges, nodes }: DecodeConfig = { edges: [], nodes: {} }) {
    this.nodes = nodes;

    this.edges = [];
    edges.forEach(({ from, to }) => {
      if (this.nodes.hasOwnProperty(from) && this.nodes.hasOwnProperty(to)) {
        this.edges.push({ from, to });
      } else {
        throw Error(`${from} or ${to} not found in nodes`);
      }
    });
  }

  /**
   * toString returns the decode config as a JSON string.
   *
   * @returns the decode config as a JSON string
   */
  toString() {
    return JSON.stringify({ edges: this.edges, nodeConfigs: this.nodes });
  }

  /**
   * addNode will add a node to the decode config.
   *
   * @param name the name of the node
   * @param node the node object
   */
  addNode(name: string, node: Node) {
    this.nodes[name] = node;
  }

  /**
   * addEdge will add an edge to the decode config.
   *
   * @param from the name of the node from which the edge starts
   * @param to the name of the node from which the edge ends
   */
  addEdge(from: string, to: string) {
    if (this.nodes.hasOwnProperty(from) && this.nodes.hasOwnProperty(to)) {
      this.edges.push({ from, to });
    } else {
      throw Error(`${from} or ${to} not found in nodes`);
    }
  }
}

/**
 * Demodulation types currently supported
 */
export enum DemodType {
  /**
   * Quadrature Phase Shift Keying
   */
  QPSK = 'QPSK',

  /**
   * Offset Quadrature Phase Shift Keying
   */
  OQPSK = 'OQPSK',

  /**
   * Binary Phase Shift Keying
   */
  BPSK = 'BPSK',

  /**
   * Staggered Quadrature Phase Shift Keying
   */
  SQPSK = 'SQPSK',

  /**
   * Unbalanced Quadrature Phase Shift Keying
   */
  UAQPSK = 'UAQPSK',

  /**
   * 8 Phase Shift Keying
   */
  PSK_8 = '8PSK',

  /**
   * 16 and 32 Amplitude and Phase Shift Keying
   */
  APSK_16_32 = '16/32 APSK',

  /**
   * Minimum-Shift Keying
   */
  MSK = 'MSK',

  /**
   * 16 Quadrature Amplitude Modulation
   */
  QAM_16 = '16QAM',

  /**
   * Gaussian Minimum Shift Keying
   */
  GMSK = 'GMSK'
}

/**
 * Demodulation configuration for QPSK
 */
export interface Qpsk {
  /**
   * Carrier Frequency Recovery
   */
  readonly carrierFrequencyRecovery: CarrierFrequencyRecovery;

  /**
   * Symbol Timing Recovery
   */
  readonly symbolTimingRecovery: SymbolTimingRecovery;
}

/**
 * Filter types available
 */
export enum Filter {
  /**
   * ROOT RAISED COSINE filter [learn more](https://en.wikipedia.org/wiki/Root-raised-cosine_filter)
   */
  ROOT_RAISED_COSINE = 'ROOT_RAISED_COSINE',
}

/**
 * Demodulation configuration for OQPSK
 */
export interface Oqpsk {
  /**
   * Carrier Frequency Recovery
   */
  readonly carrierFrequencyRecovery: CarrierFrequencyRecovery;

  /**
   * Symbol Timing Recovery
   */
  readonly symbolTimingRecovery: SymbolTimingRecovery;
}

/**
 * Timing units
 */
export enum TimingUnits {
  /**
   * Megasamples per second (Million samples per second)
   */
  MSPS = 'Msps',

  /**
   * Kilosamples per second (Thousand samples per second)
   */
  KSPS = 'ksps'
}

/**
 * Timing configuration
 */
export interface Timing {
  /**
   * Value of timing configuration
   */
  readonly value: number

  /**
   * Units of measurement
   */
  readonly units: TimingUnits
}

/**
 * Symbol configuration for timing recovery
 */
export interface SymbolTimingRecovery {
  /**
   * Symbol Rate
   */
  readonly symbolRate: Timing;

  /**
   * Range
   */
  readonly range: Timing;

  /**
   * Matched Filter
   */
  readonly matchedFilter: MatchedFilter;
}

/**
 * Filter configuration
 */
export interface MatchedFilter {

  /**
   * Type
   */
  readonly type: Filter;

  /**
   * Rolloff Factor
   */
  readonly rolloffFactor: number;
}

/**
 * Carrier frequency configuration
 */
export interface CarrierFrequencyRecovery {
  /**
   * Center Frequency
   */
  readonly centerFrequency: Frequency;

  /**
   * Range
   */
  readonly range: Frequency;
}

/**
 * Demodulation configuration for DemodConfigBuilder
 */
export interface DemodConfig {
  /**
   * Demodulation type
   */
  readonly type: DemodType;

  /**
   * Demodulation configuration
   *
   * @default None
   */
  readonly qpsk?: Qpsk;

  /**
   * OQPSK Configuration
   *
   * @default None
   */
  readonly oqpsk?: Oqpsk;
};

/**
 * Demodulation configuration builder for signal.
 */
export class DemodConfigBuilder {
  private config: DemodConfig

  constructor(config: DemodConfig) {
    this.config = config ;
  }

  /**
   * toString returns the demodulation config as a JSON string.
   *
   * @returns the demodulation configuration
   */
  toString() {
    return JSON.stringify(this.config);
  }
}