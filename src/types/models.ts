// src/types/models.ts

export type ReportStatus = 'pendiente' | 'en-revision' | 'resuelto';
export type ReportCategory = 'Alumbrado' | 'Bache' | 'Basura';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  urgent: boolean;
  status: ReportStatus;
  createdAt: Date;
  imageUrl?: string; // Opcional para futuras implementaciones
}

export interface User {
  id: string;
  name: string;
  email: string;
}