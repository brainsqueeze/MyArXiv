FROM frolvlad/alpine-python3
LABEL maintainer="Dave Hollander"
LABEL version="0.1"

EXPOSE 10091

COPY requirements.txt requirements.txt

# update conda then create and activate the environment
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

WORKDIR /app/src

ENTRYPOINT ["cherryd", "-i", "debug"]