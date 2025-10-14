import inquirer from "inquirer";
import type { DisplayItems } from "../types/display.interface";
import type { PartnerInfo } from "../src/livelo-crawler";

export const clearScreen = () => {
  process.stdout.write("\x1Bc");
};

export const displayPage = (
  page: number,
  pageSize: number,
  items: PartnerInfo[]
) => {
  clearScreen();
  const start = page * pageSize;
  const end = start + pageSize;
  const pageItems = items.slice(start, end);
  console.log(`Page ${page + 1}/${Math.ceil(items.length / pageSize)}\n`);
  console.table(pageItems);
  console.log("\n");
};

export const paginate = async (pageSize: number, items: PartnerInfo[]) => {
  let currentPage = 0;
  const previousPage = "Página Anterior";
  const nextPage = "Próxima Página";
  const favoritePartners = "Favoritar"
  const settingsOption = 'Configurações'
  const leaveOption = "Sair";
  const totalPages = Math.ceil(items.length / pageSize);
  let action: 'favorite' | 'settings' | null = null

  while (true) {
    displayPage(currentPage, pageSize, items);

    const choices = [];
    if (currentPage < totalPages - 1) choices.push(nextPage);
    if (currentPage > 0) choices.push(previousPage);
    choices.push(favoritePartners)
    choices.push(settingsOption)
    choices.push(leaveOption);

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "",
        choices: choices,
      },
    ]);

    if (answer.action === nextPage) {
      currentPage++;
    } else if (answer.action === previousPage) {
      currentPage--;
    } else if (answer.action === leaveOption) {
      break;
    } else if (answer.action === favoritePartners) {
      action = 'favorite'
      break;
    } else if (answer.action === settingsOption) {
      action = 'settings'
      break;
    }
  }
  return action
};
