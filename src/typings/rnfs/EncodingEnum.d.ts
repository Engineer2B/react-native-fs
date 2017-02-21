declare namespace rnfs {
	/**
	 * Encoding options.
	 */
	export enum EncodingEnum {
		/**
		 * The encoding is variable-length and uses 8-bit code units
		 */
		utf8,

		/**
		 * Originally based on the English alphabet,
		 * ASCII encodes 128 specified characters into seven-bit integers.
		 */
		ascii,

		/**
		 * Base64 is a group of similar binary-to-text encoding schemes
		 * that represent binary data in an ASCII string format by translating
		 * it into a radix-64 representation.
		 */
		base64
	}
}