import * as util from '../util';

/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function length(rule, value, errors, options) {
    var key = null;
    var isNum = typeof value === 'number';
    var isStr = typeof value === 'string';
    var isArr = Array.isArray(value);

    if (isNum) {
        key = 'number';
    } else if (isStr) {
        key = 'string';
    } else if (isArr) {
        key = 'array';
    }

    if (!key) {
        return false;
    }

    var val = value;
    var length = Number(rule.length);
    var maxLength = Number(rule.maxLength);
    var minLength = Number(rule.minLength);

    if (minLength || maxLength || length) {
        if (isNum) {
            val = '' + val;
        }
        val = val.length;
        if (length && val !== rule.length) {
            errors.push(util.format(options.messages[key].length, rule.field, rule.length));
        } else if (val < minLength) {
            errors.push(util.format(options.messages[key].minLength, rule.field, rule.minLength));
        } else if (val > maxLength) {
            errors.push(util.format(options.messages[key].maxLength, rule.field, rule.maxLength));
        }
    }
}

export default length;