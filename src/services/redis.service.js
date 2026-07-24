const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

//promisify chuyển đổi 1 hàm thành một hàm async await
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnxAsync).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2026_${productId}`
    const retryTimes = 10;
    const expireTime = 3000; // thoi gian tam lock lai

    for (let index = 0; index < retryTimes; index++) {
        //tao mot key, thang nao nam giu thi duoc vao thanh toan
        const result = await setnxAsync(key, expireTime); // se co value la 0 nếu chưa ai giữ và 1 nếu có người giữ
        if (result === 1) {
            // thao tac voi inventory
            const isReversation = await reservationInventory({ productId, quantity, cartId });
            if (isReversation.modifiedCount) {
                pexpire(key, expireTime);
                return key
            }
            return nill;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

    }
}


const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock)
}


module.exports = {
    acquireLock,
    releaseLock
}