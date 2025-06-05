import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../src/auth/decorators/current-user.decorator';
import type { ValidatedJwtData } from '../../src/auth/dto/jwt-validated-data.dto';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { ObjectIdParam } from '../../src/common/decorators/swagger/objectid-param.decorator';
import { toDto, toDtoArray, toDtoOrNull } from '../../src/common/utilities/dto-helper.util';
import { Flight } from './dto/flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { FlightsService } from './flights.service';
import { flightResponseSchema } from './schemas/flight-response.schema';

/**
 * Controller for managing flight resources.
 *
 * Provides endpoints for creating, retrieving, updating, and deleting flights.
 * All endpoints require JWT authentication.
 *
 * - POST /flights: Create a new flight.
 * - GET /flights: Retrieve all flights for the authenticated user.
 * - GET /flights/:flightId: Retrieve a specific flight by its ID.
 * - PATCH /flights/:flightId: Update a specific flight.
 * - DELETE /flights/:flightId: Delete a specific flight.
 */
@ApiTags('Flights')
@ApiSecurity('bearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  /**
   * Creates a new flight for the authenticated user.
   *
   * @param flightDto - The data for the new flight.
   * @param user - The current authenticated user.
   * @returns The created flight as a response DTO.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a flight', operationId: 'createFlight' })
  @ApiCreatedResponse({
    description: 'Successful operation',
    schema: flightResponseSchema,
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async create(
    @Body() flightDto: Flight,
    @CurrentUser() user: ValidatedJwtData,
  ): Promise<FlightResponseDto> {
    const flight = await this.flightsService.create(flightDto, user.userId);
    return toDto(FlightResponseDto, flight);
  }

  /**
   * Retrieves all flights for the authenticated user.
   *
   * @param user - The current authenticated user.
   * @returns An array of flight response DTOs.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all flights', operationId: 'retrieveAllFlights' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: {
      type: 'array',
      items: flightResponseSchema,
    },
  })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async findAll(@CurrentUser() user: ValidatedJwtData): Promise<FlightResponseDto[]> {
    const flights = await this.flightsService.findAll(user.userId);
    return toDtoArray(FlightResponseDto, flights);
  }

  /**
   * Retrieves a specific flight by its ID.
   *
   * @param flightId - The ID of the flight to retrieve.
   * @returns The flight response DTO, or null if not found.
   */
  @Get(':flightId')
  @ApiOperation({ summary: 'Retrieve a flights by id', operationId: 'retrieveFlight' })
  @ApiParam(ObjectIdParam('flightId', 'Flight ID'))
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: flightResponseSchema,
  })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async findOne(@Param('flightId') flightId: string): Promise<FlightResponseDto | null> {
    const flight = await this.flightsService.findOne(flightId);
    return toDtoOrNull(FlightResponseDto, flight);
  }

  /**
   * Updates a specific flight.
   *
   * @param flightId - The ID of the flight to update.
   * @param flightDto - The updated flight data.
   * @returns The updated flight response DTO, or null if not found.
   */
  @Patch(':flightId')
  @ApiOperation({ summary: 'Update a flight', operationId: 'updateFlight' })
  @ApiParam(ObjectIdParam('flightId', 'Flight ID'))
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: flightResponseSchema,
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async update(
    @Param('flightId') flightId: string,
    @Body() flightDto: Flight,
  ): Promise<FlightResponseDto | null> {
    const updatedFlight = await this.flightsService.update(flightId, flightDto);
    return toDtoOrNull(FlightResponseDto, updatedFlight);
  }

  /**
   * Deletes a specific flight by its ID.
   *
   * @param flightId - The ID of the flight to delete.
   */
  @Delete(':flightId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a flights by id', operationId: 'deleteFlight' })
  @ApiParam(ObjectIdParam('flightId', 'Flight ID'))
  @ApiResponse({ status: 204, description: 'The flight was deleted successfully.' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  async remove(@Param('flightId') flightId: string): Promise<void> {
    await this.flightsService.remove(flightId);
  }
}
