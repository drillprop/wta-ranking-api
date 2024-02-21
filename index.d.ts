import { envSchema } from "@/config/envs";
import { Input } from "valibot";

export type Env = Input<typeof envSchema>;
declare global {
	module NodeJS {
		interface ProcessEnv extends Env {}
	}
}
