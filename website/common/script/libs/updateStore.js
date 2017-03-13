import each from 'lodash/each';
import lodashFind from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import content from '../content/index';

// Return the list of gear items available for purchase

let sortOrder = reduce(content.gearTypes, (accumulator, val, key) => {
  accumulator[val] = key;
  return accumulator;
}, {});

module.exports = function updateStore (user) {
  let changes = [];

  // each(content.gearTypes, (type) => {
  //   let found = lodashFind(content.gear.tree[type][user.stats.class], (item) => {
  //     return !user.items.gear.owned[item.key];
  //   });

  //   if (found) changes.push(found);
  // });

  // changes = changes.concat(filter(content.gear.flat, (val) => {
  //   if (['special', 'mystery', 'armoire'].indexOf(val.klass) !== -1 && !user.items.gear.owned[val.key] && (val.canOwn ? val.canOwn(user) : false)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }));

  let comedGearkeys = [
    'head_mystery_201611',
    'head_special_winter2017Warrior',
    'head_armoire_redHairbow',
    'head_armoire_minerHelmet',
    'head_special_fallRogue',
    'head_special_fall2015Mage',
    'armor_special_fall2015Mage',
    'armor_armoire_redPartyDress',
    'head_special_nye',
    'body_special_summer2015Rogue',
    'armor_mystery_201609',
    'shield_special_summer2016Healer',
    'weapon_special_winter2016Rogue',
    'shield_armoire_floralBouquet',
    'head_special_winter2016Warrior',
    'shield_special_winter2016Healer',
    'armor_rogue_1',
    'head_armoire_redFloppyHat',
    'head_armoire_graduateCap',
    'head_warrior_2',
    'head_special_springMage',
    'head_special_winter2015Healer',
    'headAccessory_mystery_301405',
    'eyewear_mystery_201507',
    'shield_special_springRogue',
    'head_armoire_crownOfHearts',
    'weapon_armoire_habiticanDiploma',
    'head_mystery_201408',
    'weapon_special_winter2016Healer',
    'head_special_summer2016Healer',
    'head_special_winter2017Healer',
    'armor_special_winter2016Warrior',
    'head_armoire_goldenLaurels',
    'headAccessory_mystery_201403',
    'shield_special_spring2015Warrior',
    'weapon_armoire_wandOfHearts',
    'armor_mystery_201408',
    'eyewear_mystery_301405',
    'head_armoire_yellowHairbow',
    'weapon_special_winter2016Warrior',
    'headAccessory_special_bearEars',
    'body_special_summer2015Mage',
    'back_mystery_201404',
    'head_rogue_5',
    'armor_armoire_minerOveralls',
    'body_special_wondercon_gold',
    'shield_special_springHealer',
    'shield_armoire_mysticLamp',
    'eyewear_mystery_201701',
    'back_mystery_201507',
    'weapon_special_springWarrior',
    'shield_special_winter2017Warrior',
    'weapon_special_fallMage',
    'head_special_spring2016Healer',
    'weapon_special_spring2016Healer',
    'armor_special_winter2017Warrior',
    'armor_special_fallWarrior',
    'head_special_fall2015Healer',
    'armor_mystery_301404',
    'armor_mystery_201412',
    'head_warrior_4',
    'armor_armoire_graduateRobe',
    'weapon_special_3',
    'shield_special_winter2017Healer',
    'weapon_special_bardInstrument',
    'head_mystery_201608',
    'head_armoire_blueHairbow',
  ];

  comedGearkeys.forEach(function updatedStoreKeys (key) {
    if (!user.items.gear.owned[key]) changes.push(content.gear.flat[key]);
  });

  return sortBy(changes, (change) => sortOrder[change.type]);
};
