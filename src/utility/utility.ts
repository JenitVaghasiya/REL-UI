import * as _ from 'underscore';
export default class Utility {

static deepClone(obj) {
  const clone = _.clone(obj);
  _.each(clone, (value, key) => {
    if (_.isObject(value)) {
      clone[key] = this.deepClone(value);
    }
  });
  return clone;
}

}
