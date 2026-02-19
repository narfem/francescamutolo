
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  created_at?: string;
}

export interface SimpleContact {
  id: string;
  name: string;
  email: string;
  message: string;
  is_deleted: boolean;
  is_read: boolean;
  created_at: string;
}

export interface BriefContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  services: string[];
  colors: string;
  notes: string;
  is_deleted: boolean;
  is_read: boolean;
  created_at: string;
}

export type Category = 'Branding' | 'Flyer & Poster' | 'Social Media' | 'Print';
