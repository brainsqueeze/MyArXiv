import cherrypy
import json
import sys

sys.path.insert(0, '/app/src/src')

from src import service


class App(object):

    @cherrypy.expose
    def default(self, *args, **kwargs):
        # Locally we allow CORS on everything
        cherrypy.response.headers['Content-Type'] = "application/json"
        # If an ORIGIN is provided in the headers, we use that as the allow origin value
        if 'ORIGIN' in cherrypy.request.headers:
            cherrypy.response.headers['Access-Control-Allow-Origin'] = cherrypy.request.headers['ORIGIN']
        else:
            cherrypy.response.headers['Access-Control-Allow-Origin'] = "*"

        cherrypy.response.headers['Access-Control-Allow-Methods'] = "POST, OPTIONS"

        # Prep/Map parameters for calling the lambda function
        event = {}
        context = {}

        # If it's a POST request, we need to read in the body from the request stream
        if cherrypy.request.method == 'POST':
            cl = cherrypy.request.headers['Content-Length']
            # event['body'] = cherrypy.request.body.read(int(cl))
            event['body'] = json.loads(cherrypy.request.body.read(int(cl)).decode('utf8'))

        event['path'] = cherrypy.request.path_info
        event['httpMethod'] = cherrypy.request.method
        event['queryStringParameters'] = cherrypy.request.params
        event['headers'] = {}

        if 'Accept' in cherrypy.request.headers:
            event['headers']['Accept'] = cherrypy.request.headers['Accept']

        # For local development, always set the requester source ip as 127.0.0.1. In AWS, this will
        # automatically be provided to the API lambda function as part of the requestContext
        event['requestContext'] = {
            'identity': {
                'sourceIp': '127.0.0.1'
            }
        }

        try:
            # Invoke the lambda function
            result = service.handler(event, context)
            message = result['body']
            cherrypy.response.status = result['statusCode']

            # If a cookie was returned from the lambda function, pass it back ot the caller
            if 'Set-Cookie' in result['headers']:
                print('Found cookie! Relaying it in response')
                cherrypy.response.headers['Set-Cookie'] = result['headers']['Set-Cookie']

        except Exception as e:
            # Print out some basic info about any lambda function invocation failure
            print('Error invoking lambda')
            print(e)

            # Return a message to the caller with details so they know it's a cherrypy/local webserver related issue
            message = {"message": "Error invoking lambda"}
            message = json.dumps(message)

        return message.encode('utf8')


if __name__ == '__main__':
    cherrypy.config.update({
        'server.socket_host': '0.0.0.0',
        "server.socket_port": 9090
    })
    cherrypy.tree.mount(App(), '/')

    cherrypy.engine.signals.subscribe()
    cherrypy.engine.start()
    cherrypy.engine.block()
else:
    cherrypy.config.update({'server.socket_host': '0.0.0.0'})
    cherrypy.tree.mount(App(), '/')
