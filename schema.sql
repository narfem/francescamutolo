
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
  is_read BOOLEAN DEFAULT FALSE, -- Questa è la colonna per la bandierina "Letto"
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
  is_read BOOLEAN DEFAULT FALSE, -- Questa è la colonna per la bandierina "Letto"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AGGIORNAMENTO COLONNE (Nel caso le tabelle esistessero già senza is_read)
ALTER TABLE contacts_simple ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE contacts_brief ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- 3. ABILITAZIONE DELLA SICUREZZA (Row Level Security)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_simple ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_brief ENABLE ROW LEVEL SECURITY;

-- 4. DEFINIZIONE DELLE POLITICHE (Policies)

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

-- 5. PERMESSI ESPLICITI
GRANT ALL ON TABLE portfolio TO authenticated;
GRANT ALL ON TABLE contacts_simple TO authenticated;
GRANT ALL ON TABLE contacts_brief TO authenticated;

-- Notifica per ricaricare lo schema (opzionale per PostgREST)
NOTIFY pgrst, 'reload schema';
