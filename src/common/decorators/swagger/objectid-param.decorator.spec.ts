import { ObjectIdParam } from './objectid-param.decorator';

describe('ObjectIdParam', () => {
  it('should return ApiParamOptions with default description', () => {
    const name = 'flightId';
    const result = ObjectIdParam(name);

    expect(result).toEqual({
      name: 'flightId',
      required: true,
      description: 'MongoDB ObjectId',
      schema: {
        type: 'string',
        pattern: '^[a-fA-F0-9]{24}$',
        example: '507f1f77bcf86cd799439011',
      },
    });
  });

  it('should return ApiParamOptions with custom description', () => {
    const name = 'userId';
    const description = 'Unique user identifier';
    const result = ObjectIdParam(name, description);

    expect(result).toEqual({
      name: 'userId',
      required: true,
      description: 'Unique user identifier',
      schema: {
        type: 'string',
        pattern: '^[a-fA-F0-9]{24}$',
        example: '507f1f77bcf86cd799439011',
      },
    });
  });
});
