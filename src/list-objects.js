import AWS from 'aws-sdk';
import omit from 'lodash.omit';

const getObjects = (s3, bucket, continuationToken = null) => {
  const params = {
    ...(typeof bucket === 'string'
      ? { Bucket: bucket }
      : omit(bucket, 'Filter')),
  };

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

export const listObjects = (bucket, config = {}) => {
  AWS.config.update(config);

  const s3 = new AWS.S3();

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
};
