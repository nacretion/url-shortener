export interface LinkInfo {
    originalUrl: string;
    createdAt: string;
    clickCount: number;
}

export interface Analytics {
    clickCount: number;
    lastIps: string[];
}
