// Pure calculation functions — no DOM access, no side effects.

/**
 * Returns the D&D 5e ability modifier string (e.g. "+2", "-1") for a raw score.
 * @param {number|string} score
 * @returns {string}
 */
export function getAbilityModifier(score) {
    switch (parseInt(score)) {
        case 1:  return '-5';
        case 2:  case 3:  return '-4';
        case 4:  case 5:  return '-3';
        case 6:  case 7:  return '-2';
        case 8:  case 9:  return '-1';
        case 10: case 11: return '+0';
        case 12: case 13: return '+1';
        case 14: case 15: return '+2';
        case 16: case 17: return '+3';
        case 18: case 19: return '+4';
        case 20: case 21: return '+5';
        case 22: case 23: return '+6';
        case 24: case 25: return '+7';
        case 26: case 27: return '+8';
        case 28: case 29: return '+9';
        case 30:          return '+10';
        default:          return '';
    }
}

/**
 * Converts an amount of `coin` into units of `base` currency.
 * @param {'copper'|'silver'|'gold'|'electrum'|'platinum'} coin
 * @param {'c'|'s'|'g'|'e'|'p'} base
 * @returns {number}
 */
export function cacluateCurrencyMod(coin, base) {
    var rates = {
        copper:   { c: 1,    s: 1/10,  g: 1/100, e: 1/50,  p: 1/1000 },
        silver:   { c: 10,   s: 1,     g: 1/10,  e: 1/5,   p: 1/100  },
        gold:     { c: 100,  s: 10,    g: 1,     e: 2,     p: 1/10   },
        electrum: { c: 50,   s: 5,     g: 1/2,   e: 1,     p: 1/20   },
        platinum: { c: 1000, s: 100,   g: 10,    e: 20,    p: 1      }
    };
    return (rates[coin] && rates[coin][base]) || 0;
}
