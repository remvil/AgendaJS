import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Event} from "./schemas/event.schema";

@Injectable()
export class EventsService {
	constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

	async findAll(): Promise<Event[]> {
		return this.eventModel.find().sort({date: 1, time: 1}).exec();
	}

	async create(eventData: Partial<Event>): Promise<Event> {
		const event = new this.eventModel(eventData);
		return event.save();
	}

	async update(id: string, eventData: Partial<Event>): Promise<Event> {
		return this.eventModel.findByIdAndUpdate(id, eventData, {new: true}).exec();
	}

	async delete(id: string): Promise<Event> {
		return this.eventModel.findByIdAndDelete(id).exec();
	}
}
