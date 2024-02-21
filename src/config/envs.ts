import * as v from "valibot";
import "dotenv/config";

export const envSchema = v.object({
	PORT: v.string(),
	RANKING_ENDPOINT: v.string(),
});

export type Env = v.Input<typeof envSchema>;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

const envServer = v.safeParse(envSchema, {
	PORT: process.env.PORT,
	RANKING_ENDPOINT: process.env.RANKING_ENDPOINT,
});

if (!envServer.success) {
	console.error(envServer.issues);
	throw new Error("There is an error with the server environment variables");
}

export const envs = envServer.output;
