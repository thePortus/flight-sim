FROM osgeo/gdal:ubuntu-small-3.3.0

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git build-essential make g++ libsqlite3-dev zlib1g-dev pkg-config wget unzip curl sqlite3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt

# Build tippecanoe (shallow clone)
RUN git clone --depth 1 https://github.com/mapbox/tippecanoe.git && \
    cd tippecanoe && \
    make -j"$(nproc)" && \
    cp tippecanoe /usr/local/bin/ && \
    cd /opt && rm -rf /opt/tippecanoe

# sanity
RUN tippecanoe -v || true

# set workdir for run-time
WORKDIR /data