import * as v from "valibot";

export const playerDataSchema = v.object({
  ranking: v.number(),
  name: v.string(),
  age: v.number(),
  points: v.number(),
  country: v.string(),
  countryRank: v.number(),
  rankingChange: v.nullable(v.number()),
  pointsChange: v.nullable(v.number()),
  currentTournament: v.nullable(v.string()),
  next: v.nullable(v.number()),
  max: v.nullable(v.number()),
});

export type Player = v.Input<typeof playerDataSchema>;
