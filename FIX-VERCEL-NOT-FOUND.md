# 🚨 FIX VERCEL - Erreur "Not Found"

## 🎯 Le Problème

Toutes vos erreurs disent : `"Not Found" is not valid JSON`

**Cause** : Vercel n'a **PAS** la variable d'environnement `VITE_API_URL` configurée.

L'application essaie d'appeler `/api/settings` en relatif au lieu de `https://thegd33.calitek-junior.workers.dev/api/settings`.

---

## ✅ SOLUTION (2 minutes)

### Étape 1 : Ajouter la Variable sur Vercel

1. **Allez sur** : https://vercel.com/dashboard

2. **Cliquez sur votre projet** (thegd-33-v3-two)

3. **Settings** (menu du haut)

4. **Environment Variables** (menu de gauche)

5. **Cliquez sur "Add New"** ou "Add Variable"

6. **Remplissez** :
   ```
   Name: VITE_API_URL
   Value: https://thegd33.calitek-junior.workers.dev
   ```

7. **IMPORTANT** : Cochez **TOUTES** les cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. **Cliquez sur "Save"**

---

### Étape 2 : Redéployer

1. **Allez dans "Deployments"** (onglet en haut)

2. **Trouvez le dernier déploiement**

3. **Cliquez sur les 3 points** ⋮ à droite

4. **"Redeploy"**

5. **DÉCOCHEZ** "Use existing Build Cache" ❌

6. **Cliquez sur "Redeploy"**

---

### Étape 3 : Attendre

**Attendez 2-3 minutes** que Vercel rebuild votre site.

---

### Étape 4 : Tester

1. **Videz le cache** de votre navigateur : **Ctrl + Shift + R**

2. **Allez sur** : https://thegd-33-v3-two.vercel.app/admin/login

3. **Connectez-vous** : admin / admin123

4. **Plus d'erreurs !** ✅

---

## 🔍 VÉRIFICATION

Une fois la variable ajoutée et le site redéployé :

### Dans la console du navigateur (F12) :

Vous NE devriez PLUS voir :
- ❌ "Not Found"
- ❌ Erreurs JSON

Vous DEVRIEZ voir :
- ✅ Vos données chargées
- ✅ Le panel admin fonctionnel

---

## 📊 CHECKLIST

- [ ] Vercel Dashboard ouvert
- [ ] Projet sélectionné
- [ ] Settings → Environment Variables
- [ ] Variable `VITE_API_URL` ajoutée
- [ ] Valeur : `https://thegd33.calitek-junior.workers.dev`
- [ ] TOUTES les environnements cochés
- [ ] Saved
- [ ] Deployments → Redeploy (sans cache)
- [ ] Attendu 2-3 minutes
- [ ] Cache navigateur vidé (Ctrl+Shift+R)
- [ ] Site testé

---

## ⚠️ IMPORTANT

**SANS cette variable**, Vercel ne sait PAS où trouver votre API Cloudflare !

C'est **CRITIQUE** pour que votre application fonctionne.

---

## 💡 ASTUCE

Pour vérifier que la variable est bien prise en compte :

1. **Après le redéploiement**, ouvrez votre site
2. **Console (F12)** → **Console**
3. **Tapez** :
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

**Vous devriez voir** :
```
https://thegd33.calitek-junior.workers.dev
```

**Si vous voyez** `undefined` → La variable n'est pas configurée.

---

**Faites ça MAINTENANT et dites-moi si ça marche ! 🚀**
