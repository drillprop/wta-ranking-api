import fastify from "fastify";
import { serializerCompiler } from "fastify-type-provider-valibot";

import { envs } from "@/config/envs";
import { liveRankingRoute } from "@/plugins/live-ranking";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);

app.register(liveRankingRoute);

app.listen({ port: Number(envs.PORT) }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
