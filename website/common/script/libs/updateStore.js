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

  let comedGearkeys = ['head_mystery_201611', 'head_special_winter2017Warrior', 'head_armoire_redHairbow'];

  comedGearkeys.forEach(function updatedStoreKeys (key) {
    if (!user.items.gear.owned[key]) changes.push(content.gear.flat[key]);
  });

  return sortBy(changes, (change) => sortOrder[change.type]);
};
