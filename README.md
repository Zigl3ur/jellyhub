<div align="center">
    <img src="./public/icon.png" alt="JellyHub Logo" width="100"/>
        <h2>
            JellyHub
        </h2>
        <p>The jellyfin servers media indexer</p>
</div>

<br>
<h2>About the project</h2>
JellyHub is a web app that allow you to fetch media from all of your jellyfin servers and regroup it in one place, so there is one place to search for specific media and tells you on wich server the desired media is located.

<br>
<h2>Installation</h2>

To be able to run JellyHub, first you must have **[Docker](https://www.docker.com/)** installed on your system.
<br>

### Docker Compose

Create a file [`docker-compose.yaml`](https://github.com/Zigl3ur/jellyhub/blob/main/docker-compose.yml) with the content below.

```yaml
services:
  db:
    container_name: jellyhub-db
    image: postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=user # your postgres user
      - POSTGRES_PASSWORD=passwd # your postgres password
      - POSTGRES_DB=jellyhub # your postgres database
    volumes:
      - postgres-data:/var/lib/postgresql/data

  app:
    container_name: jellyhub
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:passwd@db:5432/dbname?schema=prisma # make it match with the db service
      - JWT_SECRET=UOt04FdbvhXtmj3keGP981XUj8vJ3uPb # random string for jwt, change it
      - PORT=8888 # optional, default is 3000
    ports:
      - "8888:8888" # make it match with the specified port above, or 3000 to default
    image: zigleur/jellyhub:latest

volumes:
  postgres-data:
```

Change the env variables to make them fit with your needs and run it with the followin command: `docker compose up -d`

### Docker CLI

To run it with the docker cli use the following command with your personnalized env variables.

> [!IMPORTANT]
> With this command you don't have the postgres database so make sure you
> have a reachable one at your DATABASE_URL

```sh
docker run -d --name jellyhub \
    --env DATABASE_URL="postgresql://user:passwd@db:5432/dbname?schema=prisma" \
    --env JWT_SECRET="random_string" \
    --env PORT="8888" \
    --restart unless-stopped \
    --publish 8888:8888 \
    zigleur/jellyhub:latest
```

Now you can access the app at http://localhost:8888 _(adapt the host and port depending on how you configured it)_

<br>
<h2>Screenshots</h2>

![Screenshot_0](https://github.com/Zigl3ur/jellyhub/blob/main/assets/home_page.png)

![Screenshot_1](https://github.com/Zigl3ur/jellyhub/blob/main/assets/movie_page.png)

![Screenshot_2](https://github.com/Zigl3ur/jellyhub/blob/main/assets/shows_page.png)

![Screenshot_3](https://github.com/Zigl3ur/jellyhub/blob/main/assets/musicalbum_page.png)

![Screenshot_4](https://github.com/Zigl3ur/jellyhub/blob/main/assets/popup_item.png)

![Screenshot_5](https://github.com/Zigl3ur/jellyhub/blob/main/assets/settings_page.png)

<br>
<h2>Personnal Note</h2>

This project was made to learn NextJS and React, so for sure the code / css could be better and more optimized since im a begginer. But for now it works.
