from base import RequestBuilder, ResponseHandler
from database import update_status, get_like_statuses, create_tables, HAS_DATABASE

import json
import re

if HAS_DATABASE:
    create_tables()


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
                'Access-Control-Allow-Header': 'Content-Type',
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
                'Access-Control-Allow-Header': 'Content-Type',
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
    assert isinstance(body, dict)

    if re.match(r"/api/search$", path, re.M | re.I):
        body = body.get("payload", {})

        # fetch results from the ArXiv API
        arXiv = RequestBuilder()
        arXiv.search_by_category(
            category=body.get("field", "cs"),
            sub_category=body.get("subField", "natural_language_processing")
        )

        arXiv_response = ResponseHandler(payload=arXiv.parameters)
        response = arXiv_response.parse()

        # if logging to a database, retrieve previously rated articles to populate the metadata
        if HAS_DATABASE and response.get("articles", []):
            # only grab the xxxx.xxxx part of the url
            id_finder = re.compile(r"(\d{4,}\.\d{4,})(v\d)").findall
            article_ids = [id_finder(article["urls"][0])[0][0] for article in response["articles"]]
            statuses = get_like_statuses(article_ids=article_ids)
            response["articles"] = [
                {**article, **{"interested": statuses.get(id_finder(article["urls"][0])[0][0])}}
                for article in response["articles"]
            ]

        output = {"success": True, "data": response}
        return respond(None, res=output)
    elif re.match(r"/api/rate$", path, re.M | re.I):
        print(json.dumps(body, indent=2))
        update_status(
            article_id=body["articleId"],
            status=body["interested"],
            title=body["title"],
            contents=body["content"],
            category=body["categories"]
        )
        return respond(None, {"Message": "Preference registered"})
    else:
        results = {'message': 'endpoint not found'}
        return respond(None, results)
