'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.schema = undefined;

var _yup = require('yup');

var _yup2 = _interopRequireDefault(_yup);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const schema = (exports.schema = _yup2.default.object().shape({
  aws: _yup2.default
    .object()
    .shape({
      accessKeyId: _yup2.default.string().required(),
      secretAccessKey: _yup2.default.string().required(),
      region: _yup2.default.string(),
    })
    .default(() => ({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })),
  buckets: _yup2.default.array().required(),
}));
