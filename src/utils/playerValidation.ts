import { Input, nullable, number, object, string } from "valibot";

export const playerDataSchema = object({
	ranking: number(),
	careerHigh: number(),
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
