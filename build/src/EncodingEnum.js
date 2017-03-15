/**
 * Encoding options.
 */
/**
 * Encoding options.
 */ export var EncodingEnum;
(function (EncodingEnum) {
    /**
     * The encoding is variable-length and uses 8-bit code units
     */
    EncodingEnum[EncodingEnum["utf8"] = 0] = "utf8";
    /**
     * Originally based on the English alphabet,
     * ASCII encodes 128 specified characters into seven-bit integers.
     */
    EncodingEnum[EncodingEnum["ascii"] = 1] = "ascii";
    /**
     * Base64 is a group of similar binary-to-text encoding schemes
     * that represent binary data in an ASCII string format by translating
     * it into a radix-64 representation.
     */
    EncodingEnum[EncodingEnum["base64"] = 2] = "base64";
})(EncodingEnum || (EncodingEnum = {}));
