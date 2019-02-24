import cherrypy

import pydevd
import ptvsd
import os

ptvsd.enable_attach(address=('0.0.0.0', 8081))

from cherrypy.process import plugins


class EndAllThreadsOnReaload(plugins.SimplePlugin):

    def start(self):
        self.bus.log("Starting plugin to handle hanging pydevd thread when reloading cherrypy")

    def stop(self):
        self.bus.log("Stopping pydevd threads...")
        pydevd.stoptrace()


force_pydevd_stop_plugin = EndAllThreadsOnReaload(cherrypy.engine)
force_pydevd_stop_plugin.subscribe()

import server
