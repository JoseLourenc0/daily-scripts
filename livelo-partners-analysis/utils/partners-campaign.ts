import axios from "axios";
import { config } from "../config";
import { type PartnerCampaign } from "../types/partners-campaign.interface";
import { type Partner } from "../types/partners-config.interface";

export const getPartnersCampaign = async (partners: Partner[]) => {
    try {
        const { data } = await axios.get<PartnerCampaign[]>(
            config.LIVELO.ACTIVE_PARTNERS_CAMPAIGN,
            {
                params: {
                    partnersCodes: partners.map(e => e.id).join(','),
                }
            }
        );
        return data;
    } catch (error) {
        console.error("Error fetching partners campaign data:", error);
        throw error;
    }
};
