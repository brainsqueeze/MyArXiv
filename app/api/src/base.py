from urllib import request, parse

from xml.etree import ElementTree
import json

import datetime


class RequestBuilder(object):

    def __init__(self):
        self.__parameters = {
            "search_query": "all",
            "start": 0,
            "max_results": 100,
            "sortBy": "submittedDate",
            "sortOrder": "descending"
        }

        self.__categories = {
            "cs": {
                "machine_learning": "cs.LG",
                "natural_language_processing": "cs.CL",
                "artificial_intelligence": "cs.AI",
                "computer_vision": "cs.CV"
            },
            "hep": {
                "HEP-phenomenology": "hep-ph",
                "HEP-theory": "hep-th",
                "HEP-experiment": "hep-ex"
            }
        }

    def __check_key(self, key):
        assert isinstance(key, str)
        return key in self.__parameters

    def set_query(self, query_string="all", remove=False):
        assert isinstance(query_string, str)

        if query_string != "all" and self.__check_key("search_query"):
            self.__parameters["search_query"] = query_string
        if remove and self.__check_key("search_query"):
            self.__parameters.pop("search_query")
        return self

    def set_id_list(self, id_lists):
        assert isinstance(id_lists, list)

        self.__parameters["id_list"] = ",".join(id_lists)
        return self

    def set_num_results(self, num_results=0, remove=False):
        assert isinstance(num_results, int)

        if num_results > 0 and self.__check_key("max_results"):
            self.__parameters["max_results"] = num_results
        if remove and self.__check_key("max_results"):
            self.__parameters.pop("max_results")
        return self

    def search_by_category(self, category, sub_category):
        if sub_category in self.__categories.get(category, {}):
            self.set_query(query_string=self.__categories[category][sub_category])
        else:
            self.set_query(query_string="all")
        return self

    @property
    def parameters(self):
        return self.__parameters


class ResponseHandler(object):

    def __init__(self, payload, method='GET'):
        self.__base = "http://export.arxiv.org/api/query"
        self.__name = "atom"
        self.__namespace = {self.__name: "http://www.w3.org/2005/Atom"}
        self.__open_search = {"open": "http://a9.com/-/spec/opensearch/1.1/"}

        reverse_lookup = {
            "cs.LG": "Computer Science: Machine Learning",
            "cs.CL": "Computer Science: Natural Language Processing",
            "cs.AI": "Computer Science: Artificial Intelligence",
            "cs.CV": "Computer Science: Computer Vision",
            "hep-ex": "High Energy Physics: Experiment",
            "hep-ph": "High Energy Physics: Phenomenology",
            "hep-tg": "High Energy Physics: Theory"
        }
        self.category = reverse_lookup[payload["search_query"]]

        if method.lower() == 'post':
            self.__response = self.__post(payload=payload)
        else:
            self.__response = self.__get(payload=payload)

    def __post(self, payload):
        assert isinstance(payload, dict)

        req = request.Request(
            url=self.__base,
            data=json.dumps(payload).encode('utf8'),
            headers={"Content-Type": "application/xml"}
        )

        response = request.urlopen(req)
        return response.read().decode('utf8')

    def __get(self, payload):
        assert isinstance(payload, dict)

        url = f"{self.__base}?{parse.urlencode(payload)}"
        req = request.Request(url, headers={"Content-Type": "application/xml"})
        return request.urlopen(req).read().decode('utf8')

    @staticmethod
    def clean(text):
        if isinstance(text, str):
            return text.strip()
        return text

    def _format_json(self, entry):
        assert isinstance(entry, ElementTree.Element)

        name = self.__name
        space = self.__namespace
        article = {
            "urls": [self.clean(item.text) for item in entry.findall(f".//{name}:id", namespaces=space)],
            "dates": [self.clean(item.text) for item in entry.findall(f".//{name}:published", namespaces=space)],
            "titles": [self.clean(item.text) for item in entry.findall(f".//{name}:title", namespaces=space)],
            "summaries": [self.clean(item.text) for item in entry.findall(f".//{name}:summary", namespaces=space)],
            "categories": [
                self.clean(item.attrib["term"])
                for item in entry.findall(f".//{name}:category", namespaces=space)
            ],
            "authors": [
                self.clean(author.find(f".//{name}:name", namespaces=space).text)
                for author in entry.findall(f".//{name}:author", namespaces=space)
            ]
        }

        return article

    def parse(self):
        root = ElementTree.fromstring(self.xml)
        name = self.__name
        today = datetime.datetime.now()
        articles = []

        for doc in map(self._format_json, root.findall(f".//{name}:entry", namespaces=self.__namespace)):
            dates = doc["dates"]
            if not dates:
                continue

            most_recent = datetime.datetime.strptime(dates[0], '%Y-%m-%dT%H:%M:%SZ')

            if (today - most_recent).days <= 4:
                articles.append(doc)

        total_results = len(articles)
        response = {
            "total_results": total_results,
            "search_category": self.category,
            "articles": articles
        }
        return response

    @property
    def xml(self):
        return self.__response
