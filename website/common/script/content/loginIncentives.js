import _ from 'lodash';
import { MAX_INCENTIVES } from '../constants';

module.exports = function getLoginIncentives (api) {

let getPetKeys = (pet) => {
  return pet.key;
};

module.exports = function getLoginIncentives (api) {
  let set1 = {
    1: {
      rewardKey: ['armor_special_bardRobes'],
      reward: [api.gear.flat.armor_special_bardRobes],
      assignReward: function assignReward (user) {
        user.items.gear.owned.armor_special_bardRobes = true; // eslint-disable-line camelcase
      },
    },
    2: {
      rewardKey: ['background_purple'],
      reward: [api.backgrounds.incentiveBackgrounds],
      assignReward: function assignReward (user) {
        user.purchased.background.blue = true;
        user.purchased.background.green = true;
        user.purchased.background.purple = true;
        user.purchased.background.red = true;
        user.purchased.background.yellow = true;
        user.markModified('purchased.background');
      },
    },
    3: {
      rewardKey: ['head_special_bardHat'],
      reward: [api.gear.flat.head_special_bardHat],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_bardHat = true; // eslint-disable-line camelcase
      },
    },
    4: {
      rewardKey: ['Pet_HatchingPotion_RoyalPurple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    5: {
      rewardKey: ['Pet_Food_Chocolate', 'Pet_Food_Meat', 'Pet_Food_CottonCandyPink'],
      reward: [api.food.Chocolate, api.food.Meat, api.food.CottonCandyPink],
      assignReward: function assignReward (user) {
        if (!user.items.food.Chocolate) user.items.food.Chocolate = 0;
        user.items.food.Chocolate += 1;
        if (!user.items.food.Meat) user.items.food.Meat = 0;
        user.items.food.Meat += 1;
        if (!user.items.food.CottonCandyPink) user.items.food.CottonCandyPink = 0;
        user.items.food.CottonCandyPink += 1;
      },
    },
    7: {
      rewardKey: ['inventory_quest_scroll_moon1'],
      reward: [api.quests.moon1],
      assignReward: function assignReward (user) {
        if (!user.items.quests.moon1) user.items.quests.moon1 = 0;
        user.items.quests.moon1 += 1;
      },
    },
    10: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    14: {
      rewardKey: ['Pet_Food_Strawberry', 'Pet_Food_Potatoe', 'Pet_Food_CottonCandyBlue'],
      reward: [api.food.Strawberry, api.food.Potatoe, api.food.CottonCandyBlue],
      assignReward: function assignReward (user) {
        if (!user.items.food.Strawberry) user.items.food.Strawberry = 0;
        user.items.food.Strawberry += 1;
        if (!user.items.food.Potatoe) user.items.food.Potatoe = 0;
        user.items.food.Potatoe += 1;
        if (!user.items.food.CottonCandyBlue) user.items.food.CottonCandyBlue = 0;
        user.items.food.CottonCandyBlue += 1;
      },
    },
    18: {
      rewardKey: ['weapon_special_bardInstrument'],
      reward: [api.gear.flat.weapon_special_bardInstrument],
      assignReward: function assignReward (user) {
        user.items.gear.owned.weapon_special_bardInstrument = true; // eslint-disable-line camelcase
      },
    },
    22: {
      rewardKey: ['inventory_quest_scroll_moon2'],
      reward: [api.quests.moon2],
      assignReward: function assignReward (user) {
        if (!user.items.quests.moon2) user.items.quests.moon2 = 0;
        user.items.quests.moon2 += 1;
      },
    },
    26: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    30: {
      rewardKey: ['Pet_Food_Fish', 'Pet_Food_Milk', 'Pet_Food_RottenMeat', 'Pet_Food_Honey'],
      reward: [api.food.Fish, api.food.Milk, api.food.RottenMeat, api.food.Honey],
      assignReward: function assignReward (user) {
        if (!user.items.food.Fish) user.items.food.Fish = 0;
        user.items.food.Fish += 1;
        if (!user.items.food.Milk) user.items.food.Milk = 0;
        user.items.food.Milk += 1;
        if (!user.items.food.RottenMeat) user.items.food.RottenMeat = 0;
        user.items.food.RottenMeat += 1;
        if (!user.items.food.Honey) user.items.food.Honey = 0;
        user.items.food.Honey += 1;
      },
    },
    35: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    40: {
      rewardKey: ['inventory_quest_scroll_moon3'],
      reward: [api.quests.moon3],
      assignReward: function assignReward (user) {
        if (!user.items.quests.moon3) user.items.quests.moon3 = 0;
        user.items.quests.moon3 += 1;
      },
    },
    45: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    50: {
      rewardKey: ['Pet_Food_Saddle'],
      reward: [api.food.Saddle],
      assignReward: function assignReward (user) {
        if (!user.items.food.Saddle) user.items.food.Saddle = 0;
        user.items.food.Saddle += 1;
      },
    },
    55: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    60: {
      rewardKey: ['slim_armor_special_pageArmor'],
      reward: [api.gear.flat.armor_special_pageArmor],
      assignReward: function assignReward (user) {
        user.items.gear.owned.armor_special_pageArmor = true; // eslint-disable-line camelcase
      },
    },
    65: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    70: {
      rewardKey: ['head_special_pageHelm'],
      reward: [api.gear.flat.head_special_pageHelm],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_pageHelm = true; // eslint-disable-line camelcase
      },
    },
    75: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    80: {
      rewardKey: ['weapon_special_pageBanner'],
      reward: [api.gear.flat.weapon_special_pageBanner],
      assignReward: function assignReward (user) {
        user.items.gear.owned.weapon_special_pageBanner = true; // eslint-disable-line camelcase
      },
    },
    85: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    90: {
      rewardKey: ['shield_special_diamondStave'],
      reward: [api.gear.flat.shield_special_diamondStave],
      assignReward: function assignReward (user) {
        user.items.gear.owned.shield_special_diamondStave = true; // eslint-disable-line camelcase
      },
    },
    95: {
      rewardKey: ['Pet_HatchingPotion_Purple'],
      reward: [api.hatchingPotions.RoyalPurple],
      assignReward: function assignReward (user) {
        if (!user.items.hatchingPotions.RoyalPurple) user.items.hatchingPotions.RoyalPurple = 0;
        user.items.hatchingPotions.RoyalPurple += 1;
      },
    },
    100: {
      rewardKey: ['Pet_Food_Saddle'],
      reward: [api.food.Saddle],
      assignReward: function assignReward (user) {
        if (!user.items.food.Saddle) user.items.food.Saddle = 0;
        user.items.food.Saddle += 1;
      },
    },
  };

  let set2 = {
    1: {
      rewardKey: ['Pet-Gryphon-RoyalPurple'],
      reward: [api.petInfo['Gryphon-RoyalPurple']],
      assignReward: function assignReward (user) {
        user.items.pets['Gryphon-RoyalPurple'] = 5;
      },
    },
    2: {
      rewardKey: ['head_special_winter2016Mage', 'armor_special_winter2016Mage'],
      reward: [api.gear.flat.head_special_winter2016Mage, api.gear.flat.armor_special_winter2016Mage],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_winter2016Mage = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_winter2016Mage = true; // eslint-disable-line camelcase
      },
    },
    3: {
      rewardKey: ['Pet-BearCub-Polar'],
      reward: [api.specialPets['BearCub-Polar']],
      assignReward: function assignReward (user) {
        user.items.pets['BearCub-Polar'] = 5;
      },
    },
    4: {
      rewardKey: ['head_special_springRogue', 'armor_special_springRogue'],
      reward: [api.gear.flat.head_special_springRogue, api.gear.flat.armor_special_springRogue],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_springRogue = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_springRogue = true; // eslint-disable-line camelcase
      },
    },
    5: {
      rewardKey: ['Pet-Mammoth-Base'],
      reward: [api.specialPets['Mammoth-Base']],
      assignReward: function assignReward (user) {
        user.items.pets['Mammoth-Base'] = 5;
      },
    },
    6: {
      rewardKey: ['head_special_winter2016Warrior', 'armor_special_winter2016Warrior'],
      reward: [api.gear.flat.head_special_winter2016Warrior, api.gear.flat.armor_special_winter2016Warrior],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_winter2016Warrior = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_winter2016Warrior = true; // eslint-disable-line camelcase
      },
    },
    7: {
      rewardKey: ['Pet-MantisShrimp-Base'],
      reward: [api.specialPets['MantisShrimp-Base']],
      assignReward: function assignReward (user) {
        user.items.pets['MantisShrimp-Base'] = 5;
      },
    },
    8: {
      rewardKey: ['head_special_winter2016Mage', 'armor_special_winter2016Mage'],
      reward: [api.gear.flat.head_special_winter2016Mage, api.gear.flat.armor_special_winter2016Mage],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_winter2016Mage = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_winter2016Mage = true; // eslint-disable-line camelcase
      },
    },
    9: {
      rewardKey: ['Pet-Phoenix-Base'],
      reward: [api.specialPets['Phoenix-Base']],
      assignReward: function assignReward (user) {
        user.items.pets['Phoenix-Base'] = 5;
      },
    },
    10: {
      rewardKey: ['head_special_winter2016Healer', 'armor_special_winter2016Healer'],
      reward: [api.gear.flat.head_special_winter2016Healer, api.gear.flat.armor_special_winter2016Healer],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_winter2016Healer = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_winter2016Healer = true; // eslint-disable-line camelcase
      },
    },
    11: {
      rewardKey: ['Mount-Gryphon-RoyalPurple'],
      reward: [api.specialMounts['Gryphon-RoyalPurple']],
      assignReward: function assignReward (user) {
        user.items.mounts['Gryphon-RoyalPurple'] = true;
      },
    },
    12: {
      rewardKey: ['head_special_spring2016Mage', 'armor_special_spring2016Mage'],
      reward: [api.gear.flat.head_special_spring2016Mage, api.gear.flat.armor_special_spring2016Mage],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_spring2016Mage = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_spring2016Mage = true; // eslint-disable-line camelcase
      },
    },
    13: {
      rewardKey: ['Mount-BearCub-Polar'],
      reward: [api.specialMounts['BearCub-Polar']],
      assignReward: function assignReward (user) {
        user.items.mounts['BearCub-Polar'] = true;
      },
    },
    14: {
      rewardKey: ['head_special_spring2015Mage', 'armor_special_spring2015Mage'],
      reward: [api.gear.flat.head_special_spring2015Mage, api.gear.flat.armor_special_spring2015Mage],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_spring2015Mage = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_spring2015Mage = true; // eslint-disable-line camelcase
      },
    },
    15: {
      rewardKey: ['Mount-Mammoth-Base'],
      reward: [api.specialMounts['Mammoth-Base']],
      assignReward: function assignReward (user) {
        user.items.mounts['Mammoth-Base'] = true;
      },
    },
    16: {
      rewardKey: ['head_mystery_201402', 'armor_mystery_201402'],
      reward: [api.gear.flat.head_mystery_201402, api.gear.flat.armor_mystery_201402],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_mystery_201402 = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_mystery_201402 = true; // eslint-disable-line camelcase
      },
    },
    17: {
      rewardKey: ['Mount-MantisShrimp-Base'],
      reward: [api.specialMounts['MantisShrimp-Base']],
      assignReward: function assignReward (user) {
        user.items.mounts['MantisShrimp-Base'] = true;
      },
    },
    18: {
      rewardKey: ['head_mystery_201405', 'armor_mystery_201405'],
      reward: [api.gear.flat.head_mystery_201405, api.gear.flat.armor_mystery_201405],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_mystery_201405 = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_mystery_201405 = true; // eslint-disable-line camelcase
      },
    },
    19: {
      rewardKey: ['Mount-Phoenix-Base'],
      reward: [api.specialMounts['Phoenix-Base']],
      assignReward: function assignReward (user) {
        user.items.mounts['Phoenix-Base'] = true;
      },
    },
    20: {
      rewardKey: ['armor_mystery_201403', 'headAccessory_mystery_201493'],
      reward: [api.gear.tree.armor.mystery['201403'], api.gear.tree.headAccessory.mystery['201403']],
      assignReward: function assignReward (user) {
        user.items.gear.owned.armor_mystery_201403 = true; // eslint-disable-line camelcase
        user.items.gear.owned.headAccessory_mystery_201493 = true; // eslint-disable-line camelcase
      },
    },
    21: {
      rewardKey: [api.premiumPetsCategorized.Holly.map(getPetKeys)],
      reward: [api.premiumPetsCategorized.Holly],
      assignReward: function assignReward (user) {
        api.premiumPetsCategorized.Holly.forEach((pet) => {
          user.items.pets[pet.key] = 5;
        });
      },
    },
    22: {
      rewardKey: ['head_mystery_201501', 'armor_mystery_201501'],
      reward: [api.gear.flat.head_mystery_201501, api.gear.flat.armor_mystery_201501],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_mystery_201501 = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_mystery_201501 = true; // eslint-disable-line camelcase
      },
    },
    23: {
      rewardKey: [api.premiumPetsCategorized.Ghost.map(getPetKeys)],
      reward: [api.premiumPetsCategorized.Ghost],
      assignReward: function assignReward (user) {
        api.premiumPetsCategorized.Ghost.forEach((pet) => {
          user.items.pets[pet.key] = 5;
        });
      },
    },
    24: {
      rewardKey: ['head_special_winter2017Rogue', 'armor_special_winter2017Rogue'],
      reward: [api.gear.flat.head_special_winter2017Rogue, api.gear.flat.armor_special_winter2017Rogue],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_winter2017Rogue = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_winter2017Rogue = true; // eslint-disable-line camelcase
      },
    },
    25: {
      rewardKey: [api.premiumPetsCategorized.Peppermint.map(getPetKeys)],
      reward: [api.premiumPetsCategorized.Peppermint],
      assignReward: function assignReward (user) {
        api.premiumPetsCategorized.Peppermint.forEach((pet) => {
          user.items.pets[pet.key] = 5;
        });
      },
    },
    26: {
      rewardKey: ['head_special_springWarrior', 'armor_special_springWarrior'],
      reward: [api.gear.flat.head_special_springWarrior, api.gear.flat.armor_special_springWarrior],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_springWarrior = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_springWarrior = true; // eslint-disable-line camelcase
      },
    },
    27: {
      rewardKey: [api.premiumPetsCategorized.Floral.map(getPetKeys)],
      reward: [api.premiumPetsCategorized.Floral],
      assignReward: function assignReward (user) {
        api.premiumPetsCategorized.Floral.forEach((pet) => {
          user.items.pets[pet.key] = 5;
        });
      },
    },
    28: {
      rewardKey: ['head_special_summer2015Rogue', 'armor_special_summer2015Rogue'],
      reward: [api.gear.flat.head_special_summer2015Rogue, api.gear.flat.armor_special_summer2015Rogue],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_summer2015Rogue = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_summer2015Rogue = true; // eslint-disable-line camelcase
      },
    },
    29: {
      rewardKey: [api.premiumPetsCategorized.RoyalPurple.map(getPetKeys)],
      reward: [api.premiumPetsCategorized.RoyalPurple],
      assignReward: function assignReward (user) {
        api.premiumPetsCategorized.RoyalPurple.forEach((pet) => {
          user.items.pets[pet.key] = 5;
        });
      },
    },
    30: {
      rewardKey: ['head_special_summerHealer', 'armor_special_summerHealer'],
      reward: [api.gear.flat.head_special_summerHealer, api.gear.flat.armor_special_summerHealer],
      assignReward: function assignReward (user) {
        user.items.gear.owned.head_special_summerHealer = true; // eslint-disable-line camelcase
        user.items.gear.owned.armor_special_summerHealer = true; // eslint-disable-line camelcase
      },
    },
    31: {
      rewardKey: [api.premiumMountsCategorized.Thunderstorm.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.Thunderstorm],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.Thunderstorm.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
    32: {
      rewardKey: [api.premiumMountsCategorized.Holly.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.Holly],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.Holly.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
    33: {
      rewardKey: [api.premiumMountsCategorized.Ghost.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.Ghost],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.Ghost.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
    34: {
      rewardKey: [api.premiumMountsCategorized.Peppermint.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.Peppermint],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.Peppermint.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
    35: {
      rewardKey: [api.premiumMountsCategorized.Floral.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.Floral],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.Floral.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
    36: {
      rewardKey: [api.premiumMountsCategorized.RoyalPurple.map(getPetKeys)],
      reward: [api.premiumMountsCategorized.RoyalPurple],
      assignReward: function assignReward (user) {
        api.premiumMountsCategorized.RoyalPurple.forEach((mount) => {
          user.items.mounts[mount.key] = true;
        });
      },
    },
  };

  // Add refence link to next reward and add filler days so we have a map to refernce the next reward from any day
  // We could also, use a list, but then we would be cloning each of the rewards.
  // Create a new array if we want the loginIncentives to be immutable in the future
  let nextRewardKey;
  _.range(MAX_INCENTIVES + 1).reverse().forEach(function addNextRewardLink (index) {
    if (set1[index] && set1[index].rewardKey) {
      set1[index].nextRewardAt = nextRewardKey;
      nextRewardKey = index;
      return;
    }

    set1[index] = {
      reward: undefined,
      nextRewardAt: nextRewardKey,
    };
  });

  let prevRewardKey;
  _.range(MAX_INCENTIVES + 1).forEach(function addPrevRewardLink (index) {
    set1[index].prevRewardKey = prevRewardKey;
    if (set1[index].rewardKey) prevRewardKey = index;
  });

  return {set1, set2};
};
