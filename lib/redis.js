import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis-15377.c212.ap-south-1-1.ec2.redns.redis-cloud.com:15377');

export default redis;
