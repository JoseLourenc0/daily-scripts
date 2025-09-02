import { getAvailablePartnersCod } from "./utils/partners-config";
import { getPartnersCampaign } from "./utils/partners-campaign";
import { type Partner } from "./types/partners-config.interface";
import { type PartnerCampaign } from "./types/partners-campaign.interface";
import { shortenString } from "./utils/shorten-string";
import type { DisplayItems } from "./types/display.interface";
import { paginate } from "./utils/prompt-pagination";
import { openFavoriteMenu } from "./utils/favorite-menu";

type CustomActiveCampaignPartner = PartnerCampaign & Partner;

const PAGE_SIZE = 20;

const main = async () => {
  const partnersConfig = await getAvailablePartnersCod();
  const results = await getPartnersCampaign(partnersConfig.partners);

  const customResults: CustomActiveCampaignPartner[] = results.map((e) => {
    const { partnerCode, ...props } = e;
    const { name, ...partnerProps } =
      partnersConfig.partners.find((p) => p.id === e.partnerCode) ||
      ({} as Partner);
    return {
      partnerCode: partnerCode,
      name: name || "",
      ...props,
      ...partnerProps,
    };
  });

  const coolInfo: DisplayItems[] = customResults
    .sort((a, b) => b.parityClub - a.parityClub)
    .map(
      ({
        partnerDetailsPage,
        parityClub,
        parity,
        currency,
        value,
        partnerCode,
        name,
        legalTerms,
      }, index) => ({
        index,
        parityClub,
        partnerDetailsPage,
        parity,
        currency,
        value,
        partnerCode,
        name: shortenString(name, 25),
        legalTerms: shortenString(legalTerms, 30),
      })
    );

//   console.table(coolInfo);
    // const action = 'favorite'
    const action = await paginate(PAGE_SIZE, coolInfo);

    if (action === 'favorite') {
      openFavoriteMenu(coolInfo)
    }
};

main();
