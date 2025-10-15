# 🔧 FIX Upload R2 - Erreur Image de Fond

## 🎯 Le Problème

L'upload d'images échoue avec : "Erreur lors de l'upload de l'image de fond"

**Cause probable** : Le bucket R2 `boutiqueop` n'existe pas ou n'est pas configuré correctement.

---

## ✅ SOLUTION : Créer et Configurer le Bucket R2

### Étape 1 : Créer le Bucket R2

**Via Cloudflare Dashboard** :

1. **https://dash.cloudflare.com**

2. **Menu gauche** → **R2**

3. **Cliquez sur "Create bucket"**

4. **Nom du bucket** : `boutiqueop`

5. **Location** : Automatic (ou choisissez une région proche)

6. **Cliquez sur "Create bucket"**

---

### Étape 2 : Rendre le Bucket Public

1. **Cliquez sur le bucket** `boutiqueop` que vous venez de créer

2. **Onglet "Settings"**

3. **Section "Public access"** → **Cliquez sur "Allow Access"**

4. **Ou configurez un domaine R2.dev** :
   - **Cliquez sur "Connect Domain"**
   - **Choisissez** "R2.dev subdomain"
   - **Nom** : `boutiqueop` (ou autre nom unique)
   - **Cliquez sur "Create"**

5. **Notez l'URL** qui apparaît (ex: `https://boutiqueop.r2.dev` ou `https://pub-xxxxx.r2.dev`)

---

### Étape 3 : Mettre à Jour l'URL dans le Worker

**Ouvrez** `worker/index.js` et trouvez la ligne 721 :

```javascript
const url = `https://pub-53af7ff6cf154e87af25e68525a4bf74.r2.dev/${filename}`
```

**Remplacez** par l'URL de VOTRE bucket R2 :

```javascript
const url = `https://VOTRE-URL-R2.r2.dev/${filename}`
```

**Aussi dans** `src/utils/cloudflare.js` ligne 33 :

```javascript
return `https://VOTRE-URL-R2.r2.dev/${filename}`
```

---

### Étape 4 : Redéployer

```powershell
cd C:\Users\PC\Documents\THEGD33V3

# Sauvegarder les modifications
git add worker/index.js src/utils/cloudflare.js
git commit -m "Update R2 bucket URL"
git push

# Redéployer le worker
npx wrangler deploy
```

---

## 🧪 ALTERNATIVE : Créer via Wrangler

Si vous préférez la ligne de commande :

```powershell
# Se connecter
npx wrangler login

# Créer le bucket
npx wrangler r2 bucket create boutiqueop

# Lister les buckets pour vérifier
npx wrangler r2 bucket list

# Déployer
npx wrangler deploy
```

---

## 🔍 VÉRIFIER QUE ÇA MARCHE

### Test 1 : Via le Panel Admin

1. **Allez dans Configuration**
2. **Essayez d'uploader une image** (une petite image de test)
3. **Si ça marche** → Vous verrez "Image de fond uploadée avec succès !" ✅

### Test 2 : Via l'API Directement

**Dans votre navigateur, console (F12)** :

```javascript
// Créer un fichier de test
const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })

// Créer le FormData
const formData = new FormData()
formData.append('file', testFile)

// Upload
fetch('https://thegd33.calitek-junior.workers.dev/api/upload', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(console.log)
```

**Vous devriez voir** :
```json
{
  "url": "https://xxx.r2.dev/1234567890-test.txt",
  "filename": "1234567890-test.txt"
}
```

---

## ⚠️ PROBLÈMES COURANTS

### Erreur : "Bucket not found"

→ Le bucket `boutiqueop` n'existe pas. Créez-le via le Dashboard ou Wrangler.

### Erreur : "Access Denied"

→ Le bucket existe mais le worker n'a pas les permissions. Vérifiez :
1. **wrangler.toml** contient bien le binding R2
2. Le worker est déployé avec la bonne configuration
3. Redéployez : `npx wrangler deploy`

### L'upload fonctionne mais l'image ne s'affiche pas

→ Le bucket n'est pas public ou l'URL est incorrecte :
1. Rendez le bucket public (étape 2)
2. Vérifiez l'URL dans le code (étape 3)

---

## 📊 CHECKLIST

- [ ] Bucket R2 `boutiqueop` créé sur Cloudflare
- [ ] Bucket rendu public ou domaine R2.dev configuré
- [ ] URL R2 notée
- [ ] URL mise à jour dans `worker/index.js` ligne 721
- [ ] URL mise à jour dans `src/utils/cloudflare.js` ligne 33
- [ ] Modifications commitées
- [ ] Worker redéployé avec `npx wrangler deploy`
- [ ] Frontend redéployé sur Vercel (git push)
- [ ] Testé l'upload d'une image

---

## 🎯 VÉRIFICATION RAPIDE

**Pour vérifier si le bucket existe** :

1. **Cloudflare Dashboard** → **R2**
2. **Vous devriez voir** `boutiqueop` dans la liste
3. **Si pas là** → Créez-le

---

## 💡 ASTUCE

Si vous voulez tester rapidement sans créer de bucket :

**Utilisez un service temporaire** comme :
- Upload.io
- Cloudinary
- Ou stockez les images localement (non recommandé pour production)

Mais **pour la production**, créez le bucket R2 correctement.

---

**Commencez par vérifier si le bucket `boutiqueop` existe dans votre Dashboard Cloudflare ! 🚀**
