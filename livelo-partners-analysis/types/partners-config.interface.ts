export type PartnersConfig = {
    categories: string[];
    partners: Partner[];
    importantGuidelines: ImportantGuidelines[];
}

export interface Partner {
    id:                  string;
    name:                string;
    site:                string;
    link:                string;
    image:               string;
    enableRecaptcha:     boolean;
    enableBenefits:      boolean;
    enableModal:         boolean;
    createdDate:         Date;
    partnerType:         string;
    categories:          string;
    partnersPolicies:    any[];
    journey:             Journey;
    partnerTypes:        string[];
    importantGuidelines: any[];
    active:              boolean;
    redirectSeoReady:    boolean;
}

export interface Journey {
    enabled: boolean;
    steps:   any[];
}

export interface ImportantGuidelines {
    code:    string;
    occIcon: string;
    appIcon: string;
    text:    string;
    enabled: boolean;
}
