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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvQ2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxBQUhBOztHQUVHLENBQ0gsTUFBTTtJQUNKOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQVk7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRiJ9