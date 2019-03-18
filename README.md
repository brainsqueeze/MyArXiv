# MyArXiv
Custom arXiv.org feed based on your interests

## Website

To run the web service and UI you will need Docker/docker-compose, and you can
start everything by running 
```bash
cd app
docker-compose up
```
You will need to set the `.env` file for your environment. If you plan to log your
activity you will need to set `HAS_DATABASE=1` and set you Sqlite database file path
to the environment variable `SQLITE_PATH`.

If you want to develop the Javascript in the browser you can run the Node server in
development mode by doing
```bash
cd app
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
