import fs from 'fs';

const oddlePhotoMapping = {
  "ks-20261015-001": {
    "action": "REPLACED",
    "name": "Yam Ring",
    "category": "Additional Dishes",
    "oddle_listing": "Yam Ring | 芋头圈",
    "oddle_photo": "/menu-photos/yam-ring--43e8e1d854.jpg",
    "oddle_source_url": "https://ucarecdn.com/ae5e3756-b4d0-4285-b1ab-1fab276a383d/"
  },
  "ks-20261015-002": {
    "action": "REPLACED",
    "name": "Kai Lan with Beef",
    "category": "Beef",
    "oddle_listing": "Kai Lan Stir Fried with Beef | 芥兰炒牛肉",
    "oddle_photo": "/menu-photos/kai-lan-stir-fried-with-beef--36417aa787.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/KaiLanStirFriedwithBeefc23c11.jpg"
  },
  "ks-20261015-003": {
    "action": "REPLACED",
    "name": "Spring Onion with Beef",
    "category": "Beef",
    "oddle_listing": "Stir Fried Beef with Spring Onion | 姜葱炒牛肉",
    "oddle_photo": "/menu-photos/stir-fried-beef-with-spring-onion--2204173013.png",
    "oddle_source_url": "https://ucarecdn.com/9844d195-87a8-4b53-ae4f-d86ec1aee2d1/"
  },
  "ks-20261015-004": {
    "action": "RETAINED",
    "name": "Black Bean with Beef",
    "category": "Beef",
    "reason": "Oddle listing (Black Bean Stir Fried with Beef) has no photo attached on Oddle."
  },
  "ks-20261015-005": {
    "action": "REPLACED",
    "name": "Black Pepper Beef",
    "category": "Beef",
    "oddle_listing": "Black Pepper Beef | 黑椒炒牛肉",
    "oddle_photo": "/menu-photos/black-pepper-beef--8abc775977.png",
    "oddle_source_url": "https://ucarecdn.com/b91c1ce7-1c3a-439c-ab7b-25d69ccad47e/"
  },
  "ks-20261015-006": {
    "action": "REPLACED",
    "name": "Kung Bao Chicken",
    "category": "Chicken",
    "oddle_listing": "Kung Bao Chicken | 宫保鸡丁",
    "oddle_photo": "/menu-photos/kung-bao-chicken--900d3d611a.png",
    "oddle_source_url": "https://ucarecdn.com/06a0300d-e8d2-4ef2-b2df-54b7ac11f808/"
  },
  "ks-20261015-007": {
    "action": "RETAINED",
    "name": "Cereal Chicken",
    "category": "Chicken",
    "reason": "Oddle listing (Cereal Chicken | 麦片鸡丁) has no photo attached on Oddle."
  },
  "ks-20261015-008": {
    "action": "REPLACED",
    "name": "Claypot Chicken",
    "category": "Chicken",
    "oddle_listing": "Claypot Thai Style Chicken | 甘香鸡",
    "oddle_photo": "/menu-photos/claypot-thai-style-chicken--c57d9e675d.png",
    "oddle_source_url": "https://ucarecdn.com/6dbef44e-a954-4170-a8fc-075ad66788e0/"
  },
  "ks-20261015-009": {
    "action": "REPLACED",
    "name": "Roasted Chicken",
    "category": "Chicken",
    "oddle_listing": "Crispy Roasted Chicken | 脆皮烧鸡",
    "oddle_photo": "/menu-photos/crispy-roasted-chicken--40298160a5.png",
    "oddle_source_url": "https://ucarecdn.com/ec34a6ae-f141-4566-ae4f-5fc0c2aa2d54/"
  },
  "ks-20261015-010": {
    "action": "REPLACED",
    "name": "Prawn Paste Chicken",
    "category": "Chicken",
    "oddle_listing": "Prawn Paste Chicken | 虾酱鸡",
    "oddle_photo": "/menu-photos/prawn-paste-chicken--b58388235a.jpg",
    "oddle_source_url": "https://ucarecdn.com/d5709a32-eb33-4e52-8579-0f611d0dd94a/"
  },
  "ks-20261015-011": {
    "action": "RETAINED",
    "name": "Black Pepper Crab",
    "category": "Crab",
    "reason": "No crab category or dishes exist on Oddle menu."
  },
  "ks-20261015-012": {
    "action": "RETAINED",
    "name": "Chilli Crab",
    "category": "Crab",
    "reason": "No crab category or dishes exist on Oddle menu."
  },
  "ks-20261015-013": {
    "action": "RETAINED",
    "name": "Salted Egg Crab",
    "category": "Crab",
    "reason": "No crab category or dishes exist on Oddle menu."
  },
  "ks-20261015-014": {
    "action": "RETAINED",
    "name": "Sambal Crab",
    "category": "Crab",
    "reason": "No crab category or dishes exist on Oddle menu."
  },
  "ks-20261015-015": {
    "action": "RETAINED",
    "name": "Spring Onion Crab",
    "category": "Crab",
    "reason": "No crab category or dishes exist on Oddle menu."
  },
  "ks-20261015-016": {
    "action": "REPLACED",
    "name": "Fu Rong Omelette",
    "category": "Eggs",
    "oddle_listing": "Fu Rong Omelette | 芙蓉煎蛋",
    "oddle_photo": "/menu-photos/fu-rong-omelette--64ffa91df7.png",
    "oddle_source_url": "https://ucarecdn.com/b1b4fd30-06e7-42c4-b3ee-8213479357fc/"
  },
  "ks-20261015-017": {
    "action": "REPLACED",
    "name": "Minced Pork Steamed Egg",
    "category": "Eggs",
    "oddle_listing": "Minced Pork Steam Eggs | 蒸肉碎蛋",
    "oddle_photo": "/menu-photos/minced-pork-steam-eggs--0ec3cbf2a8.png",
    "oddle_source_url": "https://ucarecdn.com/ba7cd454-0ef0-4a7d-8728-7fcc07d50594/"
  },
  "ks-20261015-018": {
    "action": "REPLACED",
    "name": "Minced Pork Omelette",
    "category": "Eggs",
    "oddle_listing": "Minced Pork Omelette | 肉碎煎蛋",
    "oddle_photo": "/menu-photos/minced-pork-omelette--b36d634ab2.png",
    "oddle_source_url": "https://ucarecdn.com/111addfa-fcea-4a32-a89b-2955b930f428/"
  },
  "ks-20261015-019": {
    "action": "REPLACED",
    "name": "Prawn Omelette",
    "category": "Eggs",
    "oddle_listing": "Prawns Omelette | 虾仁煎蛋",
    "oddle_photo": "/menu-photos/prawns-omelette--5c6211322a.png",
    "oddle_source_url": "https://ucarecdn.com/b5a57347-e1a9-422d-ad6e-fad331cb2c23/"
  },
  "ks-20261015-020": {
    "action": "REPLACED",
    "name": "Radish Omelette",
    "category": "Eggs",
    "oddle_listing": "Preserved Radish Omelette | 菜脯蛋",
    "oddle_photo": "/menu-photos/preserved-radish-omelette--9c8ac012b6.png",
    "oddle_source_url": "https://ucarecdn.com/98e382f8-97b1-4751-b480-56c7be093569/"
  },
  "ks-20261015-021": {
    "action": "REPLACED",
    "name": "Steamed Trio Egg",
    "category": "Eggs",
    "oddle_listing": "Combination Of 3 Steam Eggs | 三王蒸蛋",
    "oddle_photo": "/menu-photos/combination-of-3-steam-eggs--67add39365.png",
    "oddle_source_url": "https://ucarecdn.com/bad55b76-1fdb-462f-8ef0-2f20160a3726/"
  },
  "ks-20261015-022": {
    "action": "REPLACED",
    "name": "Deep Fried \"Yu Gai\" Fish",
    "category": "Fish",
    "oddle_listing": "Deep Fried \"Yu Gai\"| 香脆炸鱼鸡",
    "oddle_photo": "/menu-photos/deep-fried-yu-gai--8d422cab26.png",
    "oddle_source_url": "https://ucarecdn.com/54c74a9a-d35f-4688-b4c8-de5780c0d485/"
  },
  "ks-20261015-023": {
    "action": "REPLACED",
    "name": "Hong Kong Style Steamed Fish Tail",
    "category": "Fish",
    "oddle_listing": "HK Style Steam Fish Tail | 港 / 潮式蒸鱼尾",
    "oddle_photo": "/menu-photos/hk-style-steam-fish-tail--432dec6afd.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/HKStyleSteamFishTail0e7b94.jpg"
  },
  "ks-20261015-024": {
    "action": "REPLACED",
    "name": "Black Bean Fish Meat",
    "category": "Fish",
    "oddle_listing": "Black Bean Sauce with Fish Meat | 豉汁炒鱼鸡",
    "oddle_photo": "/menu-photos/black-bean-sauce-with-fish-meat--7d44f24f34.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/BlackBeanSaucewithFishMeat7cc4df.jpg"
  },
  "ks-20261015-025": {
    "action": "RETAINED",
    "name": "Claypot Fish Meat",
    "category": "Fish",
    "reason": "Not offered on Oddle menu (Oddle only offers Black Bean / Curry Fish Head/Tail and deep-fried fish meat)."
  },
  "ks-20261015-026": {
    "action": "REPLACED",
    "name": "Curry Fish Head",
    "category": "Fish",
    "oddle_listing": "Curry Fish Head | 咖喱鱼头",
    "oddle_photo": "/menu-photos/curry-fish-head--1c7c3a966b.png",
    "oddle_source_url": "https://ucarecdn.com/a4a4600e-b87b-4709-b83c-865dbf5e1bed/"
  },
  "ks-20261015-027": {
    "action": "REPLACED",
    "name": "Deep Fried Fish Meat",
    "category": "Fish",
    "oddle_listing": "Deep Fried Fish Meat with Light Sauce | 炸鱼肉",
    "oddle_photo": "/menu-photos/deep-fried-fish-meat-with-light-sauce--728290fa73.png",
    "oddle_source_url": "https://ucarecdn.com/4e40c3e4-6700-4b68-820f-8b1be25c590f/"
  },
  "ks-20261015-028": {
    "action": "RETAINED",
    "name": "Hong Kong Style Steamed Grouper",
    "category": "Fish",
    "reason": "Oddle listing is HK Style Steam Fish Head / Tail, no separate whole grouper dish."
  },
  "ks-20261015-029": {
    "action": "REPLACED",
    "name": "Sambal Fish Meat",
    "category": "Fish",
    "oddle_listing": "Stir Fried Fish Meat with Sambal Kaffir Leaves | 甘香炒鱼肉",
    "oddle_photo": "/menu-photos/stir-fried-fish-meat-with-sambal-kaffir-leaves--1954caa223.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/StirFriedFishMeatwithSambalKaffirLeaves465189.jpg"
  },
  "ks-20261015-030": {
    "action": "RETAINED",
    "name": "Sweet and Sour Grouper",
    "category": "Fish",
    "reason": "Oddle listing is Sweet & Sour Sliced Fish; client dish specifies whole Grouper."
  },
  "ks-20261015-031": {
    "action": "REPLACED",
    "name": "Spring Onion Frogs",
    "category": "Frogs",
    "oddle_listing": "Stir Fried Frogs With Spring Onion | 姜葱炒田鸡",
    "oddle_photo": "/menu-photos/stir-fried-frogs-with-spring-onion--09bc4d4e07.png",
    "oddle_source_url": "https://ucarecdn.com/bb34232e-8b9c-49c3-9972-bb00e0ca8d67/"
  },
  "ks-20261015-032": {
    "action": "RETAINED",
    "name": "[Unnamed Frog Dish]",
    "category": "Frogs",
    "reason": "Unpublished review record awaiting client confirmation; no corresponding Oddle listing."
  },
  "ks-20261015-033": {
    "action": "RETAINED",
    "name": "Black Bean with Frogs",
    "category": "Frogs",
    "reason": "Oddle listing (Black Bean Stir Fried With Frogs) has no photo attached on Oddle."
  },
  "ks-20261015-034": {
    "action": "REPLACED",
    "name": "Kung Bao Frogs",
    "category": "Frogs",
    "oddle_listing": "‘Kung Pao’ Frogs With Fried With Dried Chilli | 宫宝田鸡",
    "oddle_photo": "/menu-photos/kung-pao-frogs-with-fried-with-dried-chilli--86881b3bc0.png",
    "oddle_source_url": "https://ucarecdn.com/e5502007-f1cc-456a-a610-27677717cb27/"
  },
  "ks-20261015-035": {
    "action": "REPLACED",
    "name": "Golden Dragon Chicken",
    "category": "Chicken",
    "oddle_listing": "Golden Dragon Chicken | 脆皮金龙鸡",
    "oddle_photo": "/menu-photos/golden-dragon-chicken--b8b833bddc.png",
    "oddle_source_url": "https://ucarecdn.com/eaad0a1f-19fa-4722-9cae-6bf2db23493b/"
  },
  "ks-20261015-036": {
    "action": "REPLACED",
    "name": "Bean Sprout with Salted Fish",
    "category": "Vegetables",
    "oddle_listing": "Bean Sprout Stir Fried With Salted Fish | 银芽炒咸鱼",
    "oddle_photo": "/menu-photos/bean-sprout-stir-fried-with-salted-fish--0a203db54b.png",
    "oddle_source_url": "https://ucarecdn.com/86eeb9fc-809b-462a-95a0-86d0f17e1bde/"
  },
  "ks-20261015-037": {
    "action": "RETAINED",
    "name": "Garlic Broccoli",
    "category": "Vegetables",
    "reason": "Oddle listing is Stir Fried Broccoli With Oyster Sauce; client preparation is with Garlic."
  },
  "ks-20261015-038": {
    "action": "REPLACED",
    "name": "Sambal Kangkong",
    "category": "Vegetables",
    "oddle_listing": "Stir Fried Kangkong With Sambal | 马来风光",
    "oddle_photo": "/menu-photos/stir-fried-kangkong-with-sambal--886d47cb95.png",
    "oddle_source_url": "https://ucarecdn.com/eef4976b-16c5-408f-82b8-09e32fdac516/"
  },
  "ks-20261015-039": {
    "action": "REPLACED",
    "name": "Kai Lan with Garlic",
    "category": "Vegetables",
    "oddle_listing": "Stir Fried Kai Lan With Garlic | 蒜茸炒芥兰",
    "oddle_photo": "/menu-photos/stir-fried-kai-lan-with-garlic--9df4b52dee.png",
    "oddle_source_url": "https://ucarecdn.com/93417926-cc22-4f66-8316-72f4543393a0/"
  },
  "ks-20261015-040": {
    "action": "RETAINED",
    "name": "Poached Lettuce",
    "category": "Vegetables",
    "reason": "Oddle listing (Boiled Chinese Lettuce With Light Sauces) has no photo attached on Oddle."
  },
  "ks-20261015-041": {
    "action": "REPLACED",
    "name": "Romaine Lettuce with Fermented Beancurd",
    "category": "Vegetables",
    "oddle_listing": "Romaine Lettuce Stir Fried Fermented Beancurd | 腐乳炒麦菜",
    "oddle_photo": "/menu-photos/romaine-lettuce-stir-fried-fermented-beancurd--98a161a1f4.png",
    "oddle_source_url": "https://ucarecdn.com/9e5e5561-6866-4ec5-b495-7cfff32e7ac9/"
  },
  "ks-20261015-042": {
    "action": "REPLACED",
    "name": "Garlic with Small Cabbage",
    "category": "Vegetables",
    "oddle_listing": "Stir Fried Small Cabbage With Garlic | 蒜茸炒小白菜",
    "oddle_photo": "/menu-photos/stir-fried-small-cabbage-with-garlic--50de44b43d.png",
    "oddle_source_url": "https://ucarecdn.com/cd1c95b1-fb8e-493f-89b8-ddd76e734478/"
  },
  "ks-20261015-043": {
    "action": "REPLACED",
    "name": "Chinese Spinach with Trio Egg",
    "category": "Vegetables",
    "oddle_listing": "Poached Chinese Spinach | 金银蛋苋菜",
    "oddle_photo": "/menu-photos/poached-chinese-spinach--8767847a77.png",
    "oddle_source_url": "https://ucarecdn.com/9d59fe45-c76a-4bee-ab0d-2c038d2404ca/"
  },
  "ks-20261015-044": {
    "action": "RETAINED",
    "name": "Black Bean Beef Hor Fun",
    "category": "Hor Fun",
    "reason": "Oddle listing is combined Black Bean/Dry Beef Hor Fun. Rule 3 forbids guessing which variant photo depicts."
  },
  "ks-20261015-045": {
    "action": "REPLACED",
    "name": "Sanluo Hor Fun",
    "category": "Hor Fun",
    "oddle_listing": "Sliced Fish Hor Fun With Bean Sprout | 生捞河粉",
    "oddle_photo": "/menu-photos/sliced-fish-hor-fun-with-bean-sprout--8d81d8bc79.png",
    "oddle_source_url": "https://ucarecdn.com/92d9f541-3833-452f-b38d-bfab3bb7c469/"
  },
  "ks-20261015-046": {
    "action": "RETAINED",
    "name": "Black Bean Fish Hor Fun",
    "category": "Hor Fun",
    "reason": "Oddle listing is combined Black Bean Sliced Fish Bee Hoon/Hor Fun."
  },
  "ks-20261015-047": {
    "action": "RETAINED",
    "name": "Dry Beef Hor Fun",
    "category": "Hor Fun",
    "reason": "Oddle listing is combined Black Bean/Dry Beef Hor Fun. Rule 3 forbids guessing which variant photo depicts."
  },
  "ks-20261015-048": {
    "action": "RETAINED",
    "name": "Seafood and Pork Hor Fun",
    "category": "Hor Fun",
    "reason": "Oddle listing is combined Seafood & Pork Hor Fun / Bee Hoon."
  },
  "ks-20261015-049": {
    "action": "REPLACED",
    "name": "Moonlight Hor Fun",
    "category": "Hor Fun",
    "oddle_listing": "Moonlight Hor Fun | 月光河粉",
    "oddle_photo": "/menu-photos/moonlight-hor-fun--2d97e5cc72.png",
    "oddle_source_url": "https://ucarecdn.com/da2e980d-1904-4294-b028-6dcef5729dc3/"
  },
  "ks-20261015-050": {
    "action": "REPLACED",
    "name": "Big Prawn Hor Fun",
    "category": "Hor Fun",
    "oddle_listing": "Big Prawns Hor Fun | 大虾滑蛋河粉",
    "oddle_photo": "/menu-photos/big-prawns-hor-fun--a25f97d3b6.png",
    "oddle_source_url": "https://ucarecdn.com/9a0263ba-c404-4e16-9348-23d7859c3842/"
  },
  "ks-20261015-051": {
    "action": "RETAINED",
    "name": "Black Bean Fish Meat Bee Hoon",
    "category": "Noodles",
    "reason": "Oddle listing is combined Black Bean Fish Meat Braised Bee Hoon/Hor Fun."
  },
  "ks-20261015-052": {
    "action": "RETAINED",
    "name": "Dry Bee Hoon",
    "category": "Noodles",
    "reason": "Oddle listing is combined Stir Fried Dry Bee Hoon/ HK Noodle."
  },
  "ks-20261015-053": {
    "action": "REPLACED",
    "name": "Fish Meat Bee Hoon Soup",
    "category": "Noodles",
    "oddle_listing": "Fish Meat Bee Hoon Soup | 鱼鸡粗米粉汤",
    "oddle_photo": "/menu-photos/fish-meat-bee-hoon-soup--0861cc5427.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/FishMeatBeeHoonSoupe5dd06.jpg"
  },
  "ks-20261015-054": {
    "action": "RETAINED",
    "name": "Hokkien Mee",
    "category": "Noodles",
    "reason": "Not offered on Oddle menu."
  },
  "ks-20261015-055": {
    "action": "REPLACED",
    "name": "Eggs Crispy Noodle",
    "category": "Noodles",
    "oddle_listing": "Crispy Noodle Surface With Shrimp Omelette | 黄布虾球生面",
    "oddle_photo": "/menu-photos/crispy-noodle-surface-with-shrimp-omelette--718f63bc50.png",
    "oddle_source_url": "https://ucarecdn.com/f34de575-832a-45be-b13a-ac079445c60a/"
  },
  "ks-20261015-056": {
    "action": "RETAINED",
    "name": "Mee Goreng",
    "category": "Noodles",
    "reason": "Not offered on current Oddle menu."
  },
  "ks-20261015-057": {
    "action": "REPLACED",
    "name": "Prawn Bee Hoon Soup",
    "category": "Noodles",
    "oddle_listing": "Big Prawns Bee Hoon Soup | 大虾粗米粉汤",
    "oddle_photo": "/menu-photos/big-prawns-bee-hoon-soup--d2a89004fb.png",
    "oddle_source_url": "https://ucarecdn.com/cec740f2-2b72-448a-b5dd-4a959fefddee/"
  },
  "ks-20261015-058": {
    "action": "REPLACED",
    "name": "Crispy Noodle",
    "category": "Noodles",
    "oddle_listing": "Seafood & Pork Crispy Noodle |滑蛋 什锦生面",
    "oddle_photo": "/menu-photos/seafood-pork-crispy-noodle--d99040f8c3.png",
    "oddle_source_url": "https://ucarecdn.com/410a6eb0-8feb-4a48-8cc2-a0629c5159c7/"
  },
  "ks-20261015-059": {
    "action": "REPLACED",
    "name": "Sweet and Sour Pork Chop",
    "category": "Pork",
    "oddle_listing": "Sweet & Sour Pork Chop | 酸甜排骨王",
    "oddle_photo": "/menu-photos/sweet-sour-pork-chop--2c8d04a504.png",
    "oddle_source_url": "https://ucarecdn.com/d9b30666-0e8a-4190-84c4-54b87af7b8ea/"
  },
  "ks-20261015-060": {
    "action": "REPLACED",
    "name": "Black Sauce Roasted Pork",
    "category": "Pork",
    "oddle_listing": "Fried Crispy Roast Pork with Black Sauce | 香爆烧肉",
    "oddle_photo": "/menu-photos/fried-crispy-roast-pork-with-black-sauce--0631e5e49c.jpg",
    "oddle_source_url": "https://ucarecdn.com/abb653d2-1dc3-4452-88eb-a375f7f062d0/"
  },
  "ks-20261015-061": {
    "action": "REPLACED",
    "name": "Bittergourd Pork Ribs",
    "category": "Pork",
    "oddle_listing": "Bittergourd Pork Ribs with Black Bean Sauce | 苦瓜豉汁闷排骨",
    "oddle_photo": "/menu-photos/bittergourd-pork-ribs-with-black-bean-sauce--63792e6836.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/BittergourdPorkRibswithBlackBeanSauce223406.jpg"
  },
  "ks-20261015-062": {
    "action": "REPLACED",
    "name": "Kai Lan Roasted Pork",
    "category": "Pork",
    "oddle_listing": "Kai Lan Stir Fried with Roasted Pork | 芥兰炒烧肉",
    "oddle_photo": "/menu-photos/kai-lan-stir-fried-with-roasted-pork--64fd085aac.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/KaiLanStirFriedwithRoastedPorkce6496.jpg"
  },
  "ks-20261015-063": {
    "action": "REPLACED",
    "name": "Minced Pork with Eggplants",
    "category": "Pork",
    "oddle_listing": "Claypot Brinjal With Minced Pork | 肉碎茄子煲",
    "oddle_photo": "/menu-photos/claypot-brinjal-with-minced-pork--9e9a1b802f.png",
    "oddle_source_url": "https://ucarecdn.com/9641d9fe-6966-4cca-8c3c-b4de212e4754/"
  },
  "ks-20261015-064": {
    "action": "REPLACED",
    "name": "Sweet and Sour Pork",
    "category": "Pork",
    "oddle_listing": "Sweet & Sour Pork | 咕酪肉",
    "oddle_photo": "/menu-photos/sweet-sour-pork--e30c775b1f.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/SweetSourPorkf92992.jpg"
  },
  "ks-20261015-065": {
    "action": "RETAINED",
    "name": "Steamed Pork with Prawn Paste",
    "category": "Pork",
    "reason": "Oddle listing is Salted Fish Steam Minced Pork; different recipe and preparation."
  },
  "ks-20261015-066": {
    "action": "REPLACED",
    "name": "Black Bean with Sliced Fish Rice",
    "category": "Rice",
    "oddle_listing": "Black Bean Sliced Fish Rice | 豉汁鱼片饭",
    "oddle_photo": "/menu-photos/black-bean-sliced-fish-rice--e0ad4e1897.png",
    "oddle_source_url": "https://ucarecdn.com/d985976a-5134-4f8b-bcfc-22a2055a0bfe/"
  },
  "ks-20261015-067": {
    "action": "REPLACED",
    "name": "Black Sauce with Roasted Pork Rice",
    "category": "Rice",
    "oddle_listing": "Black Bean Sauce Roasted Pork Rice | 香爆烧肉饭",
    "oddle_photo": "/menu-photos/black-bean-sauce-roasted-pork-rice--bd33a6d60d.png",
    "oddle_source_url": "https://ucarecdn.com/7ba462a8-cb8d-4a17-8bd2-e7559238db3f/"
  },
  "ks-20261015-068": {
    "action": "REPLACED",
    "name": "Seafood Fried Rice",
    "category": "Rice",
    "oddle_listing": "Seafoods Fried Rice | 海鲜炒饭",
    "oddle_photo": "/menu-photos/seafoods-fried-rice--9b916b0f95.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/SeafoodsFriedRicecba8aa.jpg"
  },
  "ks-20261015-069": {
    "action": "REPLACED",
    "name": "Beef Fried Rice",
    "category": "Rice",
    "oddle_listing": "Beef Fried Rice | 牛肉炒饭",
    "oddle_photo": "/menu-photos/beef-fried-rice--b5825b34bf.png",
    "oddle_source_url": "https://ucarecdn.com/e34e4fc8-5b4c-4f1c-bb3e-623dbc74c649/"
  },
  "ks-20261015-070": {
    "action": "REPLACED",
    "name": "Braised Rice",
    "category": "Rice",
    "oddle_listing": "Seafoods & Pork Braised Rice | 什锦滑蛋绘饭",
    "oddle_photo": "/menu-photos/seafoods-pork-braised-rice--5c7f7b7bd6.png",
    "oddle_source_url": "https://ucarecdn.com/44a71aeb-5bf5-4a57-8a62-57fe44d1ddc5/"
  },
  "ks-20261015-071": {
    "action": "REPLACED",
    "name": "Thai Style Fried Rice",
    "category": "Rice",
    "oddle_listing": "Thai Style Fried Rice | 泰式炒饭",
    "oddle_photo": "/menu-photos/thai-style-fried-rice--132f479410.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/ThaiStyleFriedRice92d71d.jpg"
  },
  "ks-20261015-072": {
    "action": "REPLACED",
    "name": "Kai Lan Roasted Pork Rice",
    "category": "Rice",
    "oddle_listing": "Kai Lan Roasted Pork Rice | 芥兰烧肉饭",
    "oddle_photo": "/menu-photos/kai-lan-roasted-pork-rice--945f23ea9f.png",
    "oddle_source_url": "https://ucarecdn.com/5cb26cb2-c786-435b-b162-8029a69f493e/"
  },
  "ks-20261015-073": {
    "action": "RETAINED",
    "name": "Kai Lan with Beef Rice",
    "category": "Rice",
    "reason": "Oddle listing is combined Kai Lan Sliced Fish/Beef Rice."
  },
  "ks-20261015-074": {
    "action": "REPLACED",
    "name": "Soup Rice",
    "category": "Rice",
    "oddle_listing": "Seafoods & Pork Soup Rice | 上汤什锦饭",
    "oddle_photo": "/menu-photos/seafoods-pork-soup-rice--f2a33c14d6.png",
    "oddle_source_url": "https://ucarecdn.com/06ee20bc-2196-4ebc-92ed-3851b13bdb61/"
  },
  "ks-20261015-075": {
    "action": "REPLACED",
    "name": "Spring Onion Beef Rice",
    "category": "Rice",
    "oddle_listing": "Spring Onion Sliced Beef Rice | 姜葱牛肉饭",
    "oddle_photo": "/menu-photos/spring-onion-sliced-beef-rice--46ec53163d.png",
    "oddle_source_url": "https://ucarecdn.com/5e91ea4e-d23f-4cdc-9057-50851f592acd/"
  },
  "ks-20261015-076": {
    "action": "REPLACED",
    "name": "Sweet & Sour Pork Rice",
    "category": "Rice",
    "oddle_listing": "Sweet & Sour Pork Rice | 酸甜咕酪肉饭",
    "oddle_photo": "/menu-photos/sweet-sour-pork-rice--7b4f540a88.png",
    "oddle_source_url": "https://ucarecdn.com/bdd8e959-071e-4ebc-99c4-b7cf3a91e253/"
  },
  "ks-20261015-077": {
    "action": "REPLACED",
    "name": "Roasted Pork Tofu Rice",
    "category": "Rice",
    "oddle_listing": "Roasted Pork Tofu Rice | 烧肉豆腐饭",
    "oddle_photo": "/menu-photos/roasted-pork-tofu-rice--f3f3960d23.png",
    "oddle_source_url": "https://ucarecdn.com/c50d367a-bb71-45f8-ac9b-9f16cb01395f/"
  },
  "ks-20261015-078": {
    "action": "REPLACED",
    "name": "Yang Zhuo Fried Rice",
    "category": "Rice",
    "oddle_listing": "Yang Zhuo Fried Rice | 杨州炒饭",
    "oddle_photo": "/menu-photos/yang-zhuo-fried-rice--985b632c71.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/YangZhuoFriedRice330dd5.jpg"
  },
  "ks-20261015-079": {
    "action": "RETAINED",
    "name": "Stir Fried Big Prawns with Spring Onion",
    "category": "Seafood",
    "reason": "Oddle listing differs (Spring Onion Medium Size Prawn / Stir Fried Light Sauce with Big Prawn)."
  },
  "ks-20261015-080": {
    "action": "REPLACED",
    "name": "Broccoli Prawn Balls",
    "category": "Seafood",
    "oddle_listing": "Broccoli Stir Fried with Prawns Balls | 西兰花炒虾球",
    "oddle_photo": "/menu-photos/broccoli-stir-fried-with-prawns-balls--1cb59800f5.png",
    "oddle_source_url": "https://ucarecdn.com/73a46c50-ef7a-41eb-9b0c-d082d9d3c19e/"
  },
  "ks-20261015-081": {
    "action": "REPLACED",
    "name": "Cereal Prawns",
    "category": "Seafood",
    "oddle_listing": "Cereal Butter Prawns | 麦片鲜虾",
    "oddle_photo": "/menu-photos/cereal-butter-prawns--690753ad2e.png",
    "oddle_source_url": "https://ucarecdn.com/7cfe66cd-daab-489f-99b1-f409a0eb8e82/"
  },
  "ks-20261015-082": {
    "action": "REPLACED",
    "name": "Prawn Roll",
    "category": "Seafood",
    "oddle_listing": "Prawn Roll | 虾枣",
    "oddle_photo": "/menu-photos/prawn-roll--0e7e26cd9a.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/PrawnRolldb589a.jpg"
  },
  "ks-20261015-083": {
    "action": "REPLACED",
    "name": "Salt & Pepper Prawn",
    "category": "Seafood",
    "oddle_listing": "Salt & Pepper Prawns | 椒盐鲜虾",
    "oddle_photo": "/menu-photos/salt-pepper-prawns--631f79ab29.png",
    "oddle_source_url": "https://ucarecdn.com/2f7ad766-0456-4cb0-adf7-de445b42689d/"
  },
  "ks-20261015-084": {
    "action": "REPLACED",
    "name": "Salted Egg Prawns",
    "category": "Seafood",
    "oddle_listing": "Salted Egg Prawn Ball | 咸蛋黄虾球",
    "oddle_photo": "/menu-photos/salted-egg-prawn-ball--fcddef7418.png",
    "oddle_source_url": "https://ucarecdn.com/4eee6f36-63bf-42b2-93d6-dddc82b0c0d3/"
  },
  "ks-20261015-085": {
    "action": "REPLACED",
    "name": "Sambal Prawn",
    "category": "Seafood",
    "oddle_listing": "Sambal Stir Fried with Prawns Balls | 叁巴炒虾球",
    "oddle_photo": "/menu-photos/sambal-stir-fried-with-prawns-balls--15d69837ce.png",
    "oddle_source_url": "https://ucarecdn.com/83374fba-30ed-462b-9af6-a44bfe5ded90/"
  },
  "ks-20261015-086": {
    "action": "REPLACED",
    "name": "Sea Cucumber with Mushroom",
    "category": "Seafood",
    "oddle_listing": "Sea Cucumber Braised Mushrooms | 冬菇海参煲",
    "oddle_photo": "/menu-photos/sea-cucumber-braised-mushrooms--9700bbbf58.png",
    "oddle_source_url": "https://ucarecdn.com/79c3f608-e52f-4ffd-8d4e-f81553ea28cf/"
  },
  "ks-20261015-087": {
    "action": "RETAINED",
    "name": "Sliced Fish Soup",
    "category": "Soup",
    "reason": "Oddle listing is combined Sliced Fish/Fish Head Soup."
  },
  "ks-20261015-088": {
    "action": "REPLACED",
    "name": "Salted Vegetables Tofu Soup",
    "category": "Soup",
    "oddle_listing": "Salted Vegetable Tofu Soup | 什锦咸菜豆腐汤",
    "oddle_photo": "/menu-photos/salted-vegetable-tofu-soup--0f874e4aed.png",
    "oddle_source_url": "https://ucarecdn.com/84806e8a-f626-436d-bfac-e6309f9ce637/"
  },
  "ks-20261015-089": {
    "action": "REPLACED",
    "name": "Spinach Soup",
    "category": "Soup",
    "oddle_listing": "Spinach Soup | 苋菜汤",
    "oddle_photo": "/menu-photos/spinach-soup--9829677649.png",
    "oddle_source_url": "https://ucarecdn.com/2bdaf5ae-3032-4e66-aa88-b741c92c32c6/"
  },
  "ks-20261015-090": {
    "action": "REPLACED",
    "name": "Fish Meat Soup",
    "category": "Soup",
    "oddle_listing": "Fish Meat Soup | 鱼鸡汤",
    "oddle_photo": "/menu-photos/fish-meat-soup--2019c09c8e.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/FishMeatSoupf39820.jpg"
  },
  "ks-20261015-091": {
    "action": "REPLACED",
    "name": "Fish Maw Soup",
    "category": "Soup",
    "oddle_listing": "Fish Maw Soup | 鱼鳔羹",
    "oddle_photo": "/menu-photos/fish-maw-soup--cec6afe213.png",
    "oddle_source_url": "https://ucarecdn.com/88e2d587-c891-4ac9-8b1a-51f24ca9464e/"
  },
  "ks-20261015-092": {
    "action": "REPLACED",
    "name": "Bittergourd Soup",
    "category": "Soup",
    "oddle_listing": "Bittergourd Soup With Seafoods & Pork | 什锦凉瓜汤",
    "oddle_photo": "/menu-photos/bittergourd-soup-with-seafoods-pork--f18ebc5779.png",
    "oddle_source_url": "https://ucarecdn.com/738ac104-4e4e-423a-b4f3-99fbc4cde42c/"
  },
  "ks-20261015-093": {
    "action": "REPLACED",
    "name": "Braised Tofu",
    "category": "Tofu",
    "oddle_listing": "Braised Tofu with Roast Pork | 烧肉红烧豆腐",
    "oddle_photo": "/menu-photos/braised-tofu-with-roast-pork--7dddd0c8b6.png",
    "oddle_source_url": "https://ucarecdn.com/841b8523-9929-40cd-93e4-0afdd0476608/"
  },
  "ks-20261015-094": {
    "action": "REPLACED",
    "name": "Deep Fried Tofu",
    "category": "Tofu",
    "oddle_listing": "Golden Beancurds | 黄金豆腐",
    "oddle_photo": "/menu-photos/golden-beancurds--8681e586bd.jpg",
    "oddle_source_url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/GoldenBeancurds198556.jpg"
  },
  "ks-20261015-095": {
    "action": "REPLACED",
    "name": "Homemade Tofu",
    "category": "Tofu",
    "oddle_listing": "Homemade Tofu with Minced Pork | 家乡豆腐",
    "oddle_photo": "/menu-photos/homemade-tofu-with-minced-pork--612ced2912.png",
    "oddle_source_url": "https://ucarecdn.com/5c46c907-c26a-4c8d-804d-e17715eb7e00/"
  },
  "ks-20261015-096": {
    "action": "REPLACED",
    "name": "Hotplate Tofu",
    "category": "Tofu",
    "oddle_listing": "Hotplate Tofu | 铁板豆腐",
    "oddle_photo": "/menu-photos/hotplate-tofu--3456d5b479.png",
    "oddle_source_url": "https://ucarecdn.com/9c5d6a8c-1ba5-4d6e-94d5-1c1832d8d16c/"
  },
  "ks-20261015-097": {
    "action": "RETAINED",
    "name": "Prawn Tofu",
    "category": "Tofu",
    "reason": "Oddle listing (Prawns Balls Braised Tofu) has no photo attached on Oddle."
  },
  "ks-20261015-098": {
    "action": "RETAINED",
    "name": "Sea Cucumber with Tofu",
    "category": "Tofu",
    "reason": "Oddle listing (Braised Tofu with Sea Cucumber) has no photo attached on Oddle."
  },
  "ks-20261015-099": {
    "action": "REPLACED",
    "name": "Yong Tau Foo",
    "category": "Tofu",
    "oddle_listing": "Claypot Yong Tau Foo | 巧手三宝煲",
    "oddle_photo": "/menu-photos/claypot-yong-tau-foo--20bc99fcfc.png",
    "oddle_source_url": "https://ucarecdn.com/c8bbfc23-e348-411b-bfd5-fd7b8dba4363/"
  },
  "ks-20261015-100": {
    "action": "RETAINED",
    "name": "Yam Paste",
    "category": "Additional Dishes",
    "reason": "No Yam Paste dish offered on Oddle menu."
  }
};

const replaced = Object.entries(oddlePhotoMapping).filter(([_, v]) => v.action === "REPLACED");
const retained = Object.entries(oddlePhotoMapping).filter(([_, v]) => v.action === "RETAINED");

console.log(`Evaluated: ${Object.keys(oddlePhotoMapping).length} dishes`);
console.log(`REPLACED with confirmed Oddle photos: ${replaced.length}`);
console.log(`RETAINED current photo: ${retained.length}`);

// Verify all oddle_photo exist on disk in public
let missingOnDisk = 0;
for (const [id, info] of replaced) {
  const filePath = "public" + info.oddle_photo;
  if (!fs.existsSync(filePath)) {
    console.error(`Missing on disk: ${filePath} for ${id} ${info.name}`);
    missingOnDisk++;
  }
}
console.log(`Missing on disk among replaced: ${missingOnDisk}`);

fs.writeFileSync("data/oddle-confirmed-photo-mapping.json", JSON.stringify(oddlePhotoMapping, null, 2));
console.log("Wrote data/oddle-confirmed-photo-mapping.json successfully");
