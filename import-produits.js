/**
 * Script d'Import des Produits vers gd33v3
 * Convertit et importe tous les produits de l'ancienne base
 */

// Données des produits (copiées depuis la requête SQL)
const produitsAnciens = [
  {id:1,name:"JELLY DONUTS 🍩",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_1_1756812561926.jpg",video_url:null,prices:{"1VAPE":60,"3VAPE":150,"10VAPE":450}},
  {id:2,name:"MOTOR BREATH ⛽️",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_2_1756812564563.jpg",video_url:null,prices:{"1VAPE":60,"3VAPE":150,"10VAPE":450}},
  {id:3,name:"COMA 💣",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_3_1756812567525.jpg",video_url:null,prices:{"1VAPE":60,"3VAPE":150,"10VAPE":450}},
  {id:4,name:"MAC 🍎",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_4_1756812570032.jpg",video_url:null,prices:{"1VAPE":60,"3VAPE":150,"10VAPE":450}},
  {id:15,name:"MOCHI LATTI 🫐🫐",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_15_1756812597330.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/a13b91dbaefe47209d99efd287851f31/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:16,name:"PURPLE JUICE 🥤",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_16_1756812599824.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/71ffb8c72f5b4527bec47d11f9be2c6d/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:17,name:"RUNTZ ⛽️",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_17_1756812602574.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/e391de14076c4c50b523d541477ce6b4/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:18,name:"STREET CREDIT 💸🥷",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_18_1756812607887.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/c71c8b33b1f843d1a4181a5ee4e56971/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:19,name:"RUNTZ X LUCKY SEVEN 🍒🍒",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_19_1756812610642.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/f2ee4b1d996c4d4ea7da2e9dfb97caf0/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:20,name:"BIG TICKET 🎟️",description:"WEED 🥬🍀 PARLAY ™️ BY L.A 🇺🇸 NEW PRIX 🏷️ ✨✨ 3.5G = 70€ 7G = 120€ 14G = 220€ 56G = 650€ 112G = 1200€ PROMO DE MALADE 🤪 ‼️",category_id:4,farm_id:5,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/image_20_1756812613272.jpg",video_url:"https://customer-kydq3j0ibf8o7lm7.cloudflarestream.com/64bc608b7093443da62259bd0aeeb919/iframe",prices:{"3,5g":70,"7g":120,"14g":220,"56g":650,"112g":1200}},
  {id:23,name:"MANGO H 🍫",description:"Stock limité ⏳",category_id:5,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327465422-kz27a56zbyo.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1757183889363-gd856qjzp5e.mp4",prices:{"10g":70,"25g":140,"50g":250,"100g":450}},
  {id:26,name:"K1 💥",description:"",category_id:5,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327447442-mfu1tdifyq.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1757184001895-14h5nwmhy4c.mp4",prices:{"10g":70,"25g":140,"50g":250,"100g":450}},
  {id:27,name:"STRAWANA 🍓",description:"",category_id:5,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327437284-w978b75fd6.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1757184151570-egt4nw4d85.mp4",prices:{"10g":70,"25g":140,"50g":250,"100g":450}},
  {id:28,name:"SKITLEZ 🍬",description:"",category_id:6,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327481858-4qzlrue4fea.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1757184203715-mmmjjeud1fc.mp4",prices:{"10g":90,"25g":180,"50g":300,"100g":550}},
  {id:29,name:"CALIPPO x FORBIDEN 🥝",description:"",category_id:6,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327505136-9onc7t0f2u9.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1757184338778-nwy4hevuyhm.mp4",prices:{"10g":90,"25g":180,"50g":300,"100g":550}},
  {id:30,name:"GARLIC COOKIES 🍪 🧄",description:"LA FOLIE 🤪 ‼️",category_id:7,farm_id:7,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758528791570-tda4qq7m6p.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758528906065-65mo2mhu5ta.mp4",prices:{"5g":70,"10g":120,"25g":220,"50g":420,"100g":800}},
  {id:31,name:"PAPAYA FROSTING 🥭",description:"LA FOLIE 🤪 ‼️",category_id:7,farm_id:7,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758529009129-dis82f68p3d.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758529056393-rtpjvljk0m.mp4",prices:{"5g":70,"10g":120,"25g":220,"50g":420,"100g":800}},
  {id:32,name:"BLUE GELATO 🍧🍦",description:"LA FOLIE 🤪 ‼️",category_id:7,farm_id:7,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758529141548-0eyjywqve8ee.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1758529154875-6g15r25w5i.mp4",prices:{"5g":70,"10g":120,"25g":220,"50g":420,"100g":800}},
  {id:33,name:"PEACH LIMEZ 🍑🍋",description:"",category_id:8,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327613613-xagph74cxht.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760039153492-ztjw4vh3v3b.mp4",prices:{"10g":130,"25g":260,"50g":450,"100g":800}},
  {id:34,name:"STOOPID FRUITS 🍉🍌🫐",description:"",category_id:8,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327644724-1vtbt2ttjev.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760039177333-7c00elmb8dl.mp4",prices:{"10g":130,"25g":260,"50g":450,"100g":800}},
  {id:35,name:"ZMO PAPAY 🧅🥭",description:"",category_id:8,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759327700386-rawb0mq60i.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760039193768-2gr7iae4rac.mp4",prices:{"10g":130,"25g":260,"50g":450,"100g":800}},
  {id:36,name:"- CHERRY PIE x TANGIE 🍒🍊",description:"MIEUX QUE VOS CALI HASH TOUT NAZE ‼️",category_id:9,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760033187572-i8hv7515d8q.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760033193414-cveefqnxjcp.mp4",prices:{"5g":100,"10g":180,"25g":350,"50g":600,"100g":1100}},
  {id:37,name:"- FF x WZ 🍉🍋‍🟩🥑🍈 (forbidenfruitXwatermelonzkitelz)",description:"MIEUX QUE VOS CALI HASH TOUT NAZE ‼️",category_id:9,farm_id:6,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760033261909-has36hmnxve.jpeg",video_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760033267084-1kih75iv7s7.mp4",prices:{"5g":100,"10g":180,"25g":350,"50g":600,"100g":1100}},
  {id:41,name:"BANANA SORBET 🍌 🍦",description:"🎯 Pur à 91%THC | ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe • 💰",category_id:2,farm_id:8,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391350305-kla0w6mgt7.jpeg",video_url:null,prices:{"1 VAPE":60,"3 VAPES":150,"10 VAPES":450}},
  {id:42,name:"LÉGEND OG",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe • 💰",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391446291-ci2yougmeye.jpeg",video_url:null,prices:{"1 VAPES":60,"3 VAPES":150,"10 VAPES":450}},
  {id:43,name:"VANILLA VELVET",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391750912-fphbcgz8zt.jpeg",video_url:null,prices:{"1 VAPES":60,"3 VAPES":150,"10 VAPES":450}},
  {id:44,name:"STVDI ⛽️",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391710244-jviofencazi.jpeg",video_url:null,prices:{"1 VAPES":60,"3 VAPES":150,"10 VAPES":450}},
  {id:45,name:"CHOCOOKIES CHIPS 🍪",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391786654-cyid25u6iyl.jpeg",video_url:null,prices:{"1 VAPES":60,"3 VAPES":150,"10 VAPES":450}},
  {id:46,name:"HITROFUMEZ 🔥",description:"🎯 Pur à 91%THC | Delta-9 THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:2,farm_id:1,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760391835401-tl4baiyo5i9.jpeg",video_url:null,prices:{"1 VAPE":60,"3 VAPES":150,"10 VAPES":450}},
  {id:47,name:"Sour Apple Killer 🍏",description:"🎯 Pur à 91%THC | THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:10,farm_id:3,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760392111035-kbpzltvpka.jpeg",video_url:null,prices:{"1 SERINGUE 💉":60,"3 SERINGUE 💉":150,"10 SERINGUES 💉":450}},
  {id:48,name:"BLUE BERRY COOKIE 🍪",description:"🎯 Pur à 91%THC | THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:10,farm_id:3,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760392173062-2eh3tgnrqu5.jpeg",video_url:null,prices:{"1 SERINGUES 💉":60,"3 SERINGUES 💉":150,"10 SERINGUES 💉":450}},
  {id:49,name:"TANGERINE DREAM",description:"🎯 Pur à 91%THC | THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:10,farm_id:3,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760392257158-y6x3k538jzg.jpeg",video_url:null,prices:{"1 SERINGUE 💉":60,"3 SERINGUES 💉":150,"10 SERINGUES 💉":450}},
  {id:50,name:"PEACH RING 🍑",description:"🎯 Pur à 91%THC | THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:10,farm_id:3,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760392323639-6g4svmf68hi.jpeg",video_url:null,prices:{"1 SERINGUE 💉":60,"3 SERINGUES 💉":150,"10 SERINGUES 💉":450}},
  {id:51,name:"ABRICOT JELLY 🍏",description:"🎯 Pur à 91%THC | THC ⚡ Effet ultra rapide & intense 💎 Qualité distillat premium • Sans coupe •",category_id:10,farm_id:3,image_url:"https://pub-b38679a01a274648827751df94818418.r2.dev/images/1760392391555-9z2epxbooij.jpeg",video_url:null,prices:{"1 SERINGUE 💉":60,"3 SERINGUES 💉":150,"10 SERINGUES 💉":450}}
];

const API_URL = 'https://thegd33.calitek-junior.workers.dev';

console.log(`🔄 Import de ${produitsAnciens.length} produits vers gd33v3\n`);

// Fonction pour convertir un produit ancien format vers nouveau format
function convertirProduit(ancien) {
  // Convertir prices en variants
  const variants = [];
  if (ancien.prices && typeof ancien.prices === 'object') {
    for (const [nom, prix] of Object.entries(ancien.prices)) {
      variants.push({
        name: nom,
        price: prix.toString()
      });
    }
  }
  
  return {
    id: ancien.id.toString(),
    name: ancien.name,
    description: ancien.description || '',
    category: ancien.category_id ? ancien.category_id.toString() : '',
    farm: ancien.farm_id ? ancien.farm_id.toString() : '',
    photo: ancien.image_url || '',
    video: ancien.video_url || '',
    medias: [],
    variants: variants,
    price: variants.length > 0 ? variants[0].price : '0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Import asynchrone
async function importerProduits() {
  let succes = 0;
  let erreurs = 0;
  
  for (const ancien of produitsAnciens) {
    const nouveau = convertirProduit(ancien);
    
    console.log(`📦 Import: ${nouveau.name}`);
    
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nouveau)
      });
      
      if (response.ok) {
        console.log(`✅ ${nouveau.name} - OK`);
        succes++;
      } else {
        const error = await response.text();
        console.log(`❌ ${nouveau.name} - Erreur: ${error}`);
        erreurs++;
      }
      
      // Pause de 100ms entre chaque requête
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ ${nouveau.name} - Erreur: ${error.message}`);
      erreurs++;
    }
  }
  
  console.log(`\n📊 Résultat:`);
  console.log(`✅ Succès: ${succes}`);
  console.log(`❌ Erreurs: ${erreurs}`);
  console.log(`\n🎉 Import terminé !`);
}

// Lancer l'import
importerProduits();
