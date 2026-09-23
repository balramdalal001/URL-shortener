export interface UrlRecord {
  id: number;
  code: string;
  originalUrl: string;
  createdAt: Date;
  is_active: boolean;
}

export interface CreateUrlInput {
  url: string;
}
