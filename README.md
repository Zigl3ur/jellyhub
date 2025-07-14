<div align="center">
    <img src="./public/icon.png" alt="JellyHub Logo" width="100"/>
        <h1>
            JellyHub
        </h1>
        <h3>The jellyfin servers media indexer</h3>
</div>
<br>

<h2>About the project</h2>
JellyHub is a web app that allow you to fetch media from all of your jellyfin servers and regroup it in one place, so there is one place to search for specific media and tells you on wich server the desired media is located.

<br>
<h2>Installation</h2>

To be able to run JellyHub, first you must have **[Docker](https://www.docker.com/)** installed on your system.
<br>

Copy the following command with your personallized environment variables to run the app.

```sh
docker run -d --name jellyhub \
    -v jellyhub_data:/app/data \
    -e ALLOW_SIGNUP=true \
    -e BETTER_AUTH_SECRET=randomsecretstring \
    -e SECRET_KEY=64charhexstring \
    -e PORT=8888 \
    --restart unless-stopped \
    -p 8888:8888 \
    zigleur/jellyhub:latest
```

Now you can access the app at http://localhost:8888 _(adapt the host and port depending on how you configured it)_

The default user is `admin` with password `adminadmin`

<h2>Screenshots</h2>

![Screenshot_0](./.github/README/home_page.png)

![Screenshot_1](./.github/README/movie_page.png)

![Screenshot_2](./.github/README/shows_page.png)

![Screenshot_3](./.github/README/musicalbum_page.png)

![Screenshot_4](./.github/README/popup_item.png)

![Screenshot_5](./.github/README/settings_page.png)

![Screenshot_6](./.github/README/login_page.png)

<h2>Personal Note</h2>

This project was made to learn NextJS and React, so definitely the code / css could be better and more optimized since I'm a beginner. But for now it works.

Thanks to my friends [@firminunderscore](https://github.com/firminunderscore) [@0x4c756e61](https://github.com/0x4c756e61) and [@Zarox28](https://github.com/Zarox28) for allowing me to test the app on their jellyfin servers.
