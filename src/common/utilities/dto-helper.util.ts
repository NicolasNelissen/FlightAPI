import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Converts a plain object to a DTO instance, exposing only properties decorated with @Expose().
 *
 * @template T - The DTO class type.
 * @template S - The source object type.
 * @param cls - The DTO class constructor.
 * @param data - The plain object to convert.
 * @returns The DTO instance with only exposed properties.
 */
export function toDto<T, S extends object>(cls: ClassConstructor<T>, data: S): T {
  return plainToInstance(cls, data, { excludeExtraneousValues: true });
}

/**
 * Converts an array of plain objects to an array of DTO instances, exposing only properties decorated with @Expose().
 *
 * @template T - The DTO class type.
 * @template S - The source object type.
 * @param cls - The DTO class constructor.
 * @param data - The array of plain objects to convert.
 * @returns An array of DTO instances with only exposed properties.
 */
export function toDtoArray<T, S extends object>(cls: ClassConstructor<T>, data: S[]): T[] {
  return data.map((item) => plainToInstance(cls, item, { excludeExtraneousValues: true }));
}

/**
 * Converts a plain object to a DTO instance or returns null if the source is null.
 *
 * @template T - The DTO class type.
 * @template S - The source object type.
 * @param cls - The DTO class constructor.
 * @param data - The plain object to convert, or null.
 * @returns The DTO instance with only exposed properties, or null if data is null.
 */
export function toDtoOrNull<T, S>(cls: ClassConstructor<T>, data: S | null): T | null {
  return data ? toDto(cls, data) : null;
}
