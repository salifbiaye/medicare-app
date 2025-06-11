import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Configuration pour les modules non-web compatibles
    if (!isServer) {
      // Config côté client uniquement
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        zlib: false,
        http: false,
        https: false,
        canvas: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }
     // Ajouter le support pour les fichiers .wasm
     config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });


    // Ignorer les modules problématiques
    config.externals = [
      ...config.externals || [],
      {'./charlswasm_decode.js': 'charlswasm_decode'},
    ];
    return config;
  },
};

export default nextConfig;
