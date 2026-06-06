export type VitePluginBoilerplateOptions = {
    /**
     * Base directory to watch. Files outside this directory are ignored.
     */
    watchDir: string;

    /**
     * Subdirectory or subdirectories (relative to watchDir) treated as pages — generates a default export.
     * Files inside watchDir that don't match any page path get a named export.
     * If not provided, all files get a named export.
     */
    pages?: string | string[];

    /**
     * File extensions to watch. Defaults to ['.tsx', '.jsx'].
     */
    extensions?: string[];

    /**
     * Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
     */
    ignore?: (string | RegExp | ((filePath: string) => boolean))[];
};
