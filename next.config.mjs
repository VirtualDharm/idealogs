import withTM from 'next-transpile-modules';

const nextConfig = {
  reactStrictMode: true,
};

export default withTM(['@jitsi/react-sdk'])(nextConfig);
