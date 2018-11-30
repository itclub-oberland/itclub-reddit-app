# itclub-reddit-app

This repo is an exercise and serves as a segue to OO JavaScript.
It is intentionally minimal in its application of JS's OO facilities.
The current uploaded code includes all of the required features and some
of the optional features as well. The site is deployed on netlify.
The Server can be found [here](https://github.com/itclub-oberland/itclub-reddit-server);

This sample is built with vanilla JS as much as possible (ie. no module loaders etc.
The structure of the frontend code is built with async operations in mind.
See tags to access previous versions of the app (for example, where the structure was built with
localStorage only in mind).

[Live Preview](https://itclub-reddit.netlify.com/)

[Documentation](http://htmlpreview.github.io/?https://raw.githubusercontent.com/itclub-oberland/itclub-reddit-app/master/out/index.html)
## Required features:
- Add New User
- Change Active User
- Add New Topic
- Filter Stream according to selected Topic / active Topic
- Add New Post
- Upvote a Post
- Downvote a Post
- Comment on a Post
- Show/Hide Comments on a Post
- Allow the active User to vote on a Post only once,
The active User can: up vote, remove upvote, down vote, remove down vote,
So essentially, you can "neutralize" your votes on a Post
- Persistence with local storage

## Optional features:
- Persistence with remote storage
- Input checking
- Operation success/failure reporting via Snackbar or similar
- Usage of function objects and instance checks
- Modular infrastructure

## App Template:
![Reddit App Template](https://github.com/itclub-oberland/itclub-reddit-app/raw/master/res/reddit_app_elements_updated.jpg)