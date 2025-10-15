# 🔴 DEBUG - Erreurs Vercel Persistantes

## 🎯 Le Problème

Votre site Vercel reçoit toujours du HTML au lieu de JSON.

**2 causes possibles** :

1. **Cloudflare Access s'est réactivé** 🔒
2. **Vercel utilise l'ancien build** avec la mauvaise configuration

---

## ✅ SOLUTION IMMÉDIATE

### Étape 1 : RE-tester l'API

Ouvrez dans votre navigateur (sur votre PC, pas sur Vercel) :

```
https://thegd33.calitek-junior.workers.dev/api/settings
```

**Question importante** : Que voyez-vous ?

**A)** Du JSON comme avant → L'API fonctionne ✅  
**B)** Une page de connexion Cloudflare → Cloudflare Access s'est réactivé ❌  
**C)** Une page d'erreur → Autre problème

---

## 🔧 Si vous voyez du JSON (option A)

Le problème vient de **Vercel qui a besoin d'être redéployé**.

### Solution : Forcer le Redéploiement sur Vercel

1. **Allez sur https://vercel.com/dashboard**

2. **Trouvez votre projet** (THEGD33V3 ou similaire)

3. **Cliquez sur le projet**

4. **Allez dans l'onglet "Deployments"**

5. **Trouvez le DERNIER déploiement** (en haut de la liste)

6. **Cliquez sur les 3 points ⋮** à droite

7. **Cliquez sur "Redeploy"**

8. **Cochez "Use existing Build Cache"** → **DÉCOCHEZ** ❌

9. **Cliquez sur "Redeploy"**

Cela forcera un nouveau build complet.

---

## 🔒 Si vous voyez une page de login (option B)

Cloudflare Access s'est réactivé. Il faut le **redésactiver** :

1. https://dash.cloudflare.com
2. Zero Trust → Access → Applications
3. Trouvez et désactivez la protection pour `thegd33.calitek-junior.workers.dev`

---

## 🆘 AUTRE SOLUTION : Vérifier les Variables d'Environnement

Sur Vercel Dashboard :

1. **Projet** → **Settings** → **Environment Variables**

2. **Vérifiez qu'il y a** :
   ```
   Name: VITE_API_URL
   Value: https://thegd33.calitek-junior.workers.dev
   ```

3. **Si elle n'existe pas, AJOUTEZ-LA** :
   - Name : `VITE_API_URL`
   - Value : `https://thegd33.calitek-junior.workers.dev`
   - Environments : **Production, Preview, Development** (tous cochés)

4. **Cliquez sur "Save"**

5. **Allez dans "Deployments"**

6. **Redéployez** le dernier déploiement (sans cache)

---

## 🧪 TEST DE DEBUG

Pour savoir exactement quelle URL Vercel utilise :

1. **Sur votre site Vercel**, ouvrez la **console** (F12)

2. **Allez dans l'onglet "Console"**

3. **Tapez** :
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

4. **Appuyez sur Entrée**

**Que voyez-vous ?**
- Si `undefined` → Variable d'environnement manquante
- Si une URL → Vérifiez que c'est la bonne

---

## 📋 CHECKLIST COMPLÈTE

1. [ ] Tester l'API directement : https://thegd33.calitek-junior.workers.dev/api/settings
2. [ ] L'API renvoie du JSON (pas une page de login)
3. [ ] Vérifier les variables d'environnement sur Vercel
4. [ ] Ajouter `VITE_API_URL` si manquante
5. [ ] Redéployer sur Vercel SANS cache
6. [ ] Attendre 1-2 minutes
7. [ ] Vider le cache du navigateur (Ctrl+Shift+R)
8. [ ] Tester à nouveau

---

## 🎯 ACTIONS IMMÉDIATES

**1. Testez d'abord l'API** :
```
https://thegd33.calitek-junior.workers.dev/api/settings
```

**Dites-moi ce que vous voyez !**

**2. Puis allez sur Vercel** et redéployez sans cache.

---

## 💡 ASTUCE

Si rien ne marche, vous pouvez **temporairement** pointer vers une API locale pour tester :

1. Sur Vercel → Settings → Environment Variables
2. Changez `VITE_API_URL` vers votre worker en local
3. Mais ça ne marchera que quand votre PC est allumé avec le worker qui tourne

---

**Commencez par tester l'API et dites-moi ce que vous voyez !** 🔍
