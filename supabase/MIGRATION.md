# 📦 Migration des données mock vers Supabase

Ce fichier contient les scripts pour migrer vos mock data actuelles vers Supabase.

## ⚠️ À FAIRE D'ABORD

1. **Créer les tables** : Exécutez `supabase/schema.sql` dans SQL Editor
2. **Créer un compte** : Inscrivez-vous via votre app pour avoir un user dans `auth.users`
3. **Créer une team** : Première équipe à créer manuellement

---

## 🚀 Scripts de migration

### 1. Créer votre première team

Dans Supabase SQL Editor :

\`\`\`sql
-- Créer une team
INSERT INTO teams (name, slug) 
VALUES ('Stellar', 'stellar')
RETURNING *;

-- Notez l'ID de la team (ex: "123e4567-e89b-12d3-a456-426614174000")
\`\`\`

### 2. Créer les pôles

\`\`\`sql
-- Remplacez YOUR_TEAM_ID par l'ID de votre team
INSERT INTO poles (team_id, name, description, color) VALUES
('YOUR_TEAM_ID', 'Pôle Marketing & Communication', 'Stratégie marketing, communication, acquisition clients', 'purple'),
('YOUR_TEAM_ID', 'Pôle Design & Créa', 'Design produit, identité visuelle, UX/UI', 'pink'),
('YOUR_TEAM_ID', 'Pôle Tech & Produit', 'Développement, infrastructure, produit', 'blue'),
('YOUR_TEAM_ID', 'Pôle Ops & Finance', 'Opérations, finance, RH, juridique', 'emerald');
\`\`\`

### 3. Ajouter votre profil user

Après inscription, mettez à jour votre profil :

\`\`\`sql
-- Remplacez YOUR_AUTH_ID par votre ID d'authentification
-- (visible dans Authentication > Users)
UPDATE users 
SET 
    team_id = 'YOUR_TEAM_ID',
    pole_id = (SELECT id FROM poles WHERE name LIKE '%Ops%' LIMIT 1),
    first_name = 'Votre',
    last_name = 'Nom',
    role = 'owner',
    avatar_color = 'emerald'
WHERE id = 'YOUR_AUTH_ID';
\`\`\`

---

## 🔄 Alternative : Script TypeScript automatique

Créez un fichier `scripts/migrate-mock-data.ts` :

\`\`\`typescript
import { supabase } from '../src/lib/supabase';
import { users, poles } from '../src/data/mockData';

async function migrate() {
  // 1. Créer la team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name: 'Stellar', slug: 'stellar' })
    .select()
    .single();

  if (teamError) throw teamError;
  console.log('✅ Team créée:', team.id);

  // 2. Créer les pôles
  const polesData = poles.map(pole => ({
    team_id: team.id,
    name: pole.name,
    description: pole.description,
    color: pole.color,
  }));

  const { data: createdPoles, error: polesError } = await supabase
    .from('poles')
    .insert(polesData)
    .select();

  if (polesError) throw polesError;
  console.log('✅ Pôles créés:', createdPoles.length);

  // 3. Créer des users fictifs (après avoir des auth users)
  // ... à compléter selon vos besoins
}

migrate().then(() => console.log('✅ Migration terminée'));
\`\`\`

Exécutez avec :
\`\`\`bash
npx tsx scripts/migrate-mock-data.ts
\`\`\`

---

## 📝 Ordre recommandé

1. ✅ Créer les tables (schema.sql)
2. ✅ S'inscrire (créer un compte via l'app)
3. ✅ Créer la team
4. ✅ Créer les pôles
5. ✅ Mettre à jour son profil user
6. ⏭️ Inviter d'autres membres
7. ⏭️ Créer des décisions

---

## 🧪 Tester

Dans votre app, testez la connexion :

\`\`\`typescript
import { supabase } from './lib/supabase';

// Test fetch team
const { data, error } = await supabase
  .from('teams')
  .select('*, poles(*)')
  .single();

console.log('Team:', data);
\`\`\`

---

## ❓ Besoin d'aide ?

Si vous voulez que je génère un script complet de migration, demandez-moi !
