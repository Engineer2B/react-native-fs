/**
 * Generic checks.
 */
/**
 * Generic checks.
 */ export class Check {
    /**
     * Asserts at design-time that a state is unreachable.
     * @param {never} value Some value.
     * @returns {never} Will return an error in the event
     * that the method is evaluated.
     */
    static assertUnreachable(value) {
        throw new Error(`Didn't expect a to get here`);
    }
}
