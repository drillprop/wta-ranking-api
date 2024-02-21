import fastify from "fastify";
import { liveRankingRoute } from "@/plugins/live-ranking";
import { envs } from "@/config/envs";

const server = fastify();

server.register(liveRankingRoute);

server.listen({ port: Number(envs.PORT) }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
