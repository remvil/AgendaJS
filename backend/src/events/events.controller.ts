import {Controller, Get, Post, Delete, Body, Param} from "@nestjs/common";
import {EventsService} from "./events.service";

@Controller("events")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	findAll() {
		return this.eventsService.findAll();
	}

	@Post()
	create(@Body() eventData: any) {
		return this.eventsService.create(eventData);
	}

	@Delete(":id")
	delete(@Param("id") id: string) {
		return this.eventsService.delete(id);
	}
}
