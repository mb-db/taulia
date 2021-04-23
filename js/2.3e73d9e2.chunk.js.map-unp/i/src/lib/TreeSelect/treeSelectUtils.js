const assignExpandedTrue = obj => {
  Object.keys(obj).forEach(k => {
    const node = obj[k];
    if (typeof node === 'object') {
      node.expanded = true;
      assignExpandedTrue(node, node.expanded);
    }
  });
};

export default assignExpandedTrue;
