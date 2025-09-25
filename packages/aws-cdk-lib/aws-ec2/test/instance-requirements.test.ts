import { Size } from '../../core';
import {
  AcceleratorManufacturer,
  AcceleratorName,
  AcceleratorType,
  BareMetal,
  BurstablePerformance,
  CpuManufacturer,
  InstanceGeneration,
  InstanceRequirementsConfig,
  LocalStorage,
  LocalStorageType,
  renderInstanceRequirements,
} from '../lib';

describe('InstanceRequirements', () => {
  describe('Enums', () => {
    test('CpuManufacturer enum values', () => {
      expect(CpuManufacturer.INTEL).toBe('intel');
      expect(CpuManufacturer.AMD).toBe('amd');
      expect(CpuManufacturer.AMAZON_WEB_SERVICES).toBe('amazon-web-services');
    });

    test('InstanceGeneration enum values', () => {
      expect(InstanceGeneration.CURRENT).toBe('current');
      expect(InstanceGeneration.PREVIOUS).toBe('previous');
    });

    test('BareMetal enum values', () => {
      expect(BareMetal.INCLUDED).toBe('included');
      expect(BareMetal.REQUIRED).toBe('required');
      expect(BareMetal.EXCLUDED).toBe('excluded');
    });

    test('BurstablePerformance enum values', () => {
      expect(BurstablePerformance.INCLUDED).toBe('included');
      expect(BurstablePerformance.REQUIRED).toBe('required');
      expect(BurstablePerformance.EXCLUDED).toBe('excluded');
    });

    test('LocalStorage enum values', () => {
      expect(LocalStorage.INCLUDED).toBe('included');
      expect(LocalStorage.REQUIRED).toBe('required');
      expect(LocalStorage.EXCLUDED).toBe('excluded');
    });

    test('LocalStorageType enum values', () => {
      expect(LocalStorageType.HDD).toBe('hdd');
      expect(LocalStorageType.SSD).toBe('ssd');
    });

    test('AcceleratorType enum values', () => {
      expect(AcceleratorType.GPU).toBe('gpu');
      expect(AcceleratorType.FPGA).toBe('fpga');
      expect(AcceleratorType.INFERENCE).toBe('inference');
    });

    test('AcceleratorManufacturer enum values', () => {
      expect(AcceleratorManufacturer.AMAZON_WEB_SERVICES).toBe('amazon-web-services');
      expect(AcceleratorManufacturer.AMD).toBe('amd');
      expect(AcceleratorManufacturer.HABANA).toBe('habana');
      expect(AcceleratorManufacturer.NVIDIA).toBe('nvidia');
      expect(AcceleratorManufacturer.XILINX).toBe('xilinx');
    });

    test('AcceleratorName enum values', () => {
      expect(AcceleratorName.A10G).toBe('a10g');
      expect(AcceleratorName.A100).toBe('a100');
      expect(AcceleratorName.H100).toBe('h100');
      expect(AcceleratorName.INFERENTIA).toBe('inferentia');
      expect(AcceleratorName.K520).toBe('k520');
      expect(AcceleratorName.K80).toBe('k80');
      expect(AcceleratorName.M60).toBe('m60');
      expect(AcceleratorName.RADEON_PRO_V520).toBe('radeon-pro-v520');
      expect(AcceleratorName.T4).toBe('t4');
      expect(AcceleratorName.T4G).toBe('t4g');
      expect(AcceleratorName.VU9P).toBe('vu9p');
      expect(AcceleratorName.V100).toBe('v100');
    });
  });

  describe('renderInstanceRequirements', () => {
    test('minimal configuration with required fields only', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result).toEqual({
        acceleratorCount: undefined,
        acceleratorManufacturers: undefined,
        acceleratorNames: undefined,
        acceleratorTotalMemoryMiB: undefined,
        acceleratorTypes: undefined,
        allowedInstanceTypes: undefined,
        bareMetal: undefined,
        baselineEbsBandwidthMbps: undefined,
        burstablePerformance: undefined,
        cpuManufacturers: undefined,
        excludedInstanceTypes: undefined,
        instanceGenerations: undefined,
        localStorage: undefined,
        localStorageTypes: undefined,
        maxSpotPriceAsPercentageOfOptimalOnDemandPrice: undefined,
        memoryGiBPerVCpu: undefined,
        memoryMiB: {
          min: 4096, // 4 GiB in MiB
          max: undefined,
        },
        networkBandwidthGbps: undefined,
        networkInterfaceCount: undefined,
        onDemandMaxPricePercentageOverLowestPrice: undefined,
        requireHibernateSupport: undefined,
        spotMaxPricePercentageOverLowestPrice: undefined,
        totalLocalStorageGb: undefined,
        vCpuCount: {
          min: 2,
          max: undefined,
        },
      });
    });

    test('full configuration with all fields', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        acceleratorCountMin: 1,
        acceleratorCountMax: 4,
        acceleratorManufacturers: [AcceleratorManufacturer.NVIDIA, AcceleratorManufacturer.AMD],
        acceleratorNames: [AcceleratorName.A100, AcceleratorName.V100],
        acceleratorTotalMemoryMin: Size.gibibytes(8),
        acceleratorTotalMemoryMax: Size.gibibytes(32),
        acceleratorTypes: [AcceleratorType.GPU],
        allowedInstanceTypes: ['m5.large', 'c5.xlarge'],
        bareMetal: BareMetal.EXCLUDED,
        baselineEbsBandwidthMbpsMin: 1000,
        baselineEbsBandwidthMbpsMax: 5000,
        burstablePerformance: BurstablePerformance.INCLUDED,
        cpuManufacturers: [CpuManufacturer.INTEL, CpuManufacturer.AMD],
        excludedInstanceTypes: ['t2.micro', 't3.nano'],
        instanceGenerations: [InstanceGeneration.CURRENT],
        localStorage: LocalStorage.REQUIRED,
        localStorageTypes: [LocalStorageType.SSD],
        maxSpotPriceAsPercentageOfOptimalOnDemandPrice: 50,
        memoryPerVCpuMin: Size.gibibytes(2),
        memoryPerVCpuMax: Size.gibibytes(8),
        memoryMin: Size.gibibytes(4),
        memoryMax: Size.gibibytes(64),
        networkBandwidthGbpsMin: 1,
        networkBandwidthGbpsMax: 10,
        networkInterfaceCountMin: 1,
        networkInterfaceCountMax: 4,
        onDemandMaxPricePercentageOverLowestPrice: 20,
        requireHibernateSupport: true,
        spotMaxPricePercentageOverLowestPrice: 30,
        totalLocalStorageGBMin: 100,
        totalLocalStorageGBMax: 1000,
        vCpuCountMin: 2,
        vCpuCountMax: 16,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result).toEqual({
        acceleratorCount: {
          min: 1,
          max: 4,
        },
        acceleratorManufacturers: ['nvidia', 'amd'],
        acceleratorNames: ['a100', 'v100'],
        acceleratorTotalMemoryMiB: {
          min: 8192, // 8 GiB in MiB
          max: 32768, // 32 GiB in MiB
        },
        acceleratorTypes: ['gpu'],
        allowedInstanceTypes: ['m5.large', 'c5.xlarge'],
        bareMetal: 'excluded',
        baselineEbsBandwidthMbps: {
          min: 1000,
          max: 5000,
        },
        burstablePerformance: 'included',
        cpuManufacturers: ['intel', 'amd'],
        excludedInstanceTypes: ['t2.micro', 't3.nano'],
        instanceGenerations: ['current'],
        localStorage: 'required',
        localStorageTypes: ['ssd'],
        maxSpotPriceAsPercentageOfOptimalOnDemandPrice: 50,
        memoryGiBPerVCpu: {
          min: 2, // 2 GiB
          max: 8, // 8 GiB
        },
        memoryMiB: {
          min: 4096, // 4 GiB in MiB
          max: 65536, // 64 GiB in MiB
        },
        networkBandwidthGbps: {
          min: 1,
          max: 10,
        },
        networkInterfaceCount: {
          min: 1,
          max: 4,
        },
        onDemandMaxPricePercentageOverLowestPrice: 20,
        requireHibernateSupport: true,
        spotMaxPricePercentageOverLowestPrice: 30,
        totalLocalStorageGb: {
          min: 100,
          max: 1000,
        },
        vCpuCount: {
          min: 2,
          max: 16,
        },
      });
    });

    test('accelerator count with only min value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        acceleratorCountMin: 1,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.acceleratorCount).toEqual({
        min: 1,
        max: undefined,
      });
    });

    test('accelerator count with only max value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        acceleratorCountMax: 4,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.acceleratorCount).toEqual({
        min: undefined,
        max: 4,
      });
    });

    test('accelerator total memory with only min value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        acceleratorTotalMemoryMin: Size.gibibytes(8),
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.acceleratorTotalMemoryMiB).toEqual({
        min: 8192, // 8 GiB in MiB
        max: undefined,
      });
    });

    test('baseline EBS bandwidth with only min value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        baselineEbsBandwidthMbpsMin: 1000,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.baselineEbsBandwidthMbps).toEqual({
        min: 1000,
        max: undefined,
      });
    });

    test('memory per vCPU with only max value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        memoryPerVCpuMax: Size.gibibytes(8),
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.memoryGiBPerVCpu).toEqual({
        min: undefined,
        max: 8, // 8 GiB
      });
    });

    test('network bandwidth with only max value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        networkBandwidthGbpsMax: 10,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.networkBandwidthGbps).toEqual({
        min: undefined,
        max: 10,
      });
    });

    test('network interface count with only min value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        networkInterfaceCountMin: 1,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.networkInterfaceCount).toEqual({
        min: 1,
        max: undefined,
      });
    });

    test('total local storage with only max value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        totalLocalStorageGBMax: 1000,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.totalLocalStorageGb).toEqual({
        min: undefined,
        max: 1000,
      });
    });

    test('vCPU count with only min value', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.vCpuCount).toEqual({
        min: 2,
        max: undefined,
      });
    });

    test('memory with only min value (required field)', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.memoryMiB).toEqual({
        min: 4096, // 4 GiB in MiB
        max: undefined,
      });
    });

    test('single enum values', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        bareMetal: BareMetal.REQUIRED,
        burstablePerformance: BurstablePerformance.EXCLUDED,
        localStorage: LocalStorage.INCLUDED,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.bareMetal).toBe('required');
      expect(result.burstablePerformance).toBe('excluded');
      expect(result.localStorage).toBe('included');
    });

    test('array enum values', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        cpuManufacturers: [CpuManufacturer.INTEL],
        instanceGenerations: [InstanceGeneration.CURRENT, InstanceGeneration.PREVIOUS],
        localStorageTypes: [LocalStorageType.SSD, LocalStorageType.HDD],
        acceleratorTypes: [AcceleratorType.GPU, AcceleratorType.FPGA],
        acceleratorManufacturers: [AcceleratorManufacturer.NVIDIA],
        acceleratorNames: [AcceleratorName.A100],
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.cpuManufacturers).toEqual(['intel']);
      expect(result.instanceGenerations).toEqual(['current', 'previous']);
      expect(result.localStorageTypes).toEqual(['ssd', 'hdd']);
      expect(result.acceleratorTypes).toEqual(['gpu', 'fpga']);
      expect(result.acceleratorManufacturers).toEqual(['nvidia']);
      expect(result.acceleratorNames).toEqual(['a100']);
    });

    test('string array values', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        allowedInstanceTypes: ['m5.large', 'c5.xlarge', 't3.medium'],
        excludedInstanceTypes: ['t2.micro'],
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.allowedInstanceTypes).toEqual(['m5.large', 'c5.xlarge', 't3.medium']);
      expect(result.excludedInstanceTypes).toEqual(['t2.micro']);
    });

    test('numeric values', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        maxSpotPriceAsPercentageOfOptimalOnDemandPrice: 75,
        onDemandMaxPricePercentageOverLowestPrice: 25,
        spotMaxPricePercentageOverLowestPrice: 40,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.maxSpotPriceAsPercentageOfOptimalOnDemandPrice).toBe(75);
      expect(result.onDemandMaxPricePercentageOverLowestPrice).toBe(25);
      expect(result.spotMaxPricePercentageOverLowestPrice).toBe(40);
    });

    test('boolean values', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        requireHibernateSupport: true,
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.requireHibernateSupport).toBe(true);
    });

    test('Size conversion to mebibytes', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        acceleratorTotalMemoryMin: Size.mebibytes(1024), // 1 GiB
        acceleratorTotalMemoryMax: Size.gibibytes(2), // 2 GiB
        memoryMin: Size.mebibytes(2048), // 2 GiB
        memoryMax: Size.gibibytes(4), // 4 GiB
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.acceleratorTotalMemoryMiB).toEqual({
        min: 1024, // 1024 MiB
        max: 2048, // 2 GiB = 2048 MiB
      });
      expect(result.memoryMiB).toEqual({
        min: 2048, // 2048 MiB
        max: 4096, // 4 GiB = 4096 MiB
      });
    });

    test('Size conversion to gibibytes for memory per vCPU', () => {
      // GIVEN
      const config: InstanceRequirementsConfig = {
        memoryPerVCpuMin: Size.mebibytes(1024), // 1 GiB
        memoryPerVCpuMax: Size.gibibytes(4), // 4 GiB
        memoryMin: Size.gibibytes(4),
        vCpuCountMin: 2,
      };

      // WHEN
      const result = renderInstanceRequirements(config);

      // THEN
      expect(result.memoryGiBPerVCpu).toEqual({
        min: 1, // 1 GiB
        max: 4, // 4 GiB
      });
    });
  });
});
