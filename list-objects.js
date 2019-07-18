'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.listObjects = undefined;

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

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const getObjects = (s3, bucket, continuationToken = null) => {
  const params = _extends(
    {},
    typeof bucket === 'string'
      ? { Bucket: bucket }
      : (0, _lodash2.default)(bucket, 'Filter')
  );

  continuationToken && (params.ContinuationToken = continuationToken);

  return s3.listObjectsV2(params).promise();
};

const getAllObjects = (s3, bucket) => {
  let allContent = [];

  const fetchMore = content => {
    Array.prototype.push.apply(allContent, content.Contents);
    if (content.isTruncated) {
      return getObjects(s3, bucket, content.NextContinuationToken).then(
        fetchMore
      );
    } else {
      return allContent;
    }
  };

  return getObjects(s3, bucket).then(fetchMore);
};

const listObjects = (exports.listObjects = (bucket, config = {}) => {
  _awsSdk2.default.config.update(config);

  const s3 = new _awsSdk2.default.S3();

  const buckets = [].concat(bucket);

  return Promise.all(
    buckets.map(bucket => {
      const bucketName = typeof bucket === 'string' ? bucket : bucket.Bucket;
      return getAllObjects(s3, bucket).then(content => {
        if (bucket.Filter) {
          content = (content || []).filter(bucket.Filter);
        }

        return { Contents: content, Name: bucketName };
      });
    })
  );
});
