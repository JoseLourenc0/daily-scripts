import { getAvailablePartnersCod } from "./partners-config";
import { getPartnersCampaign } from "./partners-campaign";
import { type Partner } from "./types/partners-config.interface";
import { type PartnerCampaign } from "./types/partners-campaign.interface";
import { shortenString } from "./utils/shorten-string";
import type { DisplayItems } from "./types/display.interface";
import { paginate } from "./utils/prompt-pagination";

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
        parity,
        currency,
        value,
        partnerCode,
        name: shortenString(name, 25),
        legalTerms: shortenString(legalTerms, 30),
      })
    );

//   console.table(coolInfo);
    paginate(PAGE_SIZE, coolInfo);
};

main();
