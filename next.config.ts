import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental:{
    turbo:{
    }
  },
  images: {
    remotePatterns:[
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8099',
      }
    ]
},
};

export default withNextIntl(nextConfig);

