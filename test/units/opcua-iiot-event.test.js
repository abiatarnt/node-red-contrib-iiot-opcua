/**
 * Original Work Copyright 2014 IBM Corp.
 * node-red
 *
 * Copyright (c) 2022 DATATRONiQ GmbH (https://datatroniq.com)
 * Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 * All rights reserved.
 * node-red-contrib-iiot-opcua
 *
 **/

'use strict'

// jest.setTimeout(30000)

var injectNode = require('@node-red/nodes/core/common/20-inject')
var inputNode = require('../../src/opcua-iiot-event')

var helper = require('node-red-node-test-helper')
var portHelper = require('./../helper/test-helper-extensions')
helper.init(require.resolve('node-red'))

var testFlows = require('./flows/event-flows')

let testingOpcUaPort = 0

describe('OPC UA Event node Unit Testing', function () {

  beforeAll(() => {
    testingOpcUaPort = 57450
  })

  beforeEach(function (done) {
    helper.startServer(function () {
      done()
    })
  })

  afterEach(function (done) {
    helper.unload().then(function () {
      helper.stopServer(function () {
        done()
      })
    }).catch(function () {
      helper.stopServer(function () {
        done()
      })
    })
  })

  describe('Event node', function () {
    it('should load with basic settings', function (done) {
      helper.load(
        [injectNode, inputNode],
        testFlows.testUnitEventFlow,
        function () {
          let nodeUnderTest = helper.getNode('n3evf1')
          expect(nodeUnderTest.name).toBe('TestName')
          expect(nodeUnderTest.eventTypeLabel).toBe('BaseTypeEvent')
          expect(nodeUnderTest.eventType).toBe('i=2041')
          expect(nodeUnderTest.usingListener).toBe(true)
          expect(nodeUnderTest.queueSize).toBe(10)
          done()
        })
    })

    it('should get a message with payload', function (done) {
      helper.load([injectNode, inputNode], testFlows.testUnitEventFlow, function () {
        let n2 = helper.getNode('n2evf1')
        n2.on('input', function (msg) {
          expect(msg.payload).toBeDefined()
          done()
        })
      })
    })

    it('should verify a message for event parameters', function (done) {
      helper.load([injectNode, inputNode], testFlows.testUnitEventFlow, function () {
        let n4 = helper.getNode('n4evf1')
        n4.on('input', function (msg) {
          expect(msg.payload.eventType).toBeDefined()
          expect(msg.payload.uaEventFilter).toBeDefined()
          expect(msg.payload.uaEventFields).toBeDefined()
          expect(msg.payload.queueSize).toBe(10)
          expect(msg.payload.interval).toBe(1000)
          /* payload: { eventType: 'i=2041',
            eventFilter: EventFilter { selectClauses: [Array], whereClause: [ContentFilter] }, eventFields: [ 'EventId', 'SourceName', 'Message', 'ReceiveTime' ],
            queueSize: 10,
            interval: 1000 }) */
          done()
        })
      })
    })
  })
})
