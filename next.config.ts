import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost:3000',
    '192.168.1.7:3000',
    '192.168.1.7',
    '10.136.33.33:3000',
    '10.136.33.33'
  ]
};

export default withNextIntl(nextConfig);
