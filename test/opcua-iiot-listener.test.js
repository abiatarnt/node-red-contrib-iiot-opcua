/**
 * Original Work Copyright 2014 IBM Corp.
 * node-red
 *
 * Copyright (c) 2018 Klaus Landsdorf (http://bianco-royal.de/)
 * All rights reserved.
 * node-red-contrib-iiot-opcua
 *
 **/

'use strict'

jest.setTimeout(5000)

// iiot opc ua nodes
var injectNode = require('node-red/nodes/core/core/20-inject')
var functionNode = require('node-red/nodes/core/core/80-function')
var inputNode = require('../src/opcua-iiot-listener')

var helper = require('node-red-node-test-helper')
helper.init(require.resolve('node-red'))

var listenerNodesToLoad = [injectNode, functionNode, inputNode]

describe('OPC UA Listener monitoring node Unit Testing', function () {
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

  describe('Listener node', function () {
    it('should be loaded', function (done) {
      helper.load(listenerNodesToLoad, [
        {
          'id': 'bee3e3b0.ca1a08',
          'type': 'OPCUA-IIoT-Listener',
          'connector': '',
          'action': 'subscribe',
          'queueSize': 10,
          'name': 'TestListener',
          'justValue': true,
          'showStatusActivities': false,
          'showErrors': false,
          'wires': [[]]
        }
      ],
      function () {
        let nodeUnderTest = helper.getNode('bee3e3b0.ca1a08')
        expect(nodeUnderTest.name).toBe('TestListener')
        expect(nodeUnderTest.action).toBe('subscribe')
        done()
      })
    })
  })
})