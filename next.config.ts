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

