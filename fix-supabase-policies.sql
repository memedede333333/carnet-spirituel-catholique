-- Policies pour prieres (si elles n'existent pas déjà)
CREATE POLICY "Les utilisateurs peuvent voir leurs propres prières" ON prieres
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres prières" ON prieres
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres prières" ON prieres
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres prières" ON prieres
  FOR DELETE USING (auth.uid() = user_id);
