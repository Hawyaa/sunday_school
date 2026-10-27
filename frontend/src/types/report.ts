/**
 * types/report.ts
 */

export interface ChurchReport {
  id: string;
  title: string;
  titleAm?: string;
  category: string;
  dateStr: string;
  description: string;
  descriptionAm?: string;
  fileSize?: string;
  fileUrl?: string;
  isRestricted?: boolean;
}
