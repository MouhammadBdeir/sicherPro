

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        // Example options (add only if required)
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
        resolveAlias: {
            underscore: 'lodash',
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/v0/b/**',
            },
        ],
    },
};

module.exports = nextConfig;
