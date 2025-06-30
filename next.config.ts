import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental:{
      serverActions: {
      bodySizeLimit: '5mb',
    },
    turbo:{
    }
  },
  images: {
    dangerouslyAllowSVG: true, 
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns:[
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8099',
      },
      {
        protocol: 'https',
        hostname: 'api.humamsa.com',
        port: '',
        pathname: '/Documents/**',
      },
     {
        protocol: 'https',
        hostname: 'demo.myfatoorah.com',
        port: '',
        pathname: '/imgs/payment-methods/**',
        search: '',
      },
    ]
},
};

export default withNextIntl(nextConfig);

