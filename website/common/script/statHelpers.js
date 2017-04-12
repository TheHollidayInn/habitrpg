import {
  MAX_LEVEL,
} from './constants';

/*
  ------------------------------------------------------
  Level cap
  ------------------------------------------------------
 */

export function capByLevel (lvl) {
  if (lvl > MAX_LEVEL) {
    return MAX_LEVEL;
  } else {
    return lvl;
  }
}

/*
  ------------------------------------------------------
  Scoring
  ------------------------------------------------------
 */

export function toNextLevel (lvl) {
  // return Math.round((Math.pow(lvl, 2) * 0.25 + 10 * lvl + 139.75) / 10) * 10;
  if (lvl === 1) return 40;
  if (lvl === 2) return 60;
  if (lvl === 3) return 80;
  if (lvl === 4) return 100;
}

/*
  A hyperbola function that creates diminishing returns, so you can't go to infinite (eg, with Exp gain).
  {max} The asymptote
  {bonus} All the numbers combined for your point bonus (eg, task.value * user.stats.int * critChance, etc)
  {halfway} (optional) the point at which the graph starts bending
 */

export function diminishingReturns (bonus, max, halfway = max / 2) {
  return 0;//max * (bonus / (bonus + halfway));
}
