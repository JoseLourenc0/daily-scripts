import inquirer from "inquirer";
import { FavoritePartnerService } from "../src/db/favorite-partner";
import type { DisplayItems } from "../types/display.interface";
import type { PartnerInfo } from "../src/livelo-crawler";

function shortenString(str: string, maxLength: number): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
}

export const openFavoriteMenu = async (partners: PartnerInfo[]) => {
  const service = new FavoritePartnerService();
  const existingFavorites = service.findAll().map((f) => f.partnerCode);

  let choices = partners.map((p) => ({
    name: `${p.name} - ${shortenString(p.name, 25)} (clube: ${
      p.parityClub
    } | padrão: ${p.parity})`,
    value: p.name,
    checked: existingFavorites.includes(p.name),
  }));

  choices = choices.sort((a, b) => {
    if (a.checked && !b.checked) return -1;
    if (!a.checked && b.checked) return 1;
    return a.name.localeCompare(b.name);
  });

  const answers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedPartners",
      message: "Selecione os parceiros favoritos:",
      choices,
    },
  ]);

  const selected = new Set(answers.selectedPartners as string[]);

  partners.forEach((p) => {
    if (selected.has(p.name)) {
      service.add(p.name);
    } else {
      service.remove(p.name);
    }
  });
};
