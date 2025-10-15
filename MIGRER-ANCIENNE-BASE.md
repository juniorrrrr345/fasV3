# 📦 Migrer les Données de l'Ancienne Base D1

## 🎯 Situation

Vous avez une ancienne base D1 (ID: `b38148fa-7325-4c06-99a3-ebeed3c8ea6f`) avec des produits dedans.

Vous voulez les **migrer vers la nouvelle base** `gd33v3`.

---

## 🔍 ÉTAPE 1 : Lister Toutes Vos Bases D1

```powershell
cd C:\Users\PC\Documents\THEGD33V3
npx wrangler d1 list
```

Cela affichera toutes vos bases de données disponibles avec leurs noms et IDs.

**Notez** :
- Le **nom** de l'ancienne base
- Le **nom** de la nouvelle base (`gd33v3`)

---

## 📤 ÉTAPE 2 : Exporter les Données de l'Ancienne Base

### Option A : Via Cloudflare Dashboard (Recommandé)

1. **https://dash.cloudflare.com**
2. **Menu gauche** → **Workers & Pages** → **D1 SQL Database**
3. **Cliquez sur l'ancienne base** (celle avec l'ID `b38148fa...`)
4. **Onglet "Console"**
5. **Exécutez ces requêtes** pour voir les données :

```sql
-- Voir tous les produits
SELECT * FROM products;

-- Voir toutes les catégories
SELECT * FROM categories;

-- Voir tous les settings
SELECT * FROM settings;

-- Voir toutes les farms
SELECT * FROM farms;

-- Voir tous les socials
SELECT * FROM socials;
```

6. **Copiez les résultats** ou prenez des captures d'écran

---

### Option B : Via Export JSON

**Dans la Console D1** (Dashboard) :

1. **Pour chaque table**, exécutez :

```sql
SELECT json_group_array(
  json_object(
    'id', id,
    'name', name,
    'description', description,
    'category', category,
    'farm', farm,
    'photo', photo,
    'video', video,
    'medias', medias,
    'variants', variants,
    'price', price,
    'createdAt', createdAt,
    'updatedAt', updatedAt
  )
) as data
FROM products;
```

2. **Copiez le résultat JSON**

3. **Créez un fichier** `export-ancienne-base.json` :

```json
{
  "products": [...],
  "categories": [...],
  "settings": {...},
  "farms": [...],
  "socials": [...]
}
```

---

## 📥 ÉTAPE 3 : Importer dans la Nouvelle Base

### Méthode 1 : Via le Panel Admin (Plus Simple)

1. **Connectez-vous au panel admin** : https://thegd-33-v3-two.vercel.app/admin/login

2. **Ajoutez manuellement** :
   - Les catégories
   - Les produits
   - Les farms
   - Les socials
   - Les settings

**Avantage** : Interface graphique, facile  
**Inconvénient** : Plus long si vous avez beaucoup de produits

---

### Méthode 2 : Via Script de Migration

**Si vous avez beaucoup de données**, je peux créer un script qui :

1. Lit l'export JSON
2. Insère tout dans la nouvelle base via l'API

Mais j'ai besoin de **voir les données** d'abord.

---

## 🚀 MÉTHODE RAPIDE : Copie Directe

Si vous voulez **remplacer complètement** `gd33v3` par l'ancienne base :

### Via Dashboard Cloudflare

1. **Allez dans la console de l'ancienne base**
2. **Exportez tout** en JSON
3. **Allez dans la console de gd33v3**
4. **Insérez les données** avec des requêtes INSERT

---

## 📋 SCRIPT AUTOMATIQUE

Si vous voulez un **script automatique de migration**, voici ce qu'il faut :

### 1. Installez un outil d'export

```powershell
npm install -g d1-export
```

### 2. Exportez l'ancienne base

```powershell
npx wrangler d1 export ANCIEN_NOM_BASE > export-old.sql
```

### 3. Importez dans la nouvelle

```powershell
npx wrangler d1 execute gd33v3 --file export-old.sql
```

---

## 🎯 RECOMMANDATION

**Pour commencer**, faites ceci :

### 1. Listez vos bases

```powershell
npx wrangler d1 list
```

**Dites-moi** :
- Le **nom** de l'ancienne base (celle avec des produits)
- Combien de **produits** vous avez environ

### 2. Je vous créerai un script spécifique

En fonction de la quantité de données, je vous ferai :
- **Script automatique** (si beaucoup de données)
- **Migration manuelle** (si peu de données)

---

## ⚠️ IMPORTANT

**Avant de migrer** :

1. ✅ Assurez-vous que la nouvelle base `gd33v3` est bien initialisée
2. ✅ Testez avec 1-2 produits manuellement d'abord
3. ✅ Gardez l'ancienne base intacte (ne la supprimez pas)

---

## 🆘 BESOIN D'AIDE

**Exécutez** :

```powershell
cd C:\Users\PC\Documents\THEGD33V3
npx wrangler d1 list
```

**Et envoyez-moi** :
- La liste des bases affichées
- Le nom de la base avec vos produits
- Environ combien de produits vous avez

Je créerai un script de migration adapté ! 🚀
