'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.sourceNodes = undefined;

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

let sourceNodes = (exports.sourceNodes = (() => {
  var _ref = _asyncToGenerator(function*(
    { boundActionCreators, store, cache },
    pluginOptions
  ) {
    const { createNode, touchNode } = boundActionCreators;

    const {
      aws: awsConfig,
      buckets: bucketsConfig,
    } = yield _pluginOptions.schema.validate(pluginOptions);

    const buckets = yield (0, _listObjects.listObjects)(
      bucketsConfig,
      awsConfig
    );

    yield Promise.all(
      buckets.map(function(_ref2, index) {
        let { Contents } = _ref2,
          rest = _objectWithoutProperties(_ref2, ['Contents']);

        return Promise.all(
          Contents.map(
            (() => {
              var _ref3 = _asyncToGenerator(function*(content) {
                const { Key } = content;
                const node = _extends({}, rest, content, {
                  Url: `https://s3.amazonaws.com/${rest.Name}/${Key}`,
                  id: `s3-${Key}`,
                  children: [],
                  parent: '__SOURCE__',
                  internal: {
                    type: 'S3Object',
                    contentDigest: createContentDigest(content),
                    content: JSON.stringify(content),
                  },
                });

                createNode(node);

                if (isImage(Key)) {
                  const Extension = Key.split('.').pop();
                  const imageNode = yield (0,
                  _downloadImageFile.downloadImageFile)(
                    _extends({}, node, {
                      Extension,
                      id: `s3-image-${Key}`,
                      internal: {
                        type: 'S3Image',
                        contentDigest: createContentDigest(content),
                        content: JSON.stringify(content),
                      },
                    }),
                    {
                      store,
                      cache,
                      createNode,
                      touchNode,
                    }
                  );
                  createNode(imageNode);
                }
              });

              return function(_x3) {
                return _ref3.apply(this, arguments);
              };
            })()
          )
        );
      })
    );

    return buckets;
  });

  return function sourceNodes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _listObjects = require('./list-objects');

var _pluginOptions = require('./plugin-options');

var _downloadImageFile = require('./download-image-file');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

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

const createContentDigest = obj =>
  _crypto2.default
    .createHash('md5')
    .update(JSON.stringify(obj))
    .digest('hex');

const isImage = object => /\.(jpe?g|png|webp|tiff?)$/i.test(object);
const getBucketName = () => {};
