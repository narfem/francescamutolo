export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  site_url?: string;
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

export interface Questionnaire {
  id: string;
  // 1. Attività
  company_name: string;
  name_meaning: string;
  business_description: string;
  products_services: string;
  strength_point: string;
  slogan: string;
  
  // 2. Target
  target_customers: string;
  age_range: string;
  customer_type: string;
  market_scope: string;
  brand_perception_target: string;
  
  // 3. Posizionamento e personalità
  keywords: string[];
  brand_perception: string;
  brand_personified: string;
  
  // 4. Preferenze estetiche
  palette_favorite: string;
  palette_avoid: string;
  logo_style: string;
  logo_composition: string;
  logos_liked: string;
  logos_disliked: string;
  
  // 5. Concorrenza
  competitors: string;
  admired_companies: string;
  differentiation_strategy: string;
  
  // 6. Utilizzo del logo
  logo_applications: string[];
  
  // 7. Consegna e brand manual
  deadline: string;
  extra_deliverables: string[];
  
  // Ultima domanda importante
  five_years_vision: string;
  notes: string;
  
  // Metadata
  is_deleted: boolean;
  is_read: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  name: string;
  company?: string;
  rating: number;
  message: string;
  is_deleted: boolean;
  is_approved: boolean;
  created_at: string;
}
