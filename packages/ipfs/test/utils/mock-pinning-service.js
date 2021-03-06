'use strict'

const http = require('http')
const { setup } = require('mock-ipfs-pinning-service')

const defaultPort = 1139
const defaultToken = 'secret'

class PinningService {
  /**
   * @param {Object} options
   * @param {number} [options.port]
   * @param {string|null} [options.token]
   * @returns {Promise<PinningService>}
   */
  static async start ({ port = defaultPort, token = defaultToken } = {}) {
    const service = await setup({ token })
    const server = http.createServer(service)
    await new Promise(resolve => server.listen(port, resolve))

    return new PinningService({ server, host: '127.0.0.1', port, token })
  }

  /**
   * @param {PinningService} service
   * @returns {Promise<void>}
   */
  static stop (service) {
    return new Promise((resolve, reject) => {
      service.server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  constructor ({ server, host, port, token }) {
    this.server = server
    this.host = host
    this.port = port
    this.token = token
  }

  get endpoint () {
    return `http://${this.host}:${this.port}`
  }
}

module.exports = PinningService
