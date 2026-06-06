export type VitePluginBoilerplateOptions = {
    /**
     * Base directory to watch. Files outside this directory are ignored.
     * Defaults to 'src'.
     */
    watchDir?: string;

    /**
     * Paths treated as pages — generates a default export.
     * Any file inside watchDir that doesn't match a page path gets a named export.
     * Defaults to ['src/pages'].
     */
    pages?: string[];

    /**
     * File extensions to watch. Defaults to ['.tsx', '.jsx'].
     */
    extensions?: string[];

    /**
     * Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
     */
    ignore?: (string | RegExp | ((filePath: string) => boolean))[];
};
