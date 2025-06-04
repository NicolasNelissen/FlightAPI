import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsService } from './flights.service';
import { Flight } from './schemas/flight.schema';
import { mapFlight } from './utilities/flightResponse.util';

@ApiBearerAuth()
@ApiTags('Flights')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Successful operation',
    schema: {
      allOf: [
        { $ref: getSchemaPath(Flight) },
        {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Internal Identifier for the flight',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async create(@Body() createFlightDto: CreateFlightDto) {
    const flight = await this.flightsService.create(createFlightDto);
    return mapFlight(flight);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Flight' },
          {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Internal Identifier for the flight' },
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async findAll() {
    const flights = await this.flightsService.findAll();
    return flights.map(mapFlight);
  }

  @Get(':flightId')
  @ApiOperation({ summary: 'Retrieve a flight by id', operationId: 'retrieveFlight' })
  @ApiParam({
    name: 'flightId',
    required: true,
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: {
      allOf: [
        { $ref: getSchemaPath(Flight) },
        {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Internal Identifier for the flight' },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async findOne(@Param('flightId') flightId: string) {
    const flight = await this.flightsService.findOne(flightId);
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return mapFlight(flight);
  }

  @Patch(':flightId')
  @ApiOperation({ summary: 'Update a flight' })
  @ApiParam({
    name: 'flightId',
    description: 'The ID of the flight to update',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Flight' },
        {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Internal Identifier for the flight' },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async update(@Param('flightId') flightId: string, @Body() updateFlightDto: UpdateFlightDto) {
    const updatedFlight = await this.flightsService.update(flightId, updateFlightDto);
    if (!updatedFlight) {
      throw new NotFoundException('Flight not found');
    }
    return mapFlight(updatedFlight);
  }

  @Delete(':flightId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a flights by id', operationId: 'deleteFlight' })
  @ApiParam({
    name: 'flightId',
    required: true,
    description: 'Flight ID',
    schema: { type: 'string' },
  })
  @ApiResponse({ status: 204, description: 'The flight was deleted successfully.' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async remove(@Param('flightId') flightId: string): Promise<void> {
    const deletedFlight = await this.flightsService.remove(flightId);
    if (!deletedFlight) {
      throw new NotFoundException('Flight not found');
    }
  }
}
