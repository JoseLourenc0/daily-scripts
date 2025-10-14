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

    const getPointsInfo = (
      context: any
    ): { points: string | null; currency: string | null } => {
      const text = context.text().replace(/\s+/g, " ").trim();
      // Exemplo: "Até 8 pontos por R$ 1" ou "1 ponto por U$ 1"
      const match = text.match(/(\d+)\s+ponto?s?\s+por\s+([RU]\$)/i);
      return {
        points: match ? match[1] : null,
        currency: match ? match[2] : null,
      };
    };

    $('a[data-testid="a_PartnerCard_card_link"]').each((_, el) => {
      const anchor = $(el);
      const url = anchor.attr("href")?.trim() || "";
      const imageUrl =
        anchor
          .find('img[data-testid="img_PartnerCard_partnerImage"]')
          .attr("src") || null;

      // Nome (vem do alt da imagem)
      const name =
        anchor
          .find('img[data-testid="img_PartnerCard_partnerImage"]')
          .attr("alt")
          ?.replace("Logo ", "")
          .trim() || "Desconhecido";

      // Promoção
      const isPromotion = !!anchor.find(
        'span[data-testid="span_PartnerCard_promotionTag"]'
      ).length;

      // Bloco principal — pode ser "promotion" ou "bau"
      const normalBlock =
        anchor.find('div[data-testid="div_PartnerCard_promotion"]').length
          ? anchor.find('div[data-testid="div_PartnerCard_promotion"]')
          : anchor.find('div[data-testid="div_PartnerCard_bau"]');

      const { points: parity, currency: normalCurrency } = getPointsInfo(
        normalBlock.find('div[data-testid="Text_ParityText"]').first()
      );

      // Clube
      const clubBlock = anchor.find('div[data-testid="div_PartnerCard_clubHint"]');
      const { points: parityClub, currency: clubCurrency } = getPointsInfo(
        clubBlock.find('div[data-testid="Text_ParityText"]').first()
      );

      const parityOrZero = Number(parity) || 0

      partners.push({
        name,
        url: url.startsWith("http") ? url : `${this.baseUrl}${url}`,
        currency: normalCurrency,
        parityClub: Number(parityClub) || parityOrZero,
        parity: parityOrZero,
        isPromotion,
        // imageUrl,
      });
    });

    return partners.sort((a,b) => a.parityClub > b.parityClub ? -1 : 1);
  }
}

// Test
// (async () => {
//   const crawler = new LiveloCrawler();
//   const partners = await crawler.fetchPartners();
//   console.log("Total parceiros:", partners.length);
//   console.table(partners.slice(0, 10));
// })();
