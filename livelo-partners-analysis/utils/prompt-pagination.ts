import inquirer from "inquirer";
import type { DisplayItems } from "../types/display.interface";

export const clearScreen = () => {
  process.stdout.write("\x1Bc");
};

export const displayPage = (
  page: number,
  pageSize: number,
  items: DisplayItems[]
) => {
  clearScreen();
  const start = page * pageSize;
  const end = start + pageSize;
  const pageItems = items.slice(start, end);
  console.log(`Page ${page + 1}/${Math.ceil(items.length / pageSize)}\n`);
  console.table(pageItems);
  console.log("\n");
};

export const paginate = async (pageSize: number, items: DisplayItems[]) => {
  let currentPage = 0;
  const previousPage = "Previous Page";
  const nextPage = "Next Page";
  const favoritePartners = "Favoritar"
  const leaveOption = "Exit";
  const totalPages = Math.ceil(items.length / pageSize);
  let action: 'favorite' | null = null

  while (true) {
    displayPage(currentPage, pageSize, items);

    const choices = [];
    if (currentPage < totalPages - 1) choices.push(nextPage);
    if (currentPage > 0) choices.push(previousPage);
    choices.push(favoritePartners)
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
    }
  }
  return action
};
