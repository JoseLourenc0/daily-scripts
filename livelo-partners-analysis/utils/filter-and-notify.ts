import { FavoritePartnerService } from "../src/db/favorite-partner";
import { SettingsService } from "../src/db/settings";
import type { DisplayItems } from "../types/display.interface";
import notifySystem from "./notify";

export const filterAndNotify = (partners: DisplayItems[]) => {
  const favoriteService = new FavoritePartnerService();
  const settingsService = new SettingsService();

  const favorites = favoriteService.findAll().map((f) => f.partnerCode);
  const settings = settingsService.getSettings();

  if (!settings) {
    console.log(
      "⚠️ Nenhuma configuração encontrada. Configure no menu de settings primeiro."
    );
    return [];
  }

  const { comparisonMode, pointsThreshold } = settings;

  const notifyList = partners.filter((p) => {
    if (!favorites.includes(p.partnerCode)) return false;
    if (comparisonMode === "parity" && p.parity < pointsThreshold) return false;
    if (comparisonMode === "parityClub" && p.parityClub < pointsThreshold)
      return false;
    return true;
  });

  if (notifyList.length === 0) {
    console.log("ℹ️ Nenhum parceiro atingiu o critério de notificação.");
  } else {
    console.log("🔔 Notificações:");
    let textMessageOnNotification = "";
    notifyList.forEach((p) => {
      const formattedMesage = `${p.partnerCode} - ${p.name} | ${comparisonMode}: ${p[comparisonMode]}`;
      console.log(formattedMesage);
      textMessageOnNotification += `${formattedMesage}\n`
    });
    notifySystem("Parceiros livelo em destaque", textMessageOnNotification);
  }

  return notifyList;
};
