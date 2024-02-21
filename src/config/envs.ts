import "dotenv/config";
import { Input, object, safeParse, string } from "valibot";

export const envSchema = object({
	PORT: string(),
	RANKING_ENDPOINT: string(),
});

export type Env = Input<typeof envSchema>;

const envServer = safeParse(envSchema, {
	PORT: process.env.PORT,
	RANKING_ENDPOINT: process.env.RANKING_ENDPOINT,
});

if (!envServer.success) {
	console.error(envServer.issues);
	throw new Error("There is an error with the server environment variables");
}

export const envs = envServer.output;
