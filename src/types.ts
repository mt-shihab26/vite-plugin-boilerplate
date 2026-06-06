export type BoilerplateRule = {
    match: string | RegExp | ((filePath: string) => boolean);
    template: string | ((componentName: string, filePath: string) => string);
};

export type VitePluginBoilerplateOptions = {
    /**
     * File extensions to watch. Defaults to ['.tsx', '.jsx'].
     */
    extensions?: string[];

    /**
     * Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
     */
    ignore?: (string | RegExp | ((filePath: string) => boolean))[];

    /**
     * Rules evaluated in order — first match wins.
     * Defaults to: pages/ → default export, everything else → named export.
     */
    rules?: BoilerplateRule[];

    /**
     * Derive the React component name from a file path.
     * Defaults to PascalCase of the filename; index files use the parent directory name.
     */
    getComponentName?: (filePath: string) => string;
};
