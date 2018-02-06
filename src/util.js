import _ from 'lodash';

const util = {
  // make babel plugin/preset absolute path
  babel(type, name) {
    if (Array.isArray(name)) {
      return name.map(n => util.babel(type, n));
    } else if (typeof name === 'object') {
      return [
        require.resolve([
          'babel',
          type,
          name.name,
        ].join('-')),
        name.options,
      ];
    }
    return require.resolve([
      'babel',
      type,
      name,
    ].join('-'));
  },
  entryChunks(entry) {
    if (Array.isArray(entry)) {
      // entry: ['a.js', 'b.js']
      return entry;
    }
    if (typeof entry === 'string') {
      // entry: 'a.js'
      return [entry];
    } else if (_.isPlainObject(entry)) {
      // entry: {bundle1: 'a.js', bundle2: ['a.js', 'b.js']}
      const result = [];
      Object.keys(entry).forEach((key) => {
        result.push([key]);
      });
      return result;
    }
    return [];
  },
};

export default util;
