import { paginate } from "./utils/prompt-pagination";
import { openFavoriteMenu } from "./utils/favorite-menu";
import { openSettingsMenu } from "./utils/settings-menu";

import { filterAndNotify } from "./utils/filter-and-notify";
import { LiveloCrawler } from "./src/livelo-crawler";

const PAGE_SIZE = 20;

const main = async () => {
  const crawler = new LiveloCrawler();
  const partners = await crawler.fetchPartners();
  const hasVerifyFlag = process.argv.includes("--verify");
  if (hasVerifyFlag) {
    filterAndNotify(partners);
    return;
  }

  const action = await paginate(PAGE_SIZE, partners);

  switch (action) {
    case "favorite":
      await openFavoriteMenu(partners);
      break;
    case "settings":
      await openSettingsMenu();
      break;
  }
};

main();
