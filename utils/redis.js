import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * A Redis client class that can be used to interact with Redis.
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on('error', (err) => {
      console.log(err);
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Determines if the client is alive by pinging it.
   *
   * @return {boolean} Returns true if the client is alive, false otherwise.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Sets a key-value pair and sets an expiry time for the key.
   *
   * @param {string} key - the key to set the value for
   * @param {any} value - the value to set for the key
   * @param {number} expiry - the time in seconds for the key to expire
   * @return {Promise<void>} - a Promise that resolves when the key-value pair
   * is set and the expiry is set
   */
  async set(key, val, dur) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, val, 'EX', dur);
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param {string} key - the key to retrieve the value for
   * @return {*} the value associated with the given key
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const val = await getAsync(key);
    return val;
  }

  /**
   * Deletes the specified key using asynchronous delete method.
   *
   * @param {any} key - the key to be deleted
   * @return {Promise} A promise that resolves after the deletion is complete
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;