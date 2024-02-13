import * as cheerio from "cheerio";
import * as v from "valibot";
import fastify from "fastify";

const server = fastify();

const playerDataSchema = v.object({
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

type Player = v.Input<typeof playerDataSchema>;

server.get("/", async (request, reply) => {
  const response = await fetch("https://live-tennis.eu/en/wta-live-ranking");

  const html = await response.text();

  const $ = cheerio.load(html);

  const players: Player[] = [];

  $("#u868 > tbody > tr").each((_, tableRow) => {
    const playerData: Partial<Player> = {
      pointsChange: null,
      rankingChange: null,
      currentTournament: null,
      max: null,
      next: null,
    };

    if ($(tableRow).children("td").attr("colspan") === "14") {
      return;
    }

    $(tableRow)
      .children("td")
      .each((idx, tableDataCell) => {
        const $tableDataCell = $(tableDataCell);
        const tdTextContent = $tableDataCell.text();

        if ($tableDataCell.hasClass("rk")) {
          playerData.ranking = Number(tdTextContent);
        }
        if ($tableDataCell.hasClass("pn")) {
          playerData.name = tdTextContent;
        }
        if ($tableDataCell.prev().hasClass("pn")) {
          playerData.age = Number(tdTextContent);
        }
        if ($tableDataCell.hasClass("rdf")) {
          playerData.rankingChange = Number(tdTextContent);
        }
        if ($tableDataCell.hasClass("srd") || $tableDataCell.hasClass("sgr")) {
          playerData.pointsChange = Number(tdTextContent);
        }
        if ($tableDataCell.hasClass("tc") && idx === 9) {
          playerData.currentTournament = tdTextContent;
        }
        if (idx === 5) {
          playerData.country = tdTextContent;
          playerData.countryRank = Number($tableDataCell.attr("p"));
        }
        if (idx === 6) {
          playerData.points = Number(tdTextContent);
        }
        if (idx === 11 && tdTextContent && $tableDataCell.hasClass("")) {
          playerData.next = Number(tdTextContent);
        }
        if (idx === 12 && tdTextContent && $tableDataCell.hasClass("")) {
          playerData.max = Number(tdTextContent);
        }
      });

    const validationResult = v.safeParse(playerDataSchema, playerData);
    if (validationResult.success) {
      players.push(validationResult.output);
    } else {
      console.error("Something went wrong with fetching player", playerData);
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
