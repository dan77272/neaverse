/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/home/home', // The :path parameter isn't used here so will be automatically passed in the query
      },
      {
        source: '/register',
        destination: '/register/register', // The :path parameter isn't used here so will be automatically passed in the query
      },
    ]
  }
}
