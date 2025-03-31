import type { ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = {
    test: {
        include: ["test/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ['cobertura', 'text', 'lcov', 'html'],
            include: ["src/**/*.ts"],
        },
    },
}

export default config;
