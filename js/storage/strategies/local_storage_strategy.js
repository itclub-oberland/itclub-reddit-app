/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * @namespace Storage
 * */
(function (window) {

    window.RedditApp = window.RedditApp || {};
    if (!window.RedditApp._TO_BE_REMOVED || !window.RedditApp._TO_BE_REMOVED.Transformer) {
        throw "Module 'Transformer' not found. Check your ordering!";
    }
    let transform = window.RedditApp._TO_BE_REMOVED.Transformer;

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

        let that = this;

        /**
         * Adds a User object to storage.
         * Users are stored in an array of Users
         * and are access via its corresponding
         * Storage key. See contants.js for all
         * Storage KEYS.
         * @function Storage.LocalStorageStrategy#addUser
         * @param {Model.User} user - A user
         * */
        that.addUser = function (user) {
            if (user instanceof USER) {
                if (localStorage.getItem(KEYS.USERS_KEY) !== null) {
                    that.getUsers((users) => {
                        if (!users.find((aUser) => {
                            return aUser.getUsername() === user.getUsername();
                        })) {
                            users.push(user);
                            localStorage.setItem(KEYS.USERS_KEY, JSON.stringify(users));
                            NOTIFICATION_MANAGER.showSuccess(`New User "${user.getUsername()}" added.`);
                        } else {
                            NOTIFICATION_MANAGER.showError("User already exists!");
                        }
                    });
                } else {
                    localStorage.setItem(KEYS.USERS_KEY, JSON.stringify([user]));
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };

        /**
         * Removes a user from storage.
         * @function Storage.LocalStorageStrategy#removeUser
         * @param {Model.User} user - User to be removed.
         * */
        that.removeUser = function (user) {
            if (user instanceof USER) {
                if (localStorage.getItem(KEYS.USERS_KEY) !== null) {
                    this.getUsers((users) => {
                        users = users.filter((aUser) => {
                            return aUser.getUsername() !== user.getUsername();
                        });
                        localStorage.setItem(KEYS.USERS_KEY, JSON.stringify(users));
                        NOTIFICATION_MANAGER.showSuccess(`User "${user.getUsername()}" removed successfuly!`);
                    });
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };

        /**
         * Retrieves all users from localStorage via
         * the corresponding storage key. When retrieved
         * from storage, the JSON Objects are first
         * transformed to function objects before being
         * returned.
         * @function Storage.LocalStorageStrategy#getUsers
         * @param {function} callback - Callback from async structure.
         * */
        that.getUsers = function (callback) {
            let transformedUsers = [];
            let users = JSON.parse(localStorage.getItem(KEYS.USERS_KEY)) || [];
            for (let user of users) {
                transformedUsers.push(transform(user));
            }
            callback(transformedUsers);
        };

        /**
         * Adds a topic to the array of topics
         * in the localStorage.
         * @function Storage.LocalStorageStrategy#addTopic
         * @param {Model.Topic} topic - A topic
         * */
        that.addTopic = function (topic) {
            if (topic instanceof TOPIC) {
                if (localStorage.getItem(KEYS.TOPICS_KEY) !== null) {
                    that.getTopics((topics) => {
                        if (!topics.find((aTopic) => {
                            return aTopic.getName() === topic.getName();
                        })) {
                            topics.push(topic);
                            localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify(topics));
                            NOTIFICATION_MANAGER.showSuccess(`New Topic "${topic.getName()} added."`);
                        } else {
                            NOTIFICATION_MANAGER.showError("Topic already exists!");
                        }
                    });
                } else {
                    localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify([topic]));
                    NOTIFICATION_MANAGER.showSuccess(`New Topic "${topic.getName()}" added.`);
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'topic' needs to be of Model type Topic");
            }
        };

        /**
         * Removes a topic from the array of topics
         * in the localStorage.
         * @function Storage.LocalStorageStrategy#removeTopic
         * @param {Model.Topic} topic - Topic to be removed
         * */
        that.removeTopic = function (topic) {
            if (topic instanceof TOPIC) {
                if (localStorage.getItem(KEYS.TOPICS_KEY) !== null) {
                    that.getTopics((topics) => {
                        topics = topics.filter((aTopic) => {
                            return aTopic.getName() !== topic.getName();
                        });
                        localStorage.setItem(KEYS.TOPICS_KEY, JSON.stringify(topics));
                        NOTIFICATION_MANAGER.showSuccess(`Topic "${topic.getName()}" removed.`);
                    });
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };

        /**
         * Retrieves all topics stored under
         * the corresponding storage key for topics.
         * Before returning, the JSON Objects are first
         * transformed into function objects.
         * @function Storage.LocalStorageStrategy#getTopics
         * @param {function} callback - Callback from async structure.
         * */
        that.getTopics = function (callback) {
            let transformedTopics = [];
            let topics = JSON.parse(localStorage.getItem(KEYS.TOPICS_KEY)) || [];
            for (let topic of topics) {
                transformedTopics.push(transform(topic));
            }
            callback(transformedTopics);
        };

        /**
         * Adds a post to the array of posts
         * in the storage.
         * @function Storage.LocalStorageStrategy#addPost
         * @param {Model.Post} post - A post
         * */
        that.addPost = function (post) {
            if (post instanceof POST) {
                if (localStorage.getItem(KEYS.POSTS_KEY) !== null) {
                    that.getPosts((posts) => {
                        posts.push(post);
                        localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify(posts));
                        NOTIFICATION_MANAGER.showSuccess(`New Post with ID "${post.getId()}" added.`);
                    });
                } else {
                    localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify([post]));
                    NOTIFICATION_MANAGER.showSuccess(`New Post with ID "${post.getId()}" added.`);
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'post' needs to be of Model type Post");
            }
        };

        /**
         * Removes a post from the array of posts
         * in the storage.
         * @function Storage.LocalStorageStrategy#removePost
         * @param {Model.Post} post - Post to be removed.
         * */
        that.removePost = function (post) {
            if (post instanceof POST) {
                if (localStorage.getItem(KEYS.POSTS_KEY) !== null) {
                    that.getPosts((posts) => {
                        posts = posts.filter((aPost) => {
                            return !(aPost.getTitle() === post.getTitle()
                                && aPost.getOwner().getUsername() === post.getOwner().getUsername()
                                && aPost.getTopic().getName() === post.getTopic().getName());
                        });
                        localStorage.setItem(KEYS.POSTS_KEY, JSON.stringify(posts));
                        NOTIFICATION_MANAGER.showSuccess(`Post with ID "${post.getId()}" removed.`);
                    });
                }
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };

        /**
         * Retrieves all posts from the storage
         * via the corresponding storage key.
         * Before returning, the JSON Objects
         * are transformed into function objects.
         * @function Storage.LocalStorageStrategy#getPosts
         * @param {function} callback - Callback from async structure.
         * */
        that.getPosts = function (callback) {
            let transformedPosts = [];
            let posts = JSON.parse(localStorage.getItem(KEYS.POSTS_KEY)) || [];
            for (let post of posts) {
                transformedPosts.push(transform(post));
            }
            callback(transformedPosts);
        };

        /**
         * Updates / sets an array of  {Model.Post} posts
         * in the local storage via the corresponding
         * storage key.
         * @function Storage.LocalStorageStrategy#setPosts
         * @param {array} posts - An array of posts
         * */
        that.setPosts = function (posts) {
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
        that.setActiveUser = function (user) {
            if (user instanceof USER) {
                localStorage.setItem(KEYS.ACTIVE_USER_KEY, JSON.stringify(user));
                NOTIFICATION_MANAGER.showSuccess(`User "${user.getUsername()}" is now active.`);
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };


        /**
         * Retrieves the currently active user  {Model.User}
         * @function Storage.LocalStorageStrategy#getActiveUser
         * @param {function} callback - Callback from async structure.
         * */
        that.getActiveUser = function (callback) {
            callback(transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_USER_KEY))));
        };

        /**
         * Updates / sets the active topic in the storage
         * @function Storage.LocalStorageStrategy#setActiveTopic
         * @param {Model.Topic} topic - The active topic
         * @param {function} callback - Callback from async structure.
         * */
        that.setActiveTopic = function (topic, callback) {
            if (topic instanceof TOPIC) {
                localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, JSON.stringify(topic));
                NOTIFICATION_MANAGER.showSuccess(`Topic "${topic.getName()}" is now active.`);
                callback();
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
            }
        };

        /**
         * Retrieves the active topic from the storage.
         * @function Storage.LocalStorageStrategy#getActiveTopic
         * @param {function} callback - Callback from async structure.
         * */
        that.getActiveTopic = function (callback) {
            callback(transform(JSON.parse(localStorage.getItem(KEYS.ACTIVE_TOPIC_KEY))));
        };

        /**
         * Clears all users from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearUsers
         * @param {function} callback - Callback from async structure.
         * */
        that.clearUsers = function (callback) {
            localStorage.setItem(KEYS.USERS_KEY, null);
            NOTIFICATION_MANAGER.showSuccess(`Users storage cleared.`);
            callback();
        };

        /**
         * Clears all topics from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearTopics
         * @param {function} callback - Callback from async structure.
         * */
        that.clearTopics = function (callback) {
            localStorage.setItem(KEYS.TOPICS_KEY, null);
            NOTIFICATION_MANAGER.showSuccess(`Topics storage cleared.`);
            callback();
        };

        /**
         * Clears all posts from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearPosts
         * @param {function} callback - Callback from async structure.
         * */
        that.clearPosts = function (callback) {
            localStorage.setItem(KEYS.POSTS_KEY, null);
            NOTIFICATION_MANAGER.showSuccess(`Posts storage cleared.`);
            callback();
        };

        /**
         * Clears active user from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearActiveUser
         * @param {function} callback - Callback from async structure.
         * */
        that.clearActiveUser = function (callback) {
            localStorage.setItem(KEYS.ACTIVE_USER_KEY, null);
            NOTIFICATION_MANAGER.showSuccess(`Active user cleared.`);
            callback();
        };

        /**
         * Clears active topic from storage via
         * corresponding storage key
         * @function Storage.LocalStorageStrategy#clearActiveTopic
         * @param {function} callback - Callback from async structure.
         * */
        that.clearActiveTopic = function (callback) {
            localStorage.setItem(KEYS.ACTIVE_TOPIC_KEY, null);
            NOTIFICATION_MANAGER.showSuccess(`Active Topic cleared.`);
            callback();
        };

        /**
         * Clears entire storage
         * @function Storage.LocalStorageStrategy#clearStorage
         * @param {function} callback - Callback from async structure.
         * */
        that.clearStorage = function (callback) {
            localStorage.clear();
            NOTIFICATION_MANAGER.showSuccess(`All storage cleared.`);
            callback();
        }
    }

    window.RedditApp._TO_BE_REMOVED = window.RedditApp._TO_BE_REMOVED || {};
    window.RedditApp._TO_BE_REMOVED.LocalStorageStrategy = LocalStorageStrategy;
})(window);