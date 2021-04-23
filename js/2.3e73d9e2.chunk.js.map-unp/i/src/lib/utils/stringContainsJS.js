const jsOperators = /(:|=|{|})+/g;

export default str => jsOperators.test(str);
