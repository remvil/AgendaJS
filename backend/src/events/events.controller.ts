import {Controller, Get, Post, Put, Delete, Body, Param} from "@nestjs/common";
import {EventsService} from "./events.service";
import {EventDto} from "./dto";

@Controller("events")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	findAll() {
		return this.eventsService.findAll();
	}

	@Post()
	create(@Body() eventData: EventDto) {
		return this.eventsService.create(eventData);
	}

	@Put(":id")
	update(@Param("id") id: string, @Body() eventData: EventDto) {
		return this.eventsService.update(id, eventData);
	}

	@Delete(":id")
	delete(@Param("id") id: string) {
		return this.eventsService.delete(id);
	}
}
