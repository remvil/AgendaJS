import {Controller, Get, Post, Put, Delete, Body, Param} from "@nestjs/common";
import {EventsService} from "./events.service";
import {EventDto} from "./dto";
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('events')
@Controller("events")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	@ApiResponse({ status: 200, description: 'List events' })
	findAll() {
		return this.eventsService.findAll();
	}

	@Post()
	@ApiBody({ type: EventDto })
	@ApiResponse({ status: 201, description: 'Event created' })
	create(@Body() eventData: EventDto) {
		return this.eventsService.create(eventData);
	}

	@Put(":id")
	@ApiBody({ type: EventDto })
	@ApiResponse({ status: 200, description: 'Event updated' })
	update(@Param("id") id: string, @Body() eventData: EventDto) {
		return this.eventsService.update(id, eventData);
	}

	@Delete(":id")
	@ApiResponse({ status: 200, description: 'Event deleted' })
	delete(@Param("id") id: string) {
		return this.eventsService.delete(id);
	}
}
