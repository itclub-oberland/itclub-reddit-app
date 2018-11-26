/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * */

(function (window) {
    window.RedditApp = window.RedditApp || {};

    function transform(parsedJson) {
        if (parsedJson) {
            if (parsedJson.__type) {
                if (parsedJson.__type === TYPES.COMMENT) {
                    return new COMMENT(transform(parsedJson.owner), parsedJson.message);
                }
                if (parsedJson.__type === TYPES.USER) {
                    return new USER(parsedJson.username, parsedJson.password);
                }
                if (parsedJson.__type === TYPES.TOPIC) {
                    return new TOPIC(parsedJson.name);
                }
                if (parsedJson.__type === TYPES.POST) {
                    let post = new POST(transform(parsedJson.topic), transform(parsedJson.owner),
                        parsedJson.title, parsedJson.image, parsedJson.message);
                    for (let comment of parsedJson.comments) {
                        post.addComment(transform(comment));
                    }
                    for (let upVotingUser of parsedJson.upVotes) {
                        post.addUpVote(transform(upVotingUser));
                    }
                    for (let downVotingUser of parsedJson.downVotes) {
                        post.addDownVote(transform(downVotingUser));
                    }
                    return post;
                }
            }
        }
    }

    function LocalStorageStrategy() {
        if (!(this instanceof LocalStorageStrategy)) {
            return new LocalStorageStrategy();
        }

        this.addUser = function (user) {
            if (user instanceof USER) {
                if (localStorage.getItem(KEYS.USERS_KEY) !== null) {
                    let users = this.getUsers();
                    users.push(user);
                    localStorage.setItem(KEYS.USERS_KEY, JSON.stringify(users));
                } else {
                    localStorage.setItem(KEYS.USERS_KEY, JSON.stringify([user]));
                }
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.removeUser = function (user) {
            if (user instanceof USER) {
                if (localStorage.getItem(KEYS.USERS_KEY) !== null) {
                    let users = this.getUsers();
                    users = users.filter((aUser) => {
                        return aUser.getUsername() !== user.getUsername();
                    });
                    localStorage.setItem(KEYS.USERS_KEY, JSON.stringify(users));
                }
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getUsers = function () {
            let transformedUsers = [];
            let users = JSON.parse(localStorage.getItem(KEYS.USERS_KEY)) || [];
            for (let user of users) {
                transformedUsers.push(transform(user));
            }
            return transformedUsers;
        };

        this.addTopic = function (topic) {
            if (topic instanceof TOPIC) {
                if (localStorage.getItem(KEYS.TOPICS_KEY) !== null) {
                    let topics = this.getTopics();
                    topics.push(topic);
                    localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify(topics));
                } else {
                    localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify([topic]));
                }
            } else {
                throw "Parameter 'topic' needs to be of Model type Topic";
            }
        };

        this.removeTopic = function (topic) {
            if (topic instanceof TOPIC) {
                if (localStorage.getItem(KEYS.TOPICS_KEY) !== null) {
                    let topics = this.getTopics();
                    topics = topics.filter((aTopic) => {
                        return aTopic.getName() !== topic.getName();
                    });
                    localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify(topics));
                }
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getTopics = function () {
            let transformedTopics = [];
            let topics = JSON.parse(localStorage.getItem(KEYS.TOPICS_KEY)) || [];
            for (let topic of topics) {
                transformedTopics.push(transform(topic));
            }
            return transformedTopics;
        };

        this.addPost = function (post) {
            if (post instanceof POST) {
                if (localStorage.getItem(KEYS.POSTS_KEY) !== null) {
                    let posts = this.getPosts();
                    posts.push(post);
                    localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify(posts));
                } else {
                    localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify([post]));
                }
            } else {
                throw "Parameter 'post' needs to be of Model type Post";
            }
        };

        this.removePost = function (post) {
            if (post instanceof POST) {
                if (localStorage.getItem(KEYS.POSTS_KEY) !== null) {
                    let posts = this.getPosts();
                    posts = posts.filter((aPost) => {
                        return !(aPost.getTitle() === post.getTitle()
                            && aPost.getOwner().getUsername() === post.getOwner().getUsername()
                            && aPost.getTopic().getName() === post.getTopic().getName());
                    });
                    localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify(posts));
                }
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getPosts = function () {
            let transformedPosts = [];
            let posts = JSON.parse(localStorage.getItem(KEYS.POSTS_KEY)) || [];
            for (let post of posts) {
                transformedPosts.push(transform(post));
            }
            return transformedPosts;
        };

        this.setActiveUser = function (user) {
            if (user instanceof USER) {
                localStorage.setItem(KEYS.ACTIVE_USER_KEY, JSON.stringify(user));
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getActiveUser = function () {
            return transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_USER_KEY)));
        };

        this.setActiveTopic = function (topic) {
            if (topic instanceof TOPIC) {
                localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, JSON.stringify(topic));
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getActiveTopic = function () {
            return transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_TOPIC_KEY)));
        };

        this.clearUsers = function () {
            localStorage.setItem(KEYS.USERS_KEY, null);
        };

        this.clearTopics = function () {
            localStorage.setItem(KEYS.TOPICS_KEY, null);
        };

        this.clearPosts = function () {
            localStorage.setItem(KEYS.POSTS_KEY, null);
        };

        this.clearActiveUser = function () {
            localStorage.setItem(KEYS.ACTIVE_USER_KEY, null);
        };

        this.clearActiveTopic = function () {
            localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, null);
        };

        this.clearStorage = function () {
            localStorage.clear();
        }
    }

    function RemoteStorageStrategy() {
        if (!(this instanceof RemoteStorageStrategy)) {
            return new RemoteStorageStrategy();
        }

        this.addUser = function (user) {
            if (user instanceof USER) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.removeUser = function (user) {
            if (user instanceof USER) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getUsers = function () {
            //TODO: Remote logic
            return [];
        };

        this.addTopic = function (topic) {
            if (topic instanceof TOPIC) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'topic' needs to be of Model type Topic";
            }
        };

        this.removeTopic = function (topic) {
            if (topic instanceof TOPIC) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'topic' needs to be of Model type Topic";
            }
        };

        this.getTopics = function () {
            //TODO: Remote logic
            return [];
        };

        this.addPost = function (post) {
            if (post instanceof POST) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'post' needs to be of Model type Post";
            }
        };

        this.removePost = function (post) {
            if (post instanceof POST) {
                //TODO: Remote logic
            } else {
                throw "Parameter 'post' needs to be of Model type Post";
            }
        };

        this.setActiveUser = function (user) {
            if (user instanceof USER) {
                //TODO: Remote Logic
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getActiveUser = function () {
            //TODO: Remote Logic
            return new USER();
        };

        this.setActiveTopic = function (topic) {
            if (topic instanceof TOPIC) {
                //TODO: Remote Logic
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        this.getActiveTopic = function () {
            //TODO: Remote Logic
            return new TOPIC("Default");
        };

        this.getPosts = function () {
            //TODO: Remote logic
            return [];
        };


        this.clearUsers = function () {
            //TODO: Remote logic
        };

        this.clearTopics = function () {
            //TODO: Remote logic
        };

        this.clearPosts = function () {
            //TODO: Remote logic
        };

        this.clearActiveUser = function () {
            //TODO: Remote logic
        };

        this.clearActiveTopic = function () {
            //TODO: Remote Logic
        };

        this.clearStorage = function () {
            //TODO: Remote logic
        }
    }

    function StorageManager() {
        if (!(this instanceof StorageManager)) {
            return new StorageManager();
        }

        let _activeStrategy = new LocalStorageStrategy();

        this.addUser = function (user) {
            _activeStrategy.addUser(user);
        };

        this.removeUser = function (user) {
            _activeStrategy.removeUser(user);
        };

        this.getUsers = function () {
            return _activeStrategy.getUsers();
        };

        this.addTopic = function (topic) {
            _activeStrategy.addTopic(topic);
        };

        this.removeTopic = function (topic) {
            _activeStrategy.removeTopic(topic);
        };

        this.getTopics = function () {
            return _activeStrategy.getTopics();
        };

        this.addPost = function (post) {
            _activeStrategy.addPost(post);
        };

        this.removePost = function (post) {
            _activeStrategy.removePost(post);
        };

        this.setActiveUser = function (user) {
            _activeStrategy.setActiveUser(user);
        };

        this.getActiveUser = function () {
            return _activeStrategy.getActiveUser();
        };

        this.setActiveTopic = function (topic) {
            _activeStrategy.setActiveTopic(topic);
        };

        this.getActiveTopic = function () {
            return _activeStrategy.getActiveTopic();
        };

        this.getPosts = function () {
            return _activeStrategy.getPosts();
        };


        this.clearUsers = function () {
            _activeStrategy.clearUsers();
        };

        this.clearTopics = function () {
            _activeStrategy.clearTopics();
        };

        this.clearPosts = function () {
            _activeStrategy.clearPosts();
        };

        this.clearActiveUser = function () {
            _activeStrategy.clearActiveUser();
        };

        this.clearActiveTopic = function () {
            _activeStrategy.clearActiveTopic();
        };

        this.clearStorage = function () {
            _activeStrategy.clearStorage();
        };

        this.STRATEGY = {
            LOCAL: "LOCAL",
            REMOTE: "REMOTE"
        };

        this.changeStrategy = function (strategy) {
            if (strategy) {
                if (strategy === this.STRATEGY.LOCAL) {
                    _activeStrategy = new LocalStorageStrategy();
                }
                if (strategy === this.STRATEGY.REMOTE) {
                    _activeStrategy = new RemoteStorageStrategy();
                }
            } else {
                throw "Please define a strategy. Use StoreManager.STRATEGY.";
            }
        }
    }

    window.RedditApp.StorageManager = function () {
        return new StorageManager();
    }
})(window);