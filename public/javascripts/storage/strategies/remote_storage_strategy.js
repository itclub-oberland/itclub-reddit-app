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
     * remotely via API. The strategy
     * is passed internally to the {@link Storage.StorageManager}
     * The strategies both use the same interfaces as the
     * {@link Storage.StorageManager} function object.
     * @class RemoteStorageStrategy
     * @memberOf Storage
     * */
    function RemoteStorageStrategy(BASE_URI) {
        if (!(this instanceof RemoteStorageStrategy)) {
            return new RemoteStorageStrategy(BASE_URI);
        }

        let that = this;

        /**
         * Adds a User to remote repository
         * @function Storage.RemoteStorageStrategy#addUser
         * @param {Model.User} user - New User to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addUser = function (user, callback) {
            if (user instanceof USER) {
                $.ajax(
                    {
                        method: "POST",
                        url: `${BASE_URI}/users`,
                        data: {data: JSON.stringify(user)},
                        success: (data) => {
                            let newUser = transform(data);
                            NOTIFICATION_MANAGER.showSuccess(`New User "${newUser.getUsername()}" added!`);
                            callback();
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback();
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
                callback();
            }
        };

        /**
         * Removes a User based on Username from remote repository
         * @function Storage.RemoteStorageStrategy#removeUser
         * @param {Model.User} user - User to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removeUser = function (user, callback) {
            if (user instanceof USER) {
                $.ajax(
                    {
                        url: `${BASE_URI}/users/${user.getUsername()}`,
                        method: "DELETE",
                        success: () => {
                            NOTIFICATION_MANAGER.showSuccess(`User "${user.getUsername()} successfully removed!"`);
                            callback(true);
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback(false);
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
                callback(false);
            }
        };

        /**
         * Retrieves users from remote storage
         * @function Storage.RemoteStorageStrategy#getUsers
         * @param {function} callback - Callback for asyn structure
         * */
        that.getUsers = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/users`,
                    method: "GET",
                    success: (data) => {
                        if (data) {
                            let users = [];
                            for (let userJson of data) {
                                users.push(transform(userJson));
                            }
                            callback(users);
                        } else {
                            NOTIFICATION_MANAGER.showError("No users found!");
                            callback([]);
                        }
                    },
                    error: (err) => {
                        NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        callback();
                    }
                });
        };

        /**
         * Adds a topic to the remote repository.
         * @function Storage.RemoteStorageStrategy#addTopic
         * @param {Model.Topic} topic - Topic to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addTopic = function (topic, callback) {
            if (topic instanceof TOPIC) {
                $.ajax(
                    {
                        method: "POST",
                        url: `${BASE_URI}/topics`,
                        data: {data: JSON.stringify(topic)},
                        success: (data) => {
                            let newTopic = transform(data);
                            NOTIFICATION_MANAGER.showSuccess(`New Topic "${newTopic.getName()}" added!`);
                            callback();
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback();
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'topic' needs to be of Model type Topic");
                callback();
            }
        };

        /**
         * Removes topic from remote storage by topic name
         * @function Storage.RemoteStorageStrategy#removeTopic
         * @param {Model.Topic} topic - Topic to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removeTopic = function (topic, callback) {
            if (topic instanceof TOPIC) {
                $.ajax(
                    {
                        url: `${BASE_URI}/topics/${topic.getName()}`,
                        method: "DELETE",
                        success: () => {
                            NOTIFICATION_MANAGER.showSuccess(`Topic "${topic.getName()} successfully removed!"`);
                            callback(true);
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback(false);
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'topic' needs to be of Model type Topic");
                callback(false);
            }
        };

        /**
         * Retrieves topics from remote storage
         * @function Storage.RemoteStorageStrategy#getTopics
         * @param {function} callback - Callback for asyn structure
         * */
        that.getTopics = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/topics`,
                    method: "GET",
                    success: (data) => {
                        if (data) {
                            let topics = [];
                            for (let topicJson of data) {
                                topics.push(transform(topicJson));
                            }
                            callback(topics);
                        } else {
                            NOTIFICATION_MANAGER.showError("No topics found!");
                            callback([]);
                        }
                    },
                    error: (err) => {
                        NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        callback([]);
                    }
                });
        };

        /**
         * Adds a post to remote storage
         * @function Storage.RemoteStorageStrategy#addPost
         * @param {Model.Post} post - Post to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addPost = function (post, callback) {
            if (post instanceof POST) {
                $.ajax(
                    {
                        method: "POST",
                        url: `${BASE_URI}/posts`,
                        data: {data: JSON.stringify(post)},
                        success: () => {
                            NOTIFICATION_MANAGER.showSuccess(`New Post with ID "${post.getId()}" added!`);
                            callback();
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback();
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'post' needs to be of Model type Post");
                callback();
            }
        };

        /**
         * Removes a post from remote storage by its id
         * @function Storage.RemoteStorageStrategy#removePost
         * @param {Model.Post} post - Post to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removePost = function (post, callback) {
            if (post instanceof POST) {
                $.ajax(
                    {
                        url: `${BASE_URI}/posts/${post.getId()}`,
                        method: "DELETE",
                        success: () => {
                            NOTIFICATION_MANAGER.showSuccess(`Post with ID: "${post.getId()} successfully removed!"`);
                            callback(true);
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback(false);
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'post' needs to be of Model type Post");
                callback(false);
            }
        };

        /**
         * Sets a user as active user at remote storage
         * @function Storage.RemoteStorageStrategy#setActiveUser
         * @param {Model.User} user - User to be set as active
         * @param {function} callback - Callback for async structure
         * */
        that.setActiveUser = function (user, callback) {
            if (user instanceof USER) {
                $.ajax(
                    {
                        method: "PUT",
                        url: `${BASE_URI}/activeUser`,
                        data: {data: JSON.stringify(user)},
                        success: () => {
                            NOTIFICATION_MANAGER.showSuccess(`User "${user.getUsername()}" is now the active User!`);
                            callback();
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback();
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'user' needs to be of Model type User");
                callback();
            }
        };

        /**
         * Retrieves active user from remote storage
         * @function Storage.RemoteStorageStrategy#getActiveUser
         * @param {function} callback - Callback for asyn structure
         * */
        that.getActiveUser = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/activeUser`,
                    method: "GET",
                    success: (data) => {
                        if (data) {
                            let activeUser = transform(data);
                            callback(activeUser);
                        } else {
                            NOTIFICATION_MANAGER.showError("No active user found!");
                            callback();
                        }
                    },
                    error: (err) => {
                        NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        callback();
                    }
                });
        };

        /**
         * Sets active topic at remote storage
         * @function Storage.RemoteStorageStrategy#setActiveTopic
         * @param {Model.Topic} topic - Topic to be set as active at remote storage
         * @param {function} callback - Callback for asyn structure
         * */
        that.setActiveTopic = function (topic, callback) {
            if (topic instanceof TOPIC) {
                $.ajax(
                    {
                        method: "PUT",
                        url: `${BASE_URI}/activeTopic`,
                        data: {data: JSON.stringify(topic)},
                        success: (data) => {
                            if (data) {
                                NOTIFICATION_MANAGER.showSuccess(`Topic "${topic.getName()}" is now the active Topic!`);
                            }
                            callback();
                        },
                        error: (err) => {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                            callback();
                        }
                    });
            } else {
                NOTIFICATION_MANAGER.showError("Parameter 'topic' needs to be of Model type Topic");
            }
        };

        /**
         * Retrieves active topic from remote storage
         * @function Storage.RemoteStorageStrategy#getActiveTopic
         * @param {function} callback - Callback for asyn structure
         * */
        that.getActiveTopic = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/activeTopic`,
                    method: "GET",
                    success: (data) => {
                        if (data) {
                            let activeTopic = transform(data);
                            callback(activeTopic);
                        } else {
                            NOTIFICATION_MANAGER.showError("No active topic found!");
                            callback();
                        }
                    },
                    error: (err) => {
                        if (err.responseText) {
                            NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        } else {
                            NOTIFICATION_MANAGER.showError("No active topic found.");
                        }
                        callback();
                    }
                });
        };

        /**
         * Retrieves posts from remote storage
         * @function Storage.RemoteStorageStrategy#getPosts
         * @param {function} callback - Callback for asyn structure
         * */
        that.getPosts = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/posts`,
                    method: "GET",
                    success: (data) => {
                        if (data) {
                            let posts = [];
                            for (let postJson of data) {
                                posts.push(transform(postJson));
                            }
                            callback(posts);
                        } else {
                            NOTIFICATION_MANAGER.showError("No posts found!");
                            callback([]);
                        }
                    },
                    error: (err) => {
                        NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        callback([]);
                    }
                });
        };

        /**
         * Updates posts at remote storage
         * @function Storage.RemoteStorageStrategy#setPosts
         * @param {array} posts - Array of posts
         * @param {function} callback - Callback for async structure
         * */
        that.setPosts = function (posts, callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/posts`,
                    method: "PUT",
                    data: {data: JSON.stringify(posts)},
                    success: (data) => {
                        if (data) {
                            NOTIFICATION_MANAGER.showSuccess("Updating posts successful!");
                        } else {
                            NOTIFICATION_MANAGER.showError("Updating posts failed!");
                        }
                        callback();
                    },
                    error: (err) => {
                        NOTIFICATION_MANAGER.showError(JSON.parse(err.responseText).message);
                        callback();
                    }
                });
        };

        /**
         * Helper function for clearing remote storage
         * @private
         * @function Storage.RemoteStorageStrategy#postRequest
         * @param {object} response - Response object from Ajax call
         * @param {string} status - Status message from Ajax call
         * */
        function postRequest(response, status) {
            if (status === "success") {
                NOTIFICATION_MANAGER.showSuccess(JSON.parse(response.responseText).message);
            } else {
                NOTIFICATION_MANAGER.showError(JSON.parse(response.responseText).message);
            }
        }

        /**
         * Clears Users from remote storage
         * @function Storage.RemoteStorageStrategy#clearUsers
         * @param {function} callback - Callback for asyn structure
         * */
        that.clearUsers = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/users`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Clears Topics from remote storage
         * @function Storage.RemoteStorageStrategy#clearTopics
         * @param {function} callback - Callback for asyn structure
         * */
        that.clearTopics = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/topics`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Clears Posts from remote storage
         * @function Storage.RemoteStorageStrategy#clearPosts
         * @param {function} callback - Callback for asyn structure
         * */
        that.clearPosts = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/posts`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Clears active user from remote storage
         * @function Storage.RemoteStorageStrategy#clearActiveUser
         * @param {function} callback - Callback for asyn structure
         * */
        that.clearActiveUser = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/activeUser`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Clears active topic from remote storage
         * @function Storage.RemoteStorageStrategy#clearActiveTopic
         * @param {function} callback - Callback for asyn structure
         * */
        that.clearActiveTopic = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}/activeTopic`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Helper function for clearing remote storage
         * @private
         * @function Storage.RemoteStorageStrategy#_clearActiveFields
         * @param {function} callback - Callback for asyn structure
         * */
        let _clearActiveFields = function (callback) {
            $.ajax(
                {
                    url: `${BASE_URI}`,
                    method: "DELETE",
                    complete: (response, status) => {
                        postRequest(response, status);
                        callback();
                    }
                });
        };

        /**
         * Clears all storage from remote storage
         * @function Storage.RemoteStorageStrategy#clearStorage
         * @param {function} callback - Callback for asyn structure
         * */
        this.clearStorage = function (callback) {
            Promise.all([
                new Promise((resolve, reject) => {
                    _clearActiveFields(resolve);
                }),
                new Promise((resolve, reject) => {
                    that.clearUsers(resolve);
                }),
                new Promise((resolve, reject) => {
                    that.clearTopics(resolve);
                }),
                new Promise((resolve, reject) => {
                    that.clearPosts(resolve);
                })
            ]).then(() => {
                callback();
            });
        }
    }

    window.RedditApp._TO_BE_REMOVED = window.RedditApp._TO_BE_REMOVED || {};
    window.RedditApp._TO_BE_REMOVED.RemoteStorageStrategy = RemoteStorageStrategy;
})(window);