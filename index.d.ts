import { envSchema } from "@/config/envs";
import * as v from "valibot";

export type Env = v.Input<typeof envSchema>;
declare global {
	module NodeJS {
		interface ProcessEnv extends Env {}
	}
}
