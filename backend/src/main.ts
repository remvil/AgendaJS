import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.setGlobalPrefix("api");
	await app.listen(process.env.PORT || 3001);
	console.log("🚀 Backend running on port 3001");
}
bootstrap();
