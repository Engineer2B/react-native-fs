declare namespace native.iOS {
	/**
	 * Options for file uploads.
	 */
	export interface UploadOptions {
		/**
		 * URL to upload file to.
		 */
		toUrl: string;

		/**
		 * An array of objects with the file
		 * information to be uploaded.
		 */
		files: UploadFileItem[];

		/**
		 * An object of headers to be passed to the server uploaded.
		 */
		headers?: { [name: string]: string };
		/**
		 * An object of fields to be passed
		 * to the server.
		 */
		fields?: { [name: string]: string };

		/**
		 * Default is 'POST', supports 'POST' and 'PUT'.
		 */
		method?: string;
	}
}