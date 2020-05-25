/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'
import http from 'http'
import app from '../src/app'
import { request } from '../src/lib/request.interface'

chai.use(chaiHttp)
const { expect } = chai

const worker = chai
  .request((req: request, res: http.ServerResponse) => {
    app.engine(req as request, res as http.ServerResponse)
  })
  .keepOpen()

describe(' => Testing Framework Components', () => {
  //   testing connection
  it('testing normal route operation', (done) => {
    try {
      worker.get('/home').then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.error).to.be.false
        done()
      })
    } catch (error) {
      done(error)
    }
  })

  it('testing subsequent middleware usage', (done) => {
    try {
      worker.get('/multiple').then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.error).to.be.false
        expect(resp.body.finished).to.be.true
        done()
      })
    } catch (error) {
      done(error)
    }
  })

  it('testing param extraction from request', (done) => {
    try {
      worker.get('/params/apple/mango/banana/end').then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.body.one).to.equal('apple')
        expect(resp.body.two).to.equal('mango')
        expect(resp.body.three).to.equal('banana')
        done()
      })
    } catch (error) {
      done(error)
    }
  })
})
