# ✅ Vérifier que Tout Marche - Panel Admin

## 🎯 Tests à Effectuer

Voici ce que vous devez tester pour vérifier que tout fonctionne :

---

## 1️⃣ Configuration / Settings ⚙️

### ✅ Ce qui DEVRAIT marcher :

**Test** :
- Modifier le nom de la boutique
- Modifier les textes d'accueil
- Ajouter/modifier les sections
- **Sauvegarder**

**Résultat attendu** :
- Message "Paramètres sauvegardés avec succès !"
- Vérifier sur : https://thegd33.calitek-junior.workers.dev/api/settings

### ❌ Ce qui NE MARCHE PAS (pour l'instant) :

- ❌ **Upload image de fond** → Nécessite la création du bucket R2 (voir `FIX-UPLOAD-R2.md`)

---

## 2️⃣ Produits 📦

### Test :

1. **Cliquez sur "Produits"**
2. **"Nouveau Produit"**
3. **Remplissez** :
   - Nom : Test Produit
   - Description : Description test
   - Prix : 10
   - Catégorie : (choisir ou laisser vide)
4. **Enregistrer**

### Vérification :

**API** : https://thegd33.calitek-junior.workers.dev/api/products

Vous devriez voir votre produit.

### ⚠️ Upload d'images produits

- Fonctionne uniquement si le bucket R2 est créé
- Sinon, laissez vide pour l'instant

---

## 3️⃣ Catégories 🏷️

### Test :

1. **Cliquez sur "Catégories"**
2. **Ajouter une catégorie** :
   - Nom : Test Catégorie
   - Icône : 🧪
   - Description : Une catégorie de test
3. **Enregistrer**

### Vérification :

**API** : https://thegd33.calitek-junior.workers.dev/api/categories

---

## 4️⃣ Farms 🌾

### Test :

1. **Cliquez sur "Farms"**
2. **Ajouter une farm** :
   - Nom : Ma Ferme Test
   - Description : Description de la ferme
3. **Enregistrer**

### Vérification :

**API** : https://thegd33.calitek-junior.workers.dev/api/farms

---

## 5️⃣ Réseaux Sociaux 🌐

### Test :

1. **Cliquez sur "Réseaux Sociaux"**
2. **Ajouter un réseau** :
   - Nom : Instagram
   - Icône : 📷
   - URL : https://instagram.com/votre-compte
3. **Enregistrer**

### Vérification :

**API** : https://thegd33.calitek-junior.workers.dev/api/socials

---

## 6️⃣ Utilisateurs Admin 👥

### Test :

1. **Cliquez sur "Utilisateurs"**
2. **Voir la liste** des utilisateurs admin
3. **Essayer d'ajouter** un nouvel utilisateur :
   - Username : testuser
   - Password : test123
4. **Enregistrer**

### Vérification :

Vous devriez voir le nouvel utilisateur dans la liste.

**⚠️ Ne supprimez PAS le dernier admin** (vous ne pourriez plus vous connecter !)

---

## 7️⃣ Mode Maintenance 🔧

### Test :

1. **Cliquez sur "Maintenance"**
2. **Activez le mode maintenance**
3. **Modifiez le message** de maintenance
4. **Enregistrez**

### Vérification :

1. **Ouvrez votre site** : https://thegd-33-v3-two.vercel.app
2. **Vous devriez voir** la page de maintenance
3. **Le panel admin** reste accessible : https://thegd-33-v3-two.vercel.app/admin

**Pour désactiver** :
1. Retournez dans "Maintenance"
2. Décochez "Activer le mode maintenance"
3. Enregistrez

---

## 8️⃣ Commande / Order Settings 🛒

### Test :

1. **Cliquez sur "Commande"**
2. **Configurez** :
   - Lien de commande (ex: https://wa.me/votre-numero)
   - Texte du bouton (ex: "Commander maintenant")
3. **Enregistrez**

### Vérification :

Sur votre site public, le bouton de commande devrait apparaître.

---

## 9️⃣ Typographie ✍️

### Test :

1. **Cliquez sur "Typographie"**
2. **Choisissez des polices** pour :
   - Titres
   - Texte
3. **Enregistrez**

### Vérification :

Les polices changent sur votre site.

---

## 🔟 Dashboard 📊

### Vérification :

1. **Cliquez sur "Dashboard"**
2. **Vous devriez voir** :
   - Nombre de produits
   - Nombre de catégories
   - Autres statistiques

---

## 📋 CHECKLIST COMPLÈTE

| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Configuration (textes) | ✅ | Devrait marcher |
| Upload image de fond | ❌ | Nécessite bucket R2 |
| Produits (sans image) | ✅ | Devrait marcher |
| Produits (avec image) | ❌ | Nécessite bucket R2 |
| Catégories | ✅ | Devrait marcher |
| Farms | ✅ | Devrait marcher |
| Réseaux Sociaux | ✅ | Devrait marcher |
| Utilisateurs Admin | ✅ | Devrait marcher |
| Mode Maintenance | ✅ | Devrait marcher |
| Order Settings | ✅ | Devrait marcher |
| Typographie | ✅ | Devrait marcher |
| Dashboard | ✅ | Devrait marcher |

---

## 🚨 CE QUI NE MARCHE PAS SANS R2

**Upload d'images** :
- ❌ Image de fond du site
- ❌ Photos de produits
- ❌ Images de farms
- ❌ Images dans les sections

**Solution** : Créer le bucket R2 `boutiqueop` (voir `FIX-UPLOAD-R2.md`)

---

## ✅ CE QUI MARCHE DÉJÀ

**Tout le reste** :
- ✅ Gestion des textes
- ✅ Gestion des produits (sans images)
- ✅ Gestion des catégories
- ✅ Mode maintenance
- ✅ Utilisateurs admin
- ✅ Configuration générale

---

## 🎯 PRIORITÉS

### Court terme (sans R2) :

1. ✅ Ajouter vos produits (texte uniquement)
2. ✅ Créer vos catégories
3. ✅ Configurer les textes
4. ✅ Ajouter vos réseaux sociaux

### Moyen terme (avec R2) :

1. 📸 Créer le bucket R2
2. 📸 Ajouter les images des produits
3. 📸 Ajouter l'image de fond
4. 📸 Images des farms

---

## 🧪 ORDRE DE TEST RECOMMANDÉ

1. **Catégories** → Créez-en 2-3
2. **Produits** → Ajoutez un produit test
3. **Configuration** → Modifiez les textes
4. **Réseaux Sociaux** → Ajoutez vos liens
5. **Vérifier sur le site** : https://thegd-33-v3-two.vercel.app

Si tout ça marche, votre panel admin est **opérationnel à 90%** !

Les 10% restants = Upload d'images (nécessite R2).

---

**Testez maintenant et dites-moi ce qui marche et ce qui ne marche pas ! 🚀**
