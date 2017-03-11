interface Promise<T> {
	/**
	 * Pass a handler that will be called regardless of this promise's fate. 
	 * @param {Function} handler The callback to execute regardless of this promise's fate.
	 * @returns A new promise chained from this promise.
	 */
	finally(handler: () => void): Promise<T>;

  /**
   * Like calling `.then`, but the fulfillment value or rejection reason is assumed to be an array,
	 * which is flattened to the formal parameters of the handlers.
   */
  spread<U, W>(fulfilledHandler: (...values: W[]) => U | PromiseLike<U>): Promise<U>;
  spread<U>(fulfilledHandler: Function): Promise<U>;
}