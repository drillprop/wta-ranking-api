import fastify from "fastify";

import { envs } from "@/config/envs";
import { liveRankingRoute } from "@/plugins/live-ranking";

const server = fastify();

server.register(liveRankingRoute);

server.listen({ port: Number(envs.PORT) }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
