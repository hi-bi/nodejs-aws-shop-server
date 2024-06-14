import { Duration } from 'aws-cdk-lib';

export const BEHAVIORS = [
  // All .xml, .html, .css files should be cached for 1 day,
  // with gzip and brotli compression enabled
  {
    origin: "s3",
    paths: ['*.xml', '*.html', '*.css'],
    defaultTtl: Duration.days(1),
    gzip: true,
    brotli: true,
  },

  // All .jpg, .png, .mpeg. .gif files should be cached for 3 days
  {
    origin: "s3",
    paths: ['*.jpg', '*.png', '*.mpeg', '*.gif'],
    cachePolicyName: 'CacheImages',
    defaultTtl: Duration.days(3),
  },

  // To test if the caching works,
  // cache test/cache.test for min 5, max 15, default 10 seconds
  // with gzip and brotli compression enabled
  {
    origin: "s3",
    paths: ['test/cache.test'],
    defaultTtl: Duration.seconds(10),
    minTtl: Duration.seconds(5),
    maxTtl: Duration.seconds(15),
    gzip: true,
    brotli: true,    
  },
  // All .txt files should be cached for 1 day,
  // with gzip and brotli compression enabled
  {
    origin: "s3",
    paths: ['.txt'],
    defaultTtl: Duration.days(1),
    gzip: true,
    brotli: true,
  },
];