export type VitePluginBoilerplateOptions = {
    /**
     * Base directory to watch. Files outside this directory are ignored.
     * Defaults to 'src'.
     */
    watchDir?: string;

    /**
     * Paths treated as pages — generates a default export.
     * Checked before component paths. Defaults to ['src/pages'].
     */
    pages?: string[];

    /**
     * Paths treated as components — generates a named export.
     * Defaults to ['src'].
     */
    components?: string[];

    /**
     * File extensions to watch. Defaults to ['.tsx', '.jsx'].
     */
    extensions?: string[];

    /**
     * Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
     */
    ignore?: (string | RegExp | ((filePath: string) => boolean))[];
};
