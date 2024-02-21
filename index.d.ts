import { Input } from "valibot";

import { envSchema } from "@/config/envs";

export type Env = Input<typeof envSchema>;
declare global {
	module NodeJS {
		interface ProcessEnv extends Env {}
	}
}
