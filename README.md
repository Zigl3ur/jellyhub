<div align="center">
    <img src="./public/icon.png" alt="JellyHub Logo" width="100"/>
        <h1>
            JellyHub
        </h1>
        <h3>The jellyfin servers media indexer</h3>
</div>
<br>

> [!IMPORTANT]
> This is Work In Progress.

<h2>About the project</h2>
JellyHub is a web app that allow you to fetch media from all of your jellyfin servers and regroup it in one place, so there is one place to search for specific media and tells you on wich server the desired media is located.

<br>
<h2>Installation</h2>

To be able to run JellyHub, first you must have **[Docker](https://www.docker.com/)** installed on your system.
<br>

Copy the following command with your personallized environment variables to run the app.

For the `AUTH_SECRET` and `SECRET_KEY` generate a key for each with `openssl rand -base64 32`

```sh
docker run -d --name jellyhub \
        -v jellyhub_data:/app/data \
        -e ALLOW_SIGNUP=true \
        -e AUTH_SECRET= \
        -e AUTH_URL=http://localhost:3000 \
        -e SECRET_KEY= \
        --restart unless-stopped \
        -p 3000:3000 \
        jellyhub
```

Now you can access the app at http://localhost:3000 _(adapt the host and port depending on how you configured it)_
