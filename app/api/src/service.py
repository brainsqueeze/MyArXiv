from base import RequestBuilder, ResponseHandler

import json
import re


def respond(err, res=None):
    try:
        body = json.dumps(res, default=str)

        if err:
            body = json.dumps({
                'success': False,
                'message': str(err)
            })

        result = {
            'statusCode': '400' if err else '200',
            'body': body,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        }
        return result

    except Exception as e:
        return {
            'statusCode': '400',
            'body': str(e),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        }


def handler(event, context):
    method = event['httpMethod']
    path = event['path']

    if method == 'OPTIONS':
        return respond(None, res={})

    # If body exists and it's a string, deserialize it
    body = event["body"] if "body" in event else event["queryStringParameters"]
    if isinstance(body, str):
        body = json.loads(body)

    if re.match(r"/api/search$", path, re.M | re.I):
        arXiv = RequestBuilder()
        arXiv.search_by_category(category="computer_science", sub_category="natural_language_processing")

        arXiv_response = ResponseHandler(payload=arXiv.parameters)
        print(arXiv_response.raw_response)
    return
