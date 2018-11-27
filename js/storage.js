/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * @namespace Storage
 * */
(function (window) {
    /**
     * Ensuring that in the global variables
     * namespace the namespace "RedditApp" exists
     * as all of our functions will be gathered
     * under it. This way we pollute the global
     * namespaces minimally.
     * */
    window.RedditApp = window.RedditApp || {};

    /**
     * Transforms JSON Objects to Function Objects
     * via the __type Attribute. This is a private
     * Helper function
     * @function transform
     * @private
     * @param {object} parsedJson - JavaScript Object parsed from JSON String
     * @returns {Model.User | Model.Topic | Model.Post | Model.Comment} a function object
     * @memberOf Storage
     * */
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
                    post.setId(parsedJson.id);
                    return post;
                }
            }
        }
    }

    /**************************
     * LOCAL STORAGE STRATEGY *
     * ************************/

    /**
     * A storage strategy for persisting data
     * locally via localStorage. The strategy
     * is passed internally to the  {StorageManager}
     * The strategies both use the same interfaces as the
     * {@link Storage.StorageManager} function object.
     * @class LocalStorageStrategy
     * @memberOf Storage
     * */
    function LocalStorageStrategy() {
        if (!(this instanceof LocalStorageStrategy)) {
            return new LocalStorageStrategy();
        }

        /**
         * Adds a User object to storage.
         * Users are stored in an array of Users
         * and are access via its corresponding
         * Storage key. See contants.js for all
         * Storage KEYS.
         * @function Storage.LocalStorageStrategy#addUser
         * @param {Model.User} user - A user
         * */
        this.addUser = function (user) {
            if (user instanceof USER) {
                if (localStorage.getItem(KEYS.USERS_KEY) !== null) {
                    let users = this.getUsers();
                    if (!users.find((aUser) => {
                        return aUser.getUsername() === user.getUsername();
                    })) {
                        users.push(user);
                        localStorage.setItem(KEYS.USERS_KEY, JSON.stringify(users));
                    } else {
                        throw "User already exists!";
                    }
                } else {
                    localStorage.setItem(KEYS.USERS_KEY, JSON.stringify([user]));
                }
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        /**
         * Removes a user from storage.
         * @function Storage.LocalStorageStrategy#removeUser
         * @param {Model.User} user - User to be removed.
         * */
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

        /**
         * Retrieves all users from localStorage via
         * the corresponding storage key. When retrieved
         * from storage, the JSON Objects are first
         * transformed to function objects before being
         * returned.
         * @function Storage.LocalStorageStrategy#getUsers
         * @returns {array} of  {Model.User} objects
         * */
        this.getUsers = function () {
            let transformedUsers = [];
            let users = JSON.parse(localStorage.getItem(KEYS.USERS_KEY)) || [];
            for (let user of users) {
                transformedUsers.push(transform(user));
            }
            return transformedUsers;
        };

        /**
         * Adds a topic to the array of topics
         * in the localStorage.
         * @function Storage.LocalStorageStrategy#addTopic
         * @param {Model.Topic} topic - A topic
         * */
        this.addTopic = function (topic) {
            if (topic instanceof TOPIC) {
                if (localStorage.getItem(KEYS.TOPICS_KEY) !== null) {
                    let topics = this.getTopics();
                    if (!topics.find((aTopic) => {
                        return aTopic.getName() === topic.getName();
                    })) {
                        topics.push(topic);
                        localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify(topics));
                    } else {
                        throw "Topic already exists!";
                    }
                } else {
                    localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify([topic]));
                }
            } else {
                throw "Parameter 'topic' needs to be of Model type Topic";
            }
        };

        /**
         * Removes a topic from the array of topics
         * in the localStorage.
         * @function Storage.LocalStorageStrategy#removeTopic
         * @param {Model.Topic} topic - Topic to be removed
         * */
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

        /**
         * Retrieves all topics stored under
         * the corresponding storage key for topics.
         * Before returning, the JSON Objects are first
         * transformed into function objects.
         * @function Storage.LocalStorageStrategy#getTopics
         * @returns {array} of  {Model.Topic} topics.
         * */
        this.getTopics = function () {
            let transformedTopics = [];
            let topics = JSON.parse(localStorage.getItem(KEYS.TOPICS_KEY)) || [];
            for (let topic of topics) {
                transformedTopics.push(transform(topic));
            }
            return transformedTopics;
        };

        /**
         * Adds a post to the array of posts
         * in the storage.
         * @function Storage.LocalStorageStrategy#addPost
         * @param {Model.Post} post - A post
         * */
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

        /**
         * Removes a post from the array of posts
         * in the storage.
         * @function Storage.LocalStorageStrategy#removePost
         * @param {Model.Post} post - Post to be removed.
         * */
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

        /**
         * Retrieves all posts from the storage
         * via the corresponding storage key.
         * Before returning, the JSON Objects
         * are transformed into function objects.
         * @function Storage.LocalStorageStrategy#getPosts
         * @returns {array} of  {Model.Post} posts
         * */
        this.getPosts = function () {
            let transformedPosts = [];
            let posts = JSON.parse(localStorage.getItem(KEYS.POSTS_KEY)) || [];
            for (let post of posts) {
                transformedPosts.push(transform(post));
            }
            return transformedPosts;
        };

        /**
         * Updates / sets an array of  {Model.Post} posts
         * in the local storage via the corresponding
         * storage key.
         * @function Storage.LocalStorageStrategy#setPosts
         * @param {array} posts - An array of posts
         * */
        this.setPosts = function (posts) {
            posts = posts.filter((aPost) => {
                return aPost instanceof POST;
            });
            localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify(posts));
        };

        /**
         * Updates / sets a  {Model.User} activeUser
         * in the localStorage.
         * @function Storage.LocalStorageStrategy#setActiveUser
         * @param {Object} user - Current active user
         * */
        this.setActiveUser = function (user) {
            if (user instanceof USER) {
                localStorage.setItem(KEYS.ACTIVE_USER_KEY, JSON.stringify(user));
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };


        /**
         * Retrieves the currently active user  {Model.User}
         * @function Storage.LocalStorageStrategy#getActiveUser
         * @returns {object} the active user.
         * */
        this.getActiveUser = function () {
            return transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_USER_KEY)));
        };

        /**
         * Updates / sets the active topic in the storage
         * @function Storage.LocalStorageStrategy#setActiveTopic
         * @param {Model.Topic} topic - The active topic
         * */
        this.setActiveTopic = function (topic) {
            if (topic instanceof TOPIC) {
                localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, JSON.stringify(topic));
            } else {
                throw "Parameter 'user' needs to be of Model type User";
            }
        };

        /**
         * Retrieves the active topic from the storage.
         * @function Storage.LocalStorageStrategy#getActiveTopic
         * @returns {Object} the active Topic
         * */
        this.getActiveTopic = function () {
            return transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_TOPIC_KEY)));
        };

        /**
         * Clears all users from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearUsers
         * */
        this.clearUsers = function () {
            localStorage.setItem(KEYS.USERS_KEY, null);
        };

        /**
         * Clears all topics from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearTopics
         * */
        this.clearTopics = function () {
            localStorage.setItem(KEYS.TOPICS_KEY, null);
        };

        /**
         * Clears all posts from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearPosts
         * */
        this.clearPosts = function () {
            localStorage.setItem(KEYS.POSTS_KEY, null);
        };

        /**
         * Clears active user from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearActiveUser
         * */
        this.clearActiveUser = function () {
            localStorage.setItem(KEYS.ACTIVE_USER_KEY, null);
        };

        /**
         * Clears active topic from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearActiveTopic
         * */
        this.clearActiveTopic = function () {
            localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, null);
        };

        /**
         * Clears entire storage
         * @function Storage.LocalStorageStrategy#clearStorage
         * */
        this.clearStorage = function () {
            localStorage.clear();
        }
    }

    /***************************
     * REMOTE STORAGE STRATEGY *
     * *************************/

    /**
     * A storage strategy for persisting data
     * remotely via API. The strategy
     * is passed internally to the {@link Storage.StorageManager}
     * The strategies both use the same interfaces as the
     * {@link Storage.StorageManager} function object.
     * @class RemoteStorageStrategy
     * @memberOf Storage
     * */
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

        this.setPosts = function (posts) {
            //TODO: Remote logic
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

    /*******************
     * STORAGE MANAGER *
     * ****************/

    /**
     * A storage interface for persisting data. Uses
     * either  {@link Storage.LocalStorageStrategy} or
     *  {@link Storage.RemoteStorageStrategy} to persist data
     * locally or remotely. The strategy can be changed
     * via member function.
     * @function StorageManager
     * @memberOf Storage
     * */
    function StorageManager() {
        if (!(this instanceof StorageManager)) {
            return new StorageManager();
        }

        this.STRATEGY = {
            LOCAL: "LOCAL",
            REMOTE: "REMOTE"
        };

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

        this.setPosts = function (posts) {
            _activeStrategy.setPosts(posts);
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

    /**
     * Exposing only the StorageManager to the global
     * variables space and ensuring, any type of access
     * to it, ie. via new or without, returns a new
     * instance of the StorageManager.
     * */
    window.RedditApp.StorageManager = function () {
        return new StorageManager();
    }
})(window);