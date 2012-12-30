

import os
import datetime
from tornado import web
from tornadio2 import SocketConnection, TornadioRouter, SocketServer, event


ROOT = os.path.normpath(os.path.dirname(__file__))


class IndexHandler(web.RequestHandler):
	"""
	regular HTTP handler to serve the ping page
	"""

	def get(self):
		self.render('templates/index.html')


class SocketIOHandler(web.RequestHandler):

	def get(self):
		self.render('static/socket.io.js')


class StatsHandler(web.RequestHandler):

	def get(self):
		self.render('templates/plots1.html')


class PingConnection(SocketConnection):

	@event
	def ping(self, client):
		now = datetime.datetime.now()
		return client, [now.hour, now.minute, now.second, now.microsecond / 500]

	@event
	def stats(self):
		return self.session.server.stats.dump()


# create tornadio router
PingRouter = TornadioRouter(PingConnection,
				dict(enabled_protocols=['websocket', 'xhr-polling',
					'jsonp-polling', 'htmlfile']))

# create socket application
application = web.Application(
	PingRouter.apply_routes([
	                        (r"/", IndexHandler),
							(r"/stats", StatsHandler),
							(r"/socket.io.js", SocketIOHandler)]),
	flash_policy_port = 843,
	debug=True,
	static_path=os.path.join(ROOT, "static"),
	flash_policy_file = os.path.join(ROOT, 'flashpolicy.xml'),
	socket_io_port = 8001,
)

if __name__ == "__main__":
	import logging
	logging.getLogger().setLevel(logging.DEBUG)
	# create & start tornadio server
	SocketServer(application)
