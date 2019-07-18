'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.downloadImageFile = undefined;

let downloadImageFile = (exports.downloadImageFile = (() => {
  var _ref = _asyncToGenerator(function*(
    node,
    { store, cache, createNode, touchNode }
  ) {
    const clone = Object.assign({}, node);
    let imageNodeId;
    const cacheKey = clone.id;

    const cacheData = yield cache.get(cacheKey);

    if (cacheData && clone.LastModified === cacheData.LastModified) {
      imageNodeId = cacheData.imageNodeId;
      touchNode(cacheData.imageNodeId);
    }

    if (!imageNodeId) {
      try {
        const imageNode = yield (0,
        _gatsbySourceFilesystem.createRemoteFileNode)({
          url: clone.Url,
          store,
          cache,
          createNode,
        });

        if (imageNode) {
          imageNodeId = imageNode.id;

          yield cache.set(cacheKey, {
            imageNodeId,
            LastModified: clone.LastModified,
          });
        }
      } catch (e) {} // ignore
    }

    if (imageNodeId) {
      clone.localFile___NODE = imageNodeId;
    }

    return clone;
  });

  return function downloadImageFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            }
          );
        }
      }
      return step('next');
    });
  };
}
