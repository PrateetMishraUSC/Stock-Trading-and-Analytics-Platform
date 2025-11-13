export interface companyNews {
    filter(arg0: (newsItem: any) => any): unknown;
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}