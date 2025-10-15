# 🗄️ Vérifier la Base de Données D1

## ✅ Vous êtes connecté au panel admin !

Maintenant testons que les données s'enregistrent bien.

---

## 🧪 TEST 1 : Modifier les Paramètres

### Dans le Panel Admin

1. **Allez dans "Configuration"** ou "Settings"

2. **Modifiez quelque chose** :
   - Changez le nom de la boutique : `THEGD33` → `Ma Boutique Test`
   - Changez le titre : `THEGD33` → `Bienvenue chez moi`

3. **Cliquez sur "Enregistrer"**

4. **Vous devriez voir** : "Paramètres sauvegardés avec succès !"

### Vérifier que c'est enregistré

**Ouvrez dans votre navigateur** :
```
https://thegd33.calitek-junior.workers.dev/api/settings
```

**Vous devriez voir** vos modifications :
```json
{
  "general": {
    "shopName": "Ma Boutique Test",
    "heroTitle": "Bienvenue chez moi",
    ...
  }
}
```

✅ **Si vous voyez vos modifications** → La base de données fonctionne !

---

## 🗂️ VÉRIFIER LES TABLES D1 depuis Cloudflare Dashboard

### Méthode 1 : Via l'Interface Web

1. **Cloudflare Dashboard** → **Workers & Pages**

2. **Menu de gauche** → **D1 SQL Database**

3. **Cliquez sur votre base** : `gd33v3`

4. **Onglet "Console"** en haut

5. **Tapez des requêtes SQL** :

```sql
-- Voir tous les settings
SELECT * FROM settings;

-- Voir tous les produits
SELECT * FROM products;

-- Voir toutes les catégories
SELECT * FROM categories;

-- Voir tous les utilisateurs admin
SELECT id, username, createdAt FROM admin_users;

-- Compter les produits
SELECT COUNT(*) as total FROM products;
```

6. **Cliquez sur "Execute"**

---

### Méthode 2 : Via Wrangler (ligne de commande)

```powershell
# Voir tous les settings
npx wrangler d1 execute gd33v3 --command "SELECT * FROM settings"

# Voir la structure des tables
npx wrangler d1 execute gd33v3 --command "SELECT name FROM sqlite_master WHERE type='table'"

# Voir tous les produits
npx wrangler d1 execute gd33v3 --command "SELECT * FROM products"
```

---

## 🧪 TEST 2 : Ajouter un Produit

### Dans le Panel Admin

1. **Allez dans "Produits"**

2. **Cliquez sur "Nouveau Produit"** ou "Ajouter un produit"

3. **Remplissez** :
   - Nom : `Produit Test`
   - Description : `Ceci est un test`
   - Prix : `10`

4. **Enregistrez**

### Vérifier dans l'API

**Ouvrez** :
```
https://thegd33.calitek-junior.workers.dev/api/products
```

**Vous devriez voir** votre produit dans la liste JSON.

---

## 🧪 TEST 3 : Ajouter une Catégorie

### Dans le Panel Admin

1. **Allez dans "Catégories"**

2. **Ajoutez une catégorie** :
   - Nom : `Test Catégorie`
   - Icône : `🧪`

3. **Enregistrez**

### Vérifier dans l'API

**Ouvrez** :
```
https://thegd33.calitek-junior.workers.dev/api/categories
```

**Vous devriez voir** votre catégorie.

---

## 📊 COMMANDES UTILES POUR VÉRIFIER LA BASE

### Voir toutes les tables

```powershell
npx wrangler d1 execute gd33v3 --command "SELECT name FROM sqlite_master WHERE type='table'"
```

**Vous devriez voir** :
- products
- categories
- socials
- settings
- farms
- admin_users

### Voir le contenu de chaque table

```powershell
# Settings
npx wrangler d1 execute gd33v3 --command "SELECT * FROM settings"

# Produits
npx wrangler d1 execute gd33v3 --command "SELECT id, name, price FROM products"

# Catégories
npx wrangler d1 execute gd33v3 --command "SELECT * FROM categories"

# Utilisateurs admin
npx wrangler d1 execute gd33v3 --command "SELECT id, username FROM admin_users"
```

---

## 🔧 Si les données ne s'enregistrent PAS

### Vérifiez les erreurs dans la console

1. **Dans le panel admin**, ouvrez la console (F12)

2. **Regardez l'onglet "Network"**

3. **Faites une modification et enregistrez**

4. **Regardez les requêtes** :
   - Si vous voyez `PUT /api/settings` avec status **200** → Ça marche ✅
   - Si vous voyez une **erreur** → Notez l'erreur

### Vérifiez les logs du Worker

1. **Cloudflare Dashboard** → **Workers & Pages** → **thegd33**

2. **Onglet "Logs"** (si disponible)

3. **Ou utilisez** :
   ```powershell
   npx wrangler tail
   ```

4. **Faites une modification** dans le panel admin

5. **Regardez les logs** en temps réel

---

## 🎯 CHECKLIST

Testez dans cet ordre :

- [ ] Modifier les paramètres généraux
- [ ] Vérifier l'API `/api/settings` → modifications visibles
- [ ] Ajouter un produit
- [ ] Vérifier l'API `/api/products` → produit visible
- [ ] Ajouter une catégorie
- [ ] Vérifier l'API `/api/categories` → catégorie visible
- [ ] Vérifier la base D1 via Cloudflare Dashboard
- [ ] Tout fonctionne ✅

---

## 🎉 SI TOUT FONCTIONNE

**FÉLICITATIONS ! 🎊**

Votre boutique est maintenant complètement fonctionnelle :
- ✅ Panel admin accessible
- ✅ API Cloudflare fonctionne
- ✅ Base de données D1 enregistre
- ✅ Frontend Vercel connecté

**Vous pouvez maintenant** :
- Ajouter vos vrais produits
- Personnaliser votre boutique
- Gérer vos catégories
- Uploader des images vers R2
- Tout gérer depuis le panel admin !

---

**Testez maintenant et dites-moi si tout s'enregistre bien ! 🚀**
