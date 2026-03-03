# 🗄️ Configuration Supabase pour Verdikt

## 📋 Étapes d'installation

### 1. Créer les tables dans Supabase

1. Allez sur votre dashboard Supabase : https://supabase.com/dashboard/project/kksmhszkqprwyubixcbg
2. Cliquez sur **SQL Editor** dans le menu latéral
3. Créez une nouvelle query
4. Copiez-collez TOUT le contenu du fichier `supabase/schema.sql`
5. Cliquez sur **Run** (ou Ctrl+Enter)

✅ Cela va créer :
- 12 tables (teams, users, poles, decisions, etc.)
- Tous les indexes pour la performance
- Les triggers pour updated_at automatique
- Les politiques RLS (Row Level Security) pour la sécurité

### 2. Vérifier que tout est créé

Dans Supabase Dashboard :
- **Table Editor** → Vous devriez voir 12 tables
- **Database** → **Roles** → Vérifiez que les policies RLS sont activées

### 3. Configuration Auth (optionnel)

**Si vous voulez l'authentification Google** :
1. **Authentication** → **Providers**
2. Activez **Google**
3. Ajoutez vos Client ID et Secret depuis Google Console

**Pour l'instant, Email/Password est activé par défaut** ✅

---

## 🔐 Variables d'environnement

Le fichier `.env` a déjà été créé avec vos credentials :
```env
VITE_SUPABASE_URL=https://kksmhszkqprwyubixcbg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

⚠️ **IMPORTANT** : Le fichier `.env` est dans `.gitignore` pour ne pas exposer vos clés.

---

## 🧪 Tester la connexion

Une fois les tables créées, testez la connexion :

```typescript
import { supabase } from './lib/supabase';

// Test simple
const { data, error } = await supabase.from('teams').select('*');
console.log(data, error);
```

---

## 📊 Structure de la base de données

### Tables principales :

**teams** → Équipes/organisations
- id, name, slug, created_at, updated_at

**poles** → Pôles/départements (Marketing, Design, Tech, Ops)
- id, team_id, name, description, color, created_at, updated_at

**users** → Utilisateurs
- id, team_id, pole_id, first_name, last_name, email, role, avatar_color, created_at, updated_at

**decisions** → Décisions
- id, team_id, pole_id, creator_id, title, context, deadline, status, completed_at, created_at, updated_at

**vote_options** → Options de vote pour chaque décision
- id, decision_id, label, position, created_at

**votes** → Votes des utilisateurs
- id, decision_id, option_id, user_id, created_at

**arguments** → Arguments pour/contre les options
- id, decision_id, option_id, user_id, text, mentions, created_at, updated_at

**decision_participants** → Qui participe à quelle décision (many-to-many)
- id, decision_id, user_id, created_at

**ai_summaries** → Synthèses IA des décisions
- id, decision_id, result, winning_option, main_arguments (JSON), concerns, recommendation, created_at

**notifications** → Notifications utilisateurs
- id, user_id, decision_id, triggered_by_user_id, type, title, message, read, created_at

**audit_logs** → Historique des actions
- id, user_id, decision_id, action, details, metadata (JSON), created_at

**pending_invites** → Invitations en attente
- id, team_id, email, role, invited_by_user_id, expires_at, created_at

---

## 🔒 Sécurité (RLS activé)

Toutes les tables ont Row Level Security activé :

- Les users ne voient **que leur équipe**
- Les users ne peuvent **voter qu'une fois** par décision
- Les users ne peuvent **modifier que leur profil**
- Les notifications sont **privées** (chaque user voit les siennes)

---

## 🚀 Prochaines étapes

Maintenant que la DB est prête :

1. ✅ **Créer les tables** (suivre étape 1 ci-dessus)
2. ⏭️ **Créer les hooks React** pour fetch/mutate les données
3. ⏭️ **Remplacer les mock data** par les vrais calls Supabase
4. ⏭️ **Implémenter l'auth** (login, register, logout)
5. ⏭️ **Tester en local**
6. ⏭️ **Déployer** 🎉

---

## 📝 Notes importantes

- **Realtime** : Supabase supporte le realtime sur toutes les tables. On pourra l'activer plus tard pour les votes en temps réel.
- **Storage** : Si besoin d'upload d'images (avatars, etc.), Supabase Storage est disponible.
- **Edge Functions** : Pour la logique métier complexe (ex: IA summaries), on peut utiliser Supabase Edge Functions.

---

## ❓ Problèmes courants

**Erreur "relation does not exist"** → Les tables ne sont pas créées, relancer le SQL
**Erreur "new row violates row-level security"** → Vérifier que l'user est bien dans une team
**Erreur "null value in column"** → Vérifier les champs required dans les INSERT

---

Besoin d'aide ? Demandez-moi ! 🚀
