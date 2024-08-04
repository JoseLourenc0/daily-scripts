export interface PartnerCampaign {
    partnerCode: string;
    parity:      number;
    parityClub:  number;
    parityBau:   number;
    currency:    string;
    value:       number;
    startDate:   string | null;
    endDate:     string | null;
    legalTerms:  string;
    url:         string | null;
    separator:   string;
    promotion:   boolean;
}
