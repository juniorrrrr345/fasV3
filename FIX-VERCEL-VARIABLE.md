# 🔧 FIX VERCEL - Variable d'Environnement Manquante

## 🎯 Le Problème

L'API Cloudflare fonctionne ✅  
Mais Vercel ne sait pas quelle URL utiliser ❌

---

## ✅ SOLUTION : Ajouter la Variable d'Environnement

### 1. Allez sur Vercel Dashboard

**https://vercel.com/dashboard**

### 2. Sélectionnez Votre Projet

Cliquez sur votre projet (thegd-33-v3-two ou similaire)

### 3. Allez dans Settings

**Settings** (dans le menu du haut)

### 4. Environment Variables

Dans le menu de gauche : **Environment Variables**

### 5. Ajoutez la Variable

Cliquez sur **"Add New"** ou **"Add Variable"**

**Remplissez** :
- **Name (Key)** : `VITE_API_URL`
- **Value** : `https://thegd33.calitek-junior.workers.dev`
- **Environments** : Cochez **TOUS** (Production, Preview, Development)

### 6. Save

Cliquez sur **"Save"**

### 7. Redéployez

**IMPORTANT** : Retournez dans **"Deployments"**

- Trouvez le **dernier déploiement**
- Cliquez sur les **3 points** ⋮
- **"Redeploy"**
- **DÉCOCHEZ** "Use existing Build Cache" ❌
- **Cliquez sur "Redeploy"**

---

## ⏰ Attendez 2-3 minutes

Vercel va reconstruire avec la variable d'environnement.

---

## 🧪 TEST

Une fois le déploiement terminé :

1. **Videz le cache du navigateur** : Ctrl+Shift+R

2. **Allez sur** :
   ```
   https://thegd-33-v3-two.vercel.app/admin/login
   ```

3. **Ouvrez la console** (F12) → Console

4. **Tapez** :
   ```javascript
   console.log(window.location.origin)
   ```

5. **Connectez-vous** : admin / admin123

---

## 🎯 Si ça ne marche TOUJOURS pas

Il y a peut-être un problème avec le build de Vercel.

### Alternative : Forcer un Rebuild Complet

1. **Settings** → **General**

2. Tout en bas : **"Delete Project"** → **NON, ne faites pas ça !**

3. Au lieu de ça, dans **"Deployments"** :
   - Supprimez les 2-3 derniers déploiements
   - Puis faites un nouveau commit :

```powershell
cd C:\Users\PC\Documents\THEGD33V3
git commit --allow-empty -m "Force rebuild"
git push
```

Cela forcera un nouveau déploiement complet.

---

## 📊 Checklist

- [ ] Variable `VITE_API_URL` ajoutée sur Vercel
- [ ] Valeur : `https://thegd33.calitek-junior.workers.dev`
- [ ] Tous les environnements cochés
- [ ] Redéployé SANS cache
- [ ] Attendu 2-3 minutes
- [ ] Vidé le cache du navigateur (Ctrl+Shift+R)
- [ ] Testé le site

---

## 🆘 DEBUG

Si après tout ça, ça ne marche toujours pas :

1. **Sur votre site Vercel**, ouvrez la console (F12)

2. **Tapez** :
   ```javascript
   fetch('https://thegd33.calitek-junior.workers.dev/api/settings')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Si vous voyez du JSON** → L'API fonctionne, c'est un problème de build

4. **Si vous voyez une erreur** → Dites-moi quelle erreur

---

**Commencez par ajouter la variable d'environnement sur Vercel ! 🚀**
