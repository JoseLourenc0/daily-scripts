// src/crawlers/LiveloCrawler.ts
import axios from "axios";
import * as cheerio from "cheerio";

export interface PartnerInfo {
  name: string;
  url: string;
  parity: number;
  currency: string | null;
  parityClub: number;
  isPromotion: boolean;
  imageUrl?: string | null;
}

export class LiveloCrawler {
  private readonly baseUrl = "https://www.livelo.com.br";
  private readonly partnersUrl = `${this.baseUrl}/juntar-pontos/todos-os-parceiros`;

  async fetchPartners(): Promise<PartnerInfo[]> {
    const { data: html } = await axios.get(this.partnersUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(html);
    const partners: PartnerInfo[] = [];

    const parsePointsFromStrong = (text: string): number => {
      const match = text.match(/(\d+)\s+pontos?/i);
      return match ? Number(match[1]) : 0;
    };

    $('a[data-testid="a_PartnerCard_card_link"]').each((_, el) => {
      const anchor = $(el);
      const url = anchor.attr("href")?.trim() || "";

      const name =
        anchor
          .find('img[data-testid="img_PartnerCard_partnerImage"]')
          .attr("alt")
          ?.replace("Logo ", "")
          .trim() || "Desconhecido";

      const parityCard = anchor.find('[data-testid^="parity-card-"]');
      const cardType = parityCard.attr("data-testid") || "";
      const isPromotion = cardType.includes("PROMOTION");
      const hasClub = cardType.includes("CLUB");
      const isOnlyClub = cardType === "parity-card-PROMOTION_ONLY_CLUB";

      const strongs: string[] = [];
      parityCard.find('strong[data-testid="Text_Typography"]').each((_, s) => {
        strongs.push($(s).text().trim());
      });

      const cleanClone = parityCard.clone();
      cleanClone.find("style").remove();
      const cleanText = cleanClone.text().replace(/\s+/g, " ").trim();
      const currencyMatch = cleanText.match(/por\s+([RU]\$)/i);
      const currency = currencyMatch ? currencyMatch[1] : null;

      let parity = 0;
      let parityClub = 0;

      if (isOnlyClub) {
        parityClub = strongs.length > 0 ? parsePointsFromStrong(strongs[0]) : 0;
      } else if (hasClub) {
        parity = strongs.length > 0 ? parsePointsFromStrong(strongs[0]) : 0;
        parityClub = strongs.length > 1 ? parsePointsFromStrong(strongs[1]) : 0;
      } else {
        parity = strongs.length > 0 ? parsePointsFromStrong(strongs[0]) : 0;
      }

      if (!parityClub) parityClub = parity;

      partners.push({
        name,
        url: url.startsWith("http") ? url : `${this.baseUrl}${url}`,
        currency,
        parityClub,
        parity,
        isPromotion,
      });
    });

    return partners.sort((a, b) => b.parityClub - a.parityClub);
  }
}

// Test
// (async () => {
//   const crawler = new LiveloCrawler();
//   const partners = await crawler.fetchPartners();
//   console.log("Total parceiros:", partners.length);
//   console.table(partners.slice(0, 10));
// })();
