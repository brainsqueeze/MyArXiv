import sqlite3
import os

HAS_DATABASE = os.getenv("HAS_DATABASE")


class ConnectionNotDefined(Exception):
    pass


class DatabaseFileDoesNotExist(Exception):
    pass


class SqliteDatabase(object):

    def __init__(self):
        if not os.getenv("SQLITE_PATH"):
            raise DatabaseFileDoesNotExist("Must define path to existing folder for SqLite file")

        self.__connection, self.__cursor = self.__connect()

    @staticmethod
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def __connect(self,):
        connection = sqlite3.connect(database="MyArXivDB/arxivdb.db3")
        connection.row_factory = self.dict_factory
        return connection, connection.cursor()

    def execute(self, query, data=None, silent=False):
        if data is not None:
            self.__cursor.execute(query, data)
        else:
            self.__cursor.execute(query)

        if silent:
            self.__connection.commit()
            return True
        return self.__cursor

    def execute_many(self, query, array, commit=True):
        self.__cursor.executemany(query, array)
        if commit:
            self.__connection.commit()

    def teardown(self):
        self.__cursor.close()
        self.__connection.close()


def create_tables():
    db = SqliteDatabase()

    create = "CREATE TABLE IF NOT EXISTS logs_lite (article_id VARCHAR(20) PRIMARY KEY, like_status INTEGER);"
    db.execute(create, silent=True)

    create = """
    CREATE TABLE IF NOT EXISTS logs_content (
        article_id VARCHAR(20) PRIMARY KEY,
        title TEXT,
        contents TEXT,
        category VARCHAR(50)
    );
    """
    db.execute(create, silent=True)
    db.teardown()
    return


def get_like_statuses(article_ids):
    db = SqliteDatabase()

    query = f"""
    SELECT article_id, like_status
    FROM logs_lite
    WHERE article_id IN ({', '.join(['?'] * len(article_ids))});
    """

    records = {}
    for row in db.execute(query, data=article_ids):
        article_id = row["article_id"]
        status = row["like_status"] == 1
        records[article_id] = status

    db.teardown()
    return records


def update_status(article_id, status, title, contents, category):
    db = SqliteDatabase()

    query = """
    INSERT OR REPLACE INTO logs_lite (article_id, like_status)
    VALUES (?, ?);
    """
    db.execute_many(query, array=((article_id, status),))

    query = f"""
    INSERT OR REPLACE INTO logs_content (article_id, title, contents, category)
    VALUES (?, ?, ?, ?);
    """
    db.execute_many(query, array=((article_id, title, contents, category),))

    db.teardown()
    return
