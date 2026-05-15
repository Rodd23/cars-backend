import { buildApp } from "./app.js";
import { env } from "./config/env.js";

async function bootstrap() {
	const app = await buildApp();

	try {
		await app.listen({ port: env.PORT, host: "0.0.0.0" });
	} catch (error) {
		console.error("Error starting the server:", error);
		process.exit(1);
	}
}

void bootstrap();