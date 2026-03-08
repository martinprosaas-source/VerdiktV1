# 🐛 Bugfix : Écran noir sur Dashboard et Décisions

## 📋 Problème

Après correction des relations dans Supabase, le Dashboard et la page Décisions affichaient un écran noir au chargement.

**Symptômes :**
- Clic sur "Dashboard" ou "Décisions" → rien ne s'affiche
- Puis écran noir (crash de React)
- Autres pages (Audit Log, Team) fonctionnent correctement

---

## 🔍 Cause probable

Les décisions récupérées depuis Supabase avaient des données incomplètes ou mal formées :
- Options de vote manquantes ou null
- Creator ou pole null
- Dates invalides

Cela causait des erreurs non gérées lors du rendu des composants `DecisionCard`.

---

## ✅ Corrections apportées

### 1. **src/hooks/useDecisions.ts**

#### a) Logs de debug ajoutés

**Ajouté :**
```typescript
console.log('Fetching decisions for team:', profile.team_id);
console.log('Fetched decisions:', decisionsData?.length || 0);
console.log('Decisions with details:', decisionsWithDetails.length);
```

#### b) Gestion d'erreurs robuste pour chaque décision

**Avant :**
```typescript
const decisionsWithDetails = await Promise.all(
    (decisionsData || []).map(async (decision: any) => {
        const { data: options } = await supabase
            .from('vote_options')
            .select('*')
            // ...
        return {
            ...decision,
            options: optionsWithCounts,
        };
    })
);
```

**Après :**
```typescript
const decisionsWithDetails = await Promise.all(
    (decisionsData || []).map(async (decision: any) => {
        try {
            const { data: options, error: optionsError } = await supabase
                .from('vote_options')
                .select('*')
                // ...
            
            if (optionsError) {
                console.error(`Error fetching options for decision ${decision.id}:`, optionsError);
            }
            
            return {
                ...decision,
                options: optionsWithCounts || [],  // ✅ Fallback vide
                votes_count: votesCount || 0,
                participants_count: participantsCount || 0,
            };
        } catch (decisionError) {
            console.error(`Error processing decision ${decision.id}:`, decisionError);
            return {
                ...decision,
                options: [],  // ✅ Données minimales
                votes_count: 0,
                participants_count: 0,
            };
        }
    })
);
```

---

### 2. **src/pages/app/Dashboard.tsx**

#### a) Protection contre les dates invalides

**Avant :**
```typescript
const decisionsThisMonth = decisions.filter(d => {
    const createdAt = new Date(d.created_at);
    return createdAt >= thisMonth && createdAt <= now;
}).length;
```

**Après :**
```typescript
const decisionsThisMonth = decisions.filter(d => {
    if (!d || !d.created_at) return false;  // ✅ Vérification
    try {
        const createdAt = new Date(d.created_at);
        return createdAt >= thisMonth && createdAt <= now;
    } catch (e) {
        console.error('Error parsing date:', e);
        return false;
    }
}).length;
```

#### b) Protection du rendu des DecisionCard

**Avant :**
```typescript
{stats.activeDecisions.map((decision) => (
    <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />
))}
```

**Après :**
```typescript
{stats.activeDecisions.map((decision) => {
    try {
        return <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />;
    } catch (error) {
        console.error('Error rendering decision:', decision.id, error);
        return null;  // ✅ Continue le rendu des autres décisions
    }
})}
```

---

### 3. **src/pages/app/DecisionsList.tsx**

**Même protection ajoutée :**
```typescript
{filteredAndSortedDecisions.map((decision) => {
    try {
        return <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />;
    } catch (error) {
        console.error('Error rendering decision:', decision.id, error);
        return null;
    }
})}
```

---

## 🧪 Comment tester

### 1. Refresh l'application
```bash
# Dans ton navigateur
Cmd+R (ou F5)
```

### 2. Ouvre la Console
```bash
# Dans le navigateur
Cmd+Option+J (Chrome/Edge)
Cmd+Option+C (Safari)
```

### 3. Va sur le Dashboard
- Tu devrais voir des logs dans la console :
  ```
  Fetching decisions for team: <team_id>
  Fetched decisions: 2
  Decisions with details: 2
  ```

### 4. Vérifie les décisions
- Les 2 décisions devraient s'afficher
- Si une décision a des données manquantes, elle devrait quand même s'afficher avec des valeurs par défaut

### 5. Si erreurs dans la console
- Note les messages d'erreur
- Copie-les et envoie-les moi pour qu'on corrige

---

## 📊 Stratégie de gestion d'erreurs

### Principe : "Fail Gracefully"

Au lieu de crasher toute l'app si une décision a un problème :
1. ✅ Log l'erreur dans la console
2. ✅ Retourne des données par défaut pour cette décision
3. ✅ Continue le rendu des autres décisions
4. ✅ L'utilisateur voit les décisions valides

### Cascade de protection

```
useDecisions (Hook)
    ↓
    Try-catch par décision → Données par défaut si erreur
    ↓
Dashboard/DecisionsList (Pages)
    ↓
    Try-catch par carte → null si erreur
    ↓
DecisionCard (Composant)
    ↓
    Affichage ou rien (pas de crash)
```

---

## 🎯 Résultat attendu

### Avant le fix :
- ❌ Écran noir sur Dashboard/Décisions
- ❌ App inutilisable
- ❌ Aucun message d'erreur

### Après le fix :
- ✅ Dashboard et Décisions chargent
- ✅ Les 2 décisions s'affichent
- ✅ Si erreur → log dans console + décision ignorée
- ✅ App stable et utilisable

---

## 🔍 Debug si ça ne marche toujours pas

Si l'écran reste noir :

1. **Ouvre la Console** et cherche les logs :
   - "Fetching decisions for team: ..."
   - "Fetched decisions: ..."
   - Messages d'erreur en rouge

2. **Copie les erreurs** et envoie-les moi

3. **Vérifie les données** dans Supabase :
   ```sql
   SELECT d.*, vo.* 
   FROM decisions d
   LEFT JOIN vote_options vo ON vo.decision_id = d.id
   WHERE d.team_id = '<ton_team_id>';
   ```

---

## ✅ Fichiers modifiés

| Fichier | Changements | Impact |
|---------|-------------|--------|
| `src/hooks/useDecisions.ts` | Logs + try-catch par décision | Erreurs non bloquantes |
| `src/pages/app/Dashboard.tsx` | Protection dates + try-catch rendu | Pas de crash |
| `src/pages/app/DecisionsList.tsx` | Try-catch rendu | Pas de crash |

---

## 🎉 Résultat

L'application devrait maintenant :
- ✅ Charger le Dashboard sans crash
- ✅ Afficher les décisions de manière robuste
- ✅ Logger les erreurs sans bloquer l'UI
- ✅ Être stable pour la bêta

**Refresh et teste maintenant ! 🚀**
