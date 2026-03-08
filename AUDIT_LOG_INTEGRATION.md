# ✅ Intégration Audit Log - Supabase

## 📋 Résumé

La page **Audit Log** a été entièrement connectée à Supabase et n'utilise plus de mock data. Elle affiche maintenant les actions réelles des utilisateurs de votre équipe.

---

## 🔧 Fichiers modifiés

### 1. **Nouveau Hook : `src/hooks/useAuditLog.ts`**
- Hook custom pour récupérer les logs d'audit depuis Supabase
- Filtre automatiquement par équipe (team_id)
- Récupère les détails de l'utilisateur (nom, email, avatar)
- Limite aux 100 dernières entrées
- Tri par date décroissante (plus récent en premier)

**Fonctionnalités :**
```typescript
const { logs, loading, refetch } = useAuditLog();
```

### 2. **Page mise à jour : `src/pages/app/AuditLog.tsx`**

**Changements :**
- ✅ Remplacé les mock data (`auditLog`, `users`) par les hooks Supabase
- ✅ Utilisation de `useAuditLog()` pour les logs
- ✅ Utilisation de `useTeam()` pour la liste des membres
- ✅ Ajout d'un état de chargement avec spinner
- ✅ Adaptation des données (snake_case → camelCase)
- ✅ Gestion des utilisateurs supprimés (avatar par défaut)
- ✅ Export CSV fonctionnel avec vraies données

**Filtres disponibles :**
- Par type d'action : Tout / Décisions / Votes / Équipe
- Par membre de l'équipe (dropdown dynamique)

---

## 🗄️ Structure de la table `audit_logs`

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    decision_id UUID REFERENCES decisions(id),
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Types d'actions supportés :**
- `decision_created` - Décision créée
- `decision_completed` - Décision terminée
- `vote_cast` - Vote
- `vote_changed` - Vote modifié
- `argument_added` - Argument ajouté
- `deadline_changed` - Deadline modifiée
- `participant_added` - Participant ajouté
- `member_invited` - Membre invité
- `member_role_changed` - Rôle modifié
- `settings_changed` - Paramètres modifiés

---

## 🧪 Test avec données d'exemple

Pour tester l'Audit Log avec des données réelles, exécute le script SQL :

```bash
# Dans le SQL Editor de Supabase
```

**Fichier :** `supabase/test-audit-logs.sql`

⚠️ **Important :** Modifie l'email dans le script avant de l'exécuter :
```sql
WHERE email = 'martin@example.com' -- Remplace par ton vrai email
```

Ce script va créer 8 entrées d'audit log d'exemple :
- Création de décision
- Invitation de membre
- Vote
- Ajout d'argument
- Modification de paramètres
- Changement de vote
- Modification de deadline
- Changement de rôle

---

## 📊 Fonctionnalités

### ✅ Affichage
- Timeline chronologique groupée par date (Aujourd'hui, Hier, dates)
- Avatar de l'utilisateur avec couleur personnalisée
- Badge coloré selon le type d'action
- Heure précise de l'action
- Détails de l'action
- Clic sur une entrée = navigation vers la décision (si applicable)

### ✅ Filtres
- **Par type** : Tout / Décisions / Votes / Équipe
- **Par membre** : Liste déroulante de tous les membres de l'équipe

### ✅ Export
- Export CSV de tous les logs filtrés
- Colonnes : Date, Action, Utilisateur, Détails
- Nom du fichier : `audit-log-YYYY-MM-DD.csv`

---

## 🎯 Prochaines étapes

### 1. **Implémenter la création automatique de logs**

Pour que les logs se créent automatiquement lors des actions utilisateur, ajoute ces appels dans les hooks existants :

**Exemple dans `useDecisions` :**
```typescript
const createDecision = async (data: any) => {
    // ... création de la décision ...
    
    // Log l'action
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        decision_id: newDecision.id,
        action: 'decision_created',
        details: `A créé la décision "${data.title}"`,
    });
};
```

**Exemple lors d'un vote :**
```typescript
const handleVote = async (optionId: string) => {
    // ... logique de vote ...
    
    // Log l'action
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        decision_id: decisionId,
        action: isFirstVote ? 'vote_cast' : 'vote_changed',
        details: `A voté "${optionName}" sur "${decisionTitle}"`,
    });
};
```

### 2. **Ajouter des triggers SQL (optionnel)**

Pour certaines actions système, tu peux créer des triggers SQL qui créent automatiquement des logs :

```sql
CREATE OR REPLACE FUNCTION log_decision_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO audit_logs (user_id, decision_id, action, details)
        VALUES (
            NEW.creator_id,
            NEW.id,
            'decision_completed',
            'La décision "' || NEW.title || '" a été complétée'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_decision_completed
    AFTER UPDATE ON decisions
    FOR EACH ROW
    EXECUTE FUNCTION log_decision_completion();
```

---

## ✅ Statut

| Fonctionnalité | Statut |
|----------------|--------|
| Hook `useAuditLog` | ✅ Fait |
| Page connectée à Supabase | ✅ Fait |
| Filtres (type + membre) | ✅ Fait |
| Export CSV | ✅ Fait |
| Affichage timeline | ✅ Fait |
| Mock data supprimée | ✅ Fait |
| Logs automatiques | ⏳ À implémenter |
| Triggers SQL | ⏳ Optionnel |

---

## 🎉 Résultat

L'Audit Log est maintenant **100% connecté à Supabase** et prêt à afficher les actions réelles de ton équipe ! 

Pour voir des données, il faut soit :
1. Exécuter le script `test-audit-logs.sql` pour avoir des exemples
2. Implémenter la création automatique de logs dans les actions utilisateur (étape suivante recommandée)
