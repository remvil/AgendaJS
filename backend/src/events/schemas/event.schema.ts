import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema({timestamps: true})
export class Event extends Document {
	@Prop({required: true})
	title: string;

	@Prop({required: true})
	date: string;

	@Prop({required: true})
	time: string;

	@Prop({required: true, enum: ["meeting", "interview"]})
	type: string;

	@Prop({default: ""})
	stakeholder: string;

	@Prop({default: ""})
	recruiterName: string;

	@Prop({default: ""})
	companyName: string;

	@Prop({default: ""})
	notes: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
