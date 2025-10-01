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
} from '../lib';

describe('InstanceRequirements', () => {
  describe('Enums', () => {
    test('CpuManufacturer enum values', () => {
      expect(CpuManufacturer.INTEL).toBe('intel');
      expect(CpuManufacturer.AMD).toBe('amd');
      expect(CpuManufacturer.AWS).toBe('amazon-web-services');
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
      expect(AcceleratorManufacturer.AWS).toBe('amazon-web-services');
      expect(AcceleratorManufacturer.AMD).toBe('amd');
      expect(AcceleratorManufacturer.NVIDIA).toBe('nvidia');
      expect(AcceleratorManufacturer.XILINX).toBe('xilinx');
    });

    test('AcceleratorName enum values', () => {
      expect(AcceleratorName.A100).toBe('a100');
      expect(AcceleratorName.K80).toBe('k80');
      expect(AcceleratorName.M60).toBe('m60');
      expect(AcceleratorName.RADEON_PRO_V520).toBe('radeon-pro-v520');
      expect(AcceleratorName.T4).toBe('t4');
      expect(AcceleratorName.VU9P).toBe('vu9p');
      expect(AcceleratorName.V100).toBe('v100');
    });
  });
});
