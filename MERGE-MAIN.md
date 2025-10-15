# 🔀 Merger sur Main

## 📋 Commandes pour Merger

Sur votre PC, dans PowerShell :

```powershell
cd C:\Users\PC\Documents\THEGD33V3

# 1. Vérifier que tout est sauvegardé
git status

# 2. Si vous avez des modifications non commitées, les ajouter
git add .
git commit -m "Final changes before merge"

# 3. Aller sur la branche main
git checkout main

# 4. Mettre à jour main depuis GitHub
git pull origin main

# 5. Merger la branche cursor
git merge cursor/debug-admin-panel-json-errors-9e80

# 6. Si tout est OK, pousser sur GitHub
git push origin main

# 7. Optionnel : Supprimer la branche locale
git branch -d cursor/debug-admin-panel-json-errors-9e80

# 8. Optionnel : Supprimer la branche sur GitHub
git push origin --delete cursor/debug-admin-panel-json-errors-9e80
```

---

## ⚠️ Si Conflits

Si vous voyez des **conflits** pendant le merge :

1. Git vous montrera les fichiers en conflit
2. Ouvrez-les dans un éditeur de code
3. Cherchez les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`
4. Résolvez les conflits manuellement
5. Puis :
   ```powershell
   git add .
   git commit -m "Resolve merge conflicts"
   git push origin main
   ```

---

## ✅ Vérification après Merge

Une fois mergé sur `main`, Vercel redéploiera automatiquement si configuré pour `main`.

Si Vercel est configuré pour une autre branche :
1. **Vercel Dashboard** → **Settings** → **Git**
2. Vérifiez que **Production Branch** = `main`

---

## 🎯 Résumé Court

```powershell
cd C:\Users\PC\Documents\THEGD33V3
git checkout main
git pull origin main
git merge cursor/debug-admin-panel-json-errors-9e80
git push origin main
```

C'est tout ! ✅
