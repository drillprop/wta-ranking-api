import { object, string, Input, nullable, number } from "valibot";

export const playerDataSchema = object({
	ranking: number(),
	name: string(),
	age: number(),
	points: number(),
	country: string(),
	countryRank: number(),
	rankingChange: nullable(number()),
	pointsChange: nullable(number()),
	currentTournament: nullable(string()),
	next: nullable(number()),
	max: nullable(number()),
});

export type Player = Input<typeof playerDataSchema>;
