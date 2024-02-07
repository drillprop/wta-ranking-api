import * as cheerio from "cheerio";
import fastify from "fastify";
import * as v from "valibot";

const server = fastify();

const playerDataSchema = v.object({
  ranking: v.number(),
  name: v.string(),
  age: v.number(),
  points: v.number(),
  country: v.optional(v.string()),
  countryRank: v.optional(v.number()),
});

type Player = v.Input<typeof playerDataSchema>;

server.get("/", async (request, reply) => {
  const response = await fetch("https://live-tennis.eu/en/wta-live-ranking");

  const html = await response.text();

  const $ = cheerio.load(html);

  const players: Player[] = [];

  $("#u868 > tbody > tr").each((_, el) => {
    const playerData: Partial<Player> = {};
    $(el)
      .children("td")
      .each((idx, el) => {
        const $el = $(el);

        if ($el.hasClass("rk")) {
          playerData.ranking = Number($el.text()) || 0;
        }
        if ($el.hasClass("pn")) {
          playerData.name = $el.text();
        }
        if ($el.prev().hasClass("pn")) {
          playerData.age = Number($el.text()) || 0;
        }
        if (idx === 5) {
          playerData.country = $el.text();
          playerData.countryRank = Number($el.attr("p")) || 1;
        }
        if (idx === 6) {
          playerData.points = Number($el.text()) || 0;
        }
      });

    const validationResult = v.safeParse(playerDataSchema, playerData);
    if (validationResult.success) {
      players.push(validationResult.output);
    }
  });

  return players;
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
