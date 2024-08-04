import { getAvailablePartnersCod } from "./partners-config";
import { getPartnersCampaign } from "./partners-campaign";
import { type Partner } from "./types/partners-config.interface";
import { type PartnerCampaign } from "./types/partners-campaign.interface";

type CustomActiveCampaignPartner = PartnerCampaign & Partner;

const main = async () => {
    const partnersConfig = await getAvailablePartnersCod();
    const results = await getPartnersCampaign(partnersConfig.partners);

    const customResults: CustomActiveCampaignPartner[] = results.map(e => {
        const { partnerCode, ...props } = e;
        const { name, ...partnerProps } = partnersConfig.partners.find(p => p.id === e.partnerCode) || ({} as Partner);
        return {
            partnerCode: partnerCode,
            name: name || '',
            ...props,
            ...partnerProps,
        };
    });

    const coolInfo = customResults.sort((a,b) => b.parityClub - a.parityClub).map(({
        parity,
        parityClub,
        currency,
        value,
        startDate,
        endDate,
        partnerCode,
        name,
    }) => ({
        parity,
        parityClub,
        currency,
        value,
        startDate,
        endDate,
        partnerCode,
        name,
    }));

    console.table(coolInfo);
}

main();
