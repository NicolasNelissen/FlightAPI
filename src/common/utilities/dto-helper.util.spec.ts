import { Expose } from 'class-transformer';

import { toDto, toDtoArray, toDtoOrNull } from './dto-helper.util';

class ExampleDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;
}

describe('DTO Helper Utilities', () => {
  const plainObject = { id: 1, name: 'Test', extraProp: 'should be excluded' };
  const plainArray = [
    { id: 1, name: 'Test 1', extraProp: 'excluded' },
    { id: 2, name: 'Test 2', extraProp: 'excluded' },
  ];

  describe('toDto', () => {
    it('should convert plain object to instance and exclude extraneous values', () => {
      const result = toDto(ExampleDto, plainObject);
      expect(result).toBeInstanceOf(ExampleDto);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test');
      // @ts-ignore
      expect(result.extraProp).toBeUndefined();
    });
  });

  describe('toDtoArray', () => {
    it('should convert array of plain objects to array of instances and exclude extraneous values', () => {
      const result = toDtoArray(ExampleDto, plainArray);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ExampleDto);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Test 1');
      // @ts-ignore
      expect(result[0].extraProp).toBeUndefined();
    });
  });

  describe('toDtoOrNull', () => {
    it('should convert to DTO if data is not null', () => {
      const result = toDtoOrNull(ExampleDto, plainObject);
      expect(result).toBeInstanceOf(ExampleDto);
      expect(result?.id).toBe(1);
    });

    it('should return null if data is null', () => {
      const result = toDtoOrNull(ExampleDto, null);
      expect(result).toBeNull();
    });
  });
});
