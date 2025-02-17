import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 0 });
  }

  set(key: string, value: any): boolean {
    return this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  flushAll(): void {
    this.cache.flushAll();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}
