# 🚀 Migration Rapide - Ancienne Base → gd33v3

## 📋 MÉTHODE SIMPLE (Recommandée)

### Via Cloudflare Dashboard

C'est la méthode **la plus simple et la plus sûre** !

---

## 🔧 ÉTAPES

### 1️⃣ Ouvrir l'Ancienne Base

1. **https://dash.cloudflare.com**
2. **Workers & Pages** → **D1 SQL Database**
3. **Cherchez la base** avec l'ID qui commence par `b38148fa...`
4. **Cliquez dessus**
5. **Onglet "Console"**

---

### 2️⃣ Exporter les Produits

Dans la console SQL, exécutez :

```sql
SELECT * FROM products;
```

**Copiez le résultat** (ou faites une capture d'écran).

---

### 3️⃣ Ouvrir la Nouvelle Base

1. **Restez sur D1 SQL Database**
2. **Cherchez** `gd33v3`
3. **Cliquez dessus**
4. **Onglet "Console"**

---

### 4️⃣ Importer les Produits

**Pour chaque produit de l'ancienne base**, exécutez :

```sql
INSERT OR REPLACE INTO products 
(id, name, description, category, farm, photo, video, medias, variants, price, createdAt, updatedAt)
VALUES 
('id_du_produit', 'nom', 'description', 'catégorie', 'farm', 'photo_url', 'video_url', '[]', '[]', 'prix', 'date', 'date');
```

**Remplacez** les valeurs par celles de vos produits.

---

### 5️⃣ Importer les Catégories

```sql
SELECT * FROM categories;
```

Puis dans gd33v3 :

```sql
INSERT OR REPLACE INTO categories (id, name, icon, description)
VALUES ('id', 'nom', 'icône', 'description');
```

---

### 6️⃣ Importer les Settings

```sql
SELECT * FROM settings;
```

Puis dans gd33v3 :

```sql
INSERT OR REPLACE INTO settings (key, value)
VALUES ('clé', 'valeur');
```

---

### 7️⃣ Importer les Farms (si applicable)

```sql
SELECT * FROM farms;
```

Puis dans gd33v3 :

```sql
INSERT OR REPLACE INTO farms (id, name, image, description)
VALUES ('id', 'nom', 'image_url', 'description');
```

---

### 8️⃣ Importer les Socials (si applicable)

```sql
SELECT * FROM socials;
```

Puis dans gd33v3 :

```sql
INSERT OR REPLACE INTO socials (id, name, icon, description, url)
VALUES ('id', 'nom', 'icône', 'description', 'url');
```

---

## ✅ Vérifier

Une fois tout importé, vérifiez :

```
https://thegd33.calitek-junior.workers.dev/api/products
https://thegd33.calitek-junior.workers.dev/api/categories
https://thegd33.calitek-junior.workers.dev/api/settings
```

Vous devriez voir toutes vos données !

---

## 🎯 ALTERNATIVE : Script Automatique

Si vous avez **beaucoup de produits** (plus de 10), utilisez le script :

```powershell
cd C:\Users\PC\Documents\THEGD33V3

# Export
node migration-complete.cjs

# Import
node migration-complete.cjs --import
```

⚠️ **MAIS** : Cela nécessite que wrangler soit authentifié.

---

## 💡 CONSEIL

**Commencez par** :

1. Listez vos bases avec : `npx wrangler d1 list`
2. Vérifiez le **nom** de l'ancienne base
3. Ouvrez-la dans le Dashboard
4. Comptez combien de produits vous avez

**Ensuite** :
- **Moins de 10 produits** → Migration manuelle via Dashboard ✅
- **Plus de 10 produits** → Script automatique

---

**Dites-moi combien de produits vous avez environ ! 🚀**
