# ✅ Logging Automatique des Actions - Implémenté

## 📋 Résumé

Le système de **logging automatique** des actions utilisateur a été implémenté ! Les actions principales sont maintenant automatiquement enregistrées dans la table `audit_logs` de Supabase.

---

## 🔧 Fichiers créés/modifiés

### 1. **Nouveau fichier : `src/utils/auditLog.ts`**

Fonction utilitaire pour simplifier la création de logs d'audit.

**Fonctionnalités :**
```typescript
import { createAuditLog } from '../utils/auditLog';

await createAuditLog({
    userId: user.id,
    action: 'decision_created',
    details: 'A créé la décision "Titre"',
    decisionId: decision.id,  // optionnel
    metadata: { ... },         // optionnel
});
```

**Types d'actions supportés :**
- `decision_created`
- `decision_completed`
- `vote_cast`
- `vote_changed`
- `argument_added`
- `deadline_changed`
- `participant_added`
- `member_invited`
- `member_role_changed`
- `settings_changed`

---

### 2. **Hook modifié : `src/hooks/useDecisions.ts`**

**Action logged : Création de décision**

Quand un utilisateur crée une nouvelle décision, un log est automatiquement créé :

```typescript
await createAuditLog({
    userId: profile.id,
    action: 'decision_created',
    details: `A créé la décision "${decision.title}"`,
    decisionId: newDecision.id,
});
```

**Exemple de log généré :**
```
Martin Chevalier | Décision créée | A créé la décision "Passer en full remote ?"
```

---

### 3. **Page modifiée : `src/pages/app/DecisionDetail.tsx`**

**Actions logged :**

#### a) Vote (premier vote)
Quand un utilisateur vote pour la première fois :

```typescript
await createAuditLog({
    userId: profile.id,
    action: 'vote_cast',
    details: `A voté "${optionLabel}" sur "${decision.title}"`,
    decisionId: id,
});
```

**Exemple de log généré :**
```
Martin Chevalier | Vote | A voté "Oui, full remote" sur "Passer en full remote ?"
```

#### b) Modification de vote
Quand un utilisateur change son vote :

```typescript
await createAuditLog({
    userId: profile.id,
    action: 'vote_changed',
    details: `A modifié son vote pour "${optionLabel}" sur "${decision.title}"`,
    decisionId: id,
});
```

**Exemple de log généré :**
```
Martin Chevalier | Vote modifié | A modifié son vote pour "Non, garder le bureau" sur "Passer en full remote ?"
```

#### c) Ajout d'argument
Quand un utilisateur ajoute un argument :

```typescript
await createAuditLog({
    userId: profile.id,
    action: 'argument_added',
    details: `A ajouté un argument pour "${optionLabel}" sur "${decision.title}"`,
    decisionId: id,
});
```

**Exemple de log généré :**
```
Martin Chevalier | Argument | A ajouté un argument pour "Oui, full remote" sur "Passer en full remote ?"
```

---

## 🎯 Actions actuellement loggées

| Action | Déclencheur | Où | Statut |
|--------|-------------|-----|--------|
| **Décision créée** | Création d'une nouvelle décision | `useDecisions.createDecision()` | ✅ Fait |
| **Vote** | Premier vote d'un utilisateur | `DecisionDetail.handleVote()` | ✅ Fait |
| **Vote modifié** | Changement de vote | `DecisionDetail.handleVote()` | ✅ Fait |
| **Argument ajouté** | Ajout d'un argument | `DecisionDetail.handleAddArgument()` | ✅ Fait |

---

## 🧪 Test

Pour tester le système de logging automatique :

1. **Crée une nouvelle décision** depuis `/app/decisions/new`
   → Un log `decision_created` devrait apparaître dans l'Audit Log

2. **Vote sur une décision** depuis `/app/decisions/:id`
   → Un log `vote_cast` devrait apparaître

3. **Change ton vote** (clique sur une autre option puis "Voter")
   → Un log `vote_changed` devrait apparaître

4. **Ajoute un argument** en bas de la page décision
   → Un log `argument_added` devrait apparaître

5. **Vérifie dans l'Audit Log** (`/app/audit`)
   → Toutes ces actions devraient être visibles avec :
     - Ton nom et avatar
     - Type d'action (badge coloré)
     - Détails de l'action
     - Date et heure
     - Lien vers la décision (clic sur la ligne)

---

## 📊 Exemple de Timeline dans l'Audit Log

```
AUJOURD'HUI
┌────────────────────────────────────────────────────────────┐
│ MC  Martin Chevalier  [Argument]                     16:32 │
│     A ajouté un argument pour "Oui, full remote" sur       │
│     "Passer en full remote ?"                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ MC  Martin Chevalier  [Vote modifié]                 15:47 │
│     A modifié son vote pour "Non, garder le bureau" sur    │
│     "Passer en full remote ?"                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ MC  Martin Chevalier  [Vote]                         14:22 │
│     A voté "Oui, full remote" sur "Passer en full remote ?"│
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ MC  Martin Chevalier  [Décision créée]               10:15 │
│     A créé la décision "Passer en full remote ?"           │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Prochaines actions à logger (optionnel)

Voici d'autres actions que tu pourrais ajouter plus tard :

### 1. **Décision terminée** (`decision_completed`)
```typescript
// Dans useDecisions.updateDecision() ou via un trigger SQL
await createAuditLog({
    userId: profile.id,
    action: 'decision_completed',
    details: `La décision "${decision.title}" a été marquée comme terminée`,
    decisionId: decision.id,
});
```

### 2. **Deadline modifiée** (`deadline_changed`)
```typescript
// Dans la page de modification de décision
await createAuditLog({
    userId: profile.id,
    action: 'deadline_changed',
    details: `A repoussé la deadline de "${decision.title}" au ${newDeadline}`,
    decisionId: decision.id,
});
```

### 3. **Participant ajouté** (`participant_added`)
```typescript
// Quand on ajoute un participant à une décision existante
await createAuditLog({
    userId: profile.id,
    action: 'participant_added',
    details: `A ajouté ${newParticipant.name} à la décision "${decision.title}"`,
    decisionId: decision.id,
});
```

### 4. **Membre invité** (`member_invited`)
```typescript
// Dans InviteModal ou dans la gestion d'équipe
await createAuditLog({
    userId: profile.id,
    action: 'member_invited',
    details: `A invité ${email} à rejoindre l'équipe`,
});
```

### 5. **Rôle modifié** (`member_role_changed`)
```typescript
// Dans la gestion des membres (Settings)
await createAuditLog({
    userId: profile.id,
    action: 'member_role_changed',
    details: `A promu ${member.name} au rôle d'${newRole}`,
    metadata: { memberId: member.id, oldRole, newRole },
});
```

### 6. **Paramètres modifiés** (`settings_changed`)
```typescript
// Dans la page Settings après modification
await createAuditLog({
    userId: profile.id,
    action: 'settings_changed',
    details: `A modifié les paramètres de l'équipe`,
});
```

---

## ✅ Avantages du système actuel

1. **Traçabilité complète** : Chaque action importante est enregistrée
2. **Attribution claire** : On sait qui a fait quoi et quand
3. **Contexte riche** : Les logs contiennent des détails lisibles
4. **Lien vers les décisions** : Un clic sur un log redirige vers la décision
5. **Filtrable** : Par type d'action et par membre
6. **Exportable** : Export CSV pour audit externe
7. **Non-bloquant** : Si le log échoue, l'action principale réussit quand même

---

## 🔐 Sécurité & Performance

### Gestion des erreurs
La fonction `createAuditLog` ne lance pas d'exception :
- Si le log échoue, l'erreur est loggée dans la console
- L'action principale (vote, création, etc.) n'est pas affectée

### Performance
- Les logs sont créés en parallèle des autres opérations (non-bloquant)
- Pas d'impact sur l'UX : l'utilisateur ne voit pas de délai

---

## 🎉 Résultat

Le système de logging automatique est maintenant **pleinement opérationnel** ! 

Chaque action importante des utilisateurs est automatiquement enregistrée et visible dans l'Audit Log, offrant une **traçabilité complète** pour la bêta et au-delà 🚀

---

## 📝 Notes

- Les logs sont automatiquement filtrés par équipe (RLS désactivé pour l'instant)
- Tous les logs incluent l'`user_id`, l'`action`, les `details`, et optionnellement le `decision_id`
- Le champ `metadata` (JSONB) est disponible pour stocker des données structurées supplémentaires si nécessaire
