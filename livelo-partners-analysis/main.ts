import { paginate } from "./utils/prompt-pagination";
import { openFavoriteMenu } from "./utils/favorite-menu";
import { openSettingsMenu } from "./utils/settings-menu";
import { getPartnersData } from "./utils/process-partners";
import { filterAndNotify } from "./utils/filter-and-notify";

const PAGE_SIZE = 20;

const main = async () => {
  const coolInfo = await getPartnersData();
  const hasVerifyFlag = process.argv.includes("--verify");
  if (hasVerifyFlag) {
    filterAndNotify(coolInfo);
    return;
  }

  const action = await paginate(PAGE_SIZE, coolInfo);

  switch (action) {
    case "favorite":
      openFavoriteMenu(coolInfo);
      break;
    case "settings":
      openSettingsMenu();
      break;
  }
};

main();
