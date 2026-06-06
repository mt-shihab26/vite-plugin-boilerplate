export type TOptions = {
    /**
     * Base directory to watch. Files outside this directory are ignored.
     */
    watchDir: string;

    /**
     * Subdir(s) relative to watchDir for pages (default export). Everything else gets a named export.
     */
    pages?: string | string[];

    /**
     * Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
     */
    ignore?: (string | RegExp | ((filePath: string) => boolean))[];
};
