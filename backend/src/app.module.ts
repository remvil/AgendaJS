import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {EventsModule} from "./events/events.module";
import {CompaniesModule} from "./companies/companies.module";
import {SeederModule} from "./common/modules/seeder.module";

@Module({
	imports: [MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/agenda"), EventsModule, CompaniesModule, SeederModule],
})
export class AppModule {}
