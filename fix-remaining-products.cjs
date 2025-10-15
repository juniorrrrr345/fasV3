const { execSync } = require('child_process');

const products = [
  { id: 204, name: 'yuzu caviar 🍋🇯🇵', description: 'Hash Rosin 2g ( +1000 taff ) 90% THC penser à la charger +MP 25-50-100 dispo Direct Order', category_id: 66, farm_id: 41, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554056886-0qz8vi3cadk.jpeg', video_url: '', prices: '{"1 Vape":110,"2 Vapes":210,"3 Vapes":300,"5 Vapes":450}' },
  { id: 205, name: 'Marker Z 🥊', description: 'Hash Rosin 2g ( +1000 taff ) 90% THC penser à la charger +MP 25-50-100 dispo Direct Order', category_id: 66, farm_id: 41, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554127718-ywlky3imxo.jpeg', video_url: '', prices: '{"1 Vape":110,"2 Vapes":210,"3 Vapes":300,"5 Vapes":450}' },
  { id: 206, name: 'red Papaya 🔴🥭', description: 'Hash Rosin 2g ( +1000 taff ) 90% THC penser à la charger +MP 25-50-100 dispo Direct Order', category_id: 66, farm_id: 41, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554233043-f8i6ivrrz0q.jpeg', video_url: '', prices: '{"1 Vape":110,"2 Vapes":210,"3 Vapes":300,"5 Vapes":450}' },
  { id: 207, name: 'permanent Marker 🧠', description: '', category_id: 67, farm_id: 42, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554349080-s8cbmwydufd.jpeg', video_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554362610-mrj3a80sekb.mp4', prices: '{"3,5g":50,"10g":140,"28g":340,"56g":620,"100g":950,"448g ( Hors IDF )":3000,"448g ( Paris )":3500}' },
  { id: 208, name: 'Candy Runtz 🌈', description: '', category_id: 67, farm_id: 42, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554452638-3c0ciqh30ft.jpeg', video_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554456438-zurzf7q0nqo.mp4', prices: '{"3,5g":50,"10g":140,"28g":340,"56g":620,"100g":950,"448g ( Hors IDF )":3000,"448g ( IDF )":3500}' },
  { id: 209, name: 'lemon cherry Gelato 🍋🍒🍨', description: '', category_id: 67, farm_id: 42, image_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554604133-0k4mhlhlzdj7.jpeg', video_url: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759554608000-zcvwj7zagb.mp4', prices: '{"3,5g":50,"10g":140,"28g":340,"56g":620,"100g":950,"448g ( Hors IDF )":3000,"448g ( IDF )":3500}' }
];

products.forEach(p => {
  const name = p.name.replace(/'/g, "''");
  const desc = p.description.replace(/'/g, "''");
  const variants = p.prices.replace(/'/g, "''");
  
  const sql = `INSERT OR REPLACE INTO products (id, name, description, category, farm, photo, video, medias, variants, price, createdAt, updatedAt) VALUES ('${p.id}', '${name}', '${desc}', '${p.category_id}', '${p.farm_id}', '${p.image_url}', '${p.video_url}', '[]', '${variants}', '0', datetime('now'), datetime('now'));`;
  
  execSync(`wrangler d1 execute calitekv3-db --command="${sql}" --remote`, { stdio: 'inherit' });
  console.log(`✅ ${p.id} - ${p.name}`);
});