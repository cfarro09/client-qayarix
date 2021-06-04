const isProd = true
// URLAPI=https://api2.qayarix.com
// URLAPI=http://144.217.253.15:5000
// URLAPI"http://144.217.77.73:9089"


module.exports = {
    assetPrefix: '',
    publicRuntimeConfig: {
        staticFolder: ''
   },
    env: {

        urlapi: isProd ? "https://api3.qayarix.com" : "http://144.217.77.73:9089"
    }
}
