
-- 1. CREAZIONE DELLE TABELLE

-- Tabella per i lavori del portfolio
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per i contatti rapidi
CREATE TABLE IF NOT EXISTS contacts_simple (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per i brief di progetto dettagliati
CREATE TABLE IF NOT EXISTS contacts_brief (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  services TEXT[] DEFAULT '{}',
  colors TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per i questionari di brand identity completi
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  name_meaning TEXT,
  business_description TEXT,
  products_services TEXT,
  strength_point TEXT,
  slogan TEXT,
  target_customers TEXT,
  age_range TEXT,
  customer_type TEXT,
  market_scope TEXT,
  brand_perception_target TEXT,
  keywords TEXT[] DEFAULT '{}',
  brand_perception TEXT,
  brand_personified TEXT,
  palette_favorite TEXT,
  palette_avoid TEXT,
  logo_style TEXT,
  logo_composition TEXT,
  logos_liked TEXT,
  logos_disliked TEXT,
  competitors TEXT,
  admired_companies TEXT,
  differentiation_strategy TEXT,
  logo_applications TEXT[] DEFAULT '{}',
  deadline TEXT,
  extra_deliverables TEXT[] DEFAULT '{}',
  five_years_vision TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per impostazioni globali (CV, etc)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  cv_url TEXT,
  mutey_rules TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per i feedback dei clienti
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ABILITAZIONE DELLA SICUREZZA (Row Level Security)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_simple ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_brief ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 3. DEFINIZIONE DELLE POLITICHE (Policies)

-- Portfolio
DROP POLICY IF EXISTS "Accesso pubblico in lettura portfolio" ON portfolio;
CREATE POLICY "Accesso pubblico in lettura portfolio" ON portfolio FOR SELECT USING (true);
DROP POLICY IF EXISTS "Accesso totale admin portfolio" ON portfolio;
CREATE POLICY "Accesso totale admin portfolio" ON portfolio FOR ALL TO authenticated USING (true);

-- Contatti Rapidi
DROP POLICY IF EXISTS "Inserimento pubblico contatti semplici" ON contacts_simple;
CREATE POLICY "Inserimento pubblico contatti semplici" ON contacts_simple FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Select Simple" ON contacts_simple;
CREATE POLICY "Admin Select Simple" ON contacts_simple FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Update Simple" ON contacts_simple;
CREATE POLICY "Admin Update Simple" ON contacts_simple FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Delete Simple" ON contacts_simple;
CREATE POLICY "Admin Delete Simple" ON contacts_simple FOR ALL TO authenticated USING (true);

-- Brief di Progetto
DROP POLICY IF EXISTS "Inserimento pubblico brief" ON contacts_brief;
CREATE POLICY "Inserimento pubblico brief" ON contacts_brief FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Select Brief" ON contacts_brief;
CREATE POLICY "Admin Select Brief" ON contacts_brief FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Update Brief" ON contacts_brief;
CREATE POLICY "Admin Update Brief" ON contacts_brief FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Delete Brief" ON contacts_brief;
CREATE POLICY "Admin Delete Brief" ON contacts_brief FOR ALL TO authenticated USING (true);

-- Questionari
DROP POLICY IF EXISTS "Inserimento pubblico questionari" ON questionnaires;
CREATE POLICY "Inserimento pubblico questionari" ON questionnaires FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Select Questionnaires" ON questionnaires;
CREATE POLICY "Admin Select Questionnaires" ON questionnaires FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Update Questionnaires" ON questionnaires;
CREATE POLICY "Admin Update Questionnaires" ON questionnaires FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Delete Questionnaires" ON questionnaires;
CREATE POLICY "Admin Delete Questionnaires" ON questionnaires FOR ALL TO authenticated USING (true);

-- Settings
DROP POLICY IF EXISTS "Accesso pubblico in lettura settings" ON settings;
CREATE POLICY "Accesso pubblico in lettura settings" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Accesso totale admin settings" ON settings;
CREATE POLICY "Accesso totale admin settings" ON settings FOR ALL TO authenticated USING (true);

-- Feedbacks
DROP POLICY IF EXISTS "Inserimento pubblico feedback" ON feedbacks;
CREATE POLICY "Inserimento pubblico feedback" ON feedbacks FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Select Feedbacks" ON feedbacks;
CREATE POLICY "Admin Select Feedbacks" ON feedbacks FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Update Feedbacks" ON feedbacks;
CREATE POLICY "Admin Update Feedbacks" ON feedbacks FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Delete Feedbacks" ON feedbacks;
CREATE POLICY "Admin Delete Feedbacks" ON feedbacks FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Accesso pubblico in lettura feedback approvati" ON feedbacks;
CREATE POLICY "Accesso pubblico in lettura feedback approvati" ON feedbacks FOR SELECT USING (is_approved = true AND is_deleted = false);

-- 4. INIZIALIZZAZIONE DATI
-- Creiamo la riga 'global' se non esiste già
INSERT INTO settings (id, cv_url) 
VALUES ('global', 'https://drive.google.com/file/d/16eFV00cfPNk2UAtfNX8QZk8MLTwvTVAs/view') 
ON CONFLICT (id) DO NOTHING;

-- Forza il ricaricamento dello schema per l'API
NOTIFY pgrst, 'reload schema';
