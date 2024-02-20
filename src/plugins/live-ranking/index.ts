import { FastifyInstance } from "fastify";
import * as cheerio from "cheerio";
import * as v from "valibot";
import { Player, playerDataSchema } from "../../utils/playerValidation";
import { envs } from "../../config/envs";

export const liveRankingRoute = async (server: FastifyInstance) => {
  server.get("/live-ranking", async () => {
    const response = await fetch(`${envs.RANKING_ENDPOINT}/wta-live-ranking`);

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
          const hasNoClass = !$tableDataCell.attr("class");

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
          if (
            $tableDataCell.hasClass("srd") ||
            $tableDataCell.hasClass("sgr")
          ) {
            playerData.pointsChange = Number(tdTextContent);
          }
          if ($tableDataCell.hasClass("tc")) {
            playerData.currentTournament = tdTextContent.replace(
              /\([^)]*\)/g,
              ""
            );
          }
          if (idx === 5) {
            playerData.country = tdTextContent;
            playerData.countryRank = Number($tableDataCell.attr("p"));
          }
          if (idx === 6) {
            playerData.points = Number(tdTextContent);
          }
          if (idx === 11 && tdTextContent && hasNoClass) {
            playerData.next = Number(tdTextContent);
          }
          if (idx === 12 && tdTextContent && hasNoClass) {
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
};
