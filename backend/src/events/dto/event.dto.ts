import {IsString, IsEnum, IsOptional, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateEventDto {
	@ApiProperty({example: "Kickoff meeting", description: "Event title"})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({example: "2025-12-01", description: "Date in YYYY-MM-DD format"})
	@IsString()
	@IsNotEmpty()
	date: string;

	@ApiProperty({example: "14:00", description: "Time in HH:mm format"})
	@IsString()
	@IsNotEmpty()
	time: string;

	@ApiProperty({example: "meeting", enum: ["meeting", "interview"], description: "Type of event"})
	@IsEnum(["meeting", "interview"])
	@IsNotEmpty()
	type: string;

	@ApiProperty({example: "Luca Rossi", description: "Stakeholder / participant", required: false})
	@IsString()
	@IsOptional()
	stakeholder?: string;

	@ApiProperty({example: "Anna Bianchi", description: "Recruiter name (for interviews)", required: false})
	@IsString()
	@IsOptional()
	recruiterName?: string;

	@ApiProperty({example: "Tech Solutions Ltd.", description: "Company name (for interviews)", required: false})
	@IsString()
	@IsOptional()
	companyName?: string;

	@ApiProperty({example: "Bring portfolio", description: "Notes for the event", required: false})
	@IsString()
	@IsOptional()
	notes?: string;
}
