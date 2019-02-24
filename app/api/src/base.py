from urllib import request
import json


class RequestBuilder(object):

    def __init__(self):
        self.base = "http://export.arxiv.org/api/query"
        self.__parameters = {
            "search_query": "all",
            "start": 0,
            "max_results": 10,
            "sortBy": "submittedDate",
            "sortOrder": "descending"
        }

        self.__categories = {
            "computer_science": {
                "machine_learning": "cs.LG",
                "natural_language_processing": "cs.CL",
                "artificial_intelligence": "cs.AI",
                "computer_vision": "cs.CV"
            },
            "physics": {
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
    def url(self):
        return self.base

    @property
    def parameters(self):
        return self.__parameters


class ResponseHandler(object):

    def __init__(self, url, payload):
        self.__response = self.__post(url=url, payload=payload)

    @staticmethod
    def __post(url, payload):
        assert isinstance(url, str)
        assert isinstance(payload, dict)

        req = request.Request(
            url=url,
            data=json.dumps(payload).encode('utf8'),
            headers={"content-type": "application/xml"}
        )

        response = request.urlopen(req)
        return response.read().decode('utf8')

    @property
    def raw_response(self):
        return self.__response