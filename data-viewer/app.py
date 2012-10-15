#!/usr/local/bin/python2.7
# encoding: utf-8

from __future__ import absolute_import
import time
import flask as FK
from redis import Redis as redis
from contextlib import closing
import numpy as NP

REDIS_DB = 2
DEBUG = True
SECRET_KEY = "!Erew9reQir549&3d394W*"
USERNAME = None
PASSWORD = None
REDIS_HOST = 'localhost'
PORT = 6379

def connect_db():
	return redis(db=REDIS_DB, host=REDIS_HOST, port=PORT)


@app.before_request
def before_request():
	FK.g.db = connect_db()


@app.route('/_playPro')
def playPro():
	return FK.render_template('playPro.html')


@app.route('/_fromDB0')
def fromDB0():
	x = NP.linspace(0, 5, 500)
	y = 3*NP.sin(x/2.2) + 1
	nx = .03 * NP.random.randn(500)
	y += nx
	d = y.tolist()
	return FK.jsonify(result = d)


if __name__ == '__main__':
	app.debug = True
	app.run()
