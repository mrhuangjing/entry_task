module.exports = {
    port: 8080,
    proxy: {
        '/api/': {
            target: 'http://localhost:3000',
            pathRewrite: { '^/': '/' },
            changeOrigin: true,     // changes the origin of the host header to the target URL
            secure: false           //  if you want to verify the SSL Certs
        }
    },
    historyApiFallback: true,
    useDllBuild: true,
    dllList: ['react', 'react-dom', 'react-router-dom', 'antd-mobile', 'react-redux']
}