import { AnyNode, load } from "cheerio";
import { FastifyInstance } from "fastify";
import { safeParse } from "valibot";

import { envs } from "@/config/envs";
import { Player, playerDataSchema } from "@/utils/playerValidation";

type TextType = Extract<AnyNode, { type: "text" }>;

export const liveRankingRoute = async (server: FastifyInstance) => {
	server.get("/live-ranking", async () => {
		const response = await fetch(`${envs.RANKING_ENDPOINT}/wta-live-ranking`);

		const html = await response.text();

		const $ = load(html);

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
					if ($tableDataCell.hasClass("chtd")) {
						const bTag = $tableDataCell.children("b");
						if (bTag.hasClass("chigh")) {
							playerData.careerHigh = Number($tableDataCell.prev().text());
						} else if (bTag.hasClass("nwch")) {
							playerData.careerHigh = Number($tableDataCell.prev().text());
						} else {
							playerData.careerHigh = Number($tableDataCell.children("b").text());
						}
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
					if ($tableDataCell.hasClass("tc")) {
						const currentTournament = $tableDataCell
							.contents()
							.filter(
								(_, el): el is TextType => el.type === "text" && !(el.data.includes("(") || el.data.includes(")"))
							)
							.map((_, el) => el.data)
							.toArray()
							.join(", ");

						playerData.currentTournament = currentTournament;
					}
					if (idx === 5) {
						playerData.country = tdTextContent;
						playerData.countryRank = Number($tableDataCell.attr("p"));
					}
					if (idx === 6) {
						playerData.points = Number(tdTextContent);
					}

					const isLastChild = !tableDataCell.nextSibling;
					const isSecondToLastChild = tableDataCell.nextSibling && !tableDataCell.nextSibling.nextSibling;
					const hasNoClass = !$tableDataCell.attr("class");

					if (isSecondToLastChild && tdTextContent && hasNoClass) {
						playerData.next = Number(tdTextContent);
					}
					if (isLastChild && tdTextContent && hasNoClass) {
						playerData.max = Number(tdTextContent);
					}
				});

			const validationResult = safeParse(playerDataSchema, playerData);
			if (validationResult.success) {
				players.push(validationResult.output);
			} else {
				console.error("Something went wrong with fetching player", playerData);
			}
		});

		return players;
	});
};
