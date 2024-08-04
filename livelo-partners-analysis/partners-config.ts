import axios from "axios";
import { config } from "./config";
import { type PartnersConfig } from "./types/partners-config.interface";

export const getAvailablePartnersCod = async () => {
  const { data } = await axios.get<PartnersConfig>(
    config.LIVELO.PARTNERS_CONFIG
  );

  return data;
};
