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

    let LocalStorageStrategy = window.RedditApp._TO_BE_REMOVED.LocalStorageStrategy;
    let RemoteStorageStrategy = window.RedditApp._TO_BE_REMOVED.RemoteStorageStrategy;

    let BASE_URI = "https://itclub-reddit-server.herokuapp.com";

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

        let that = this;

        that.STRATEGY = {
            LOCAL: "LOCAL",
            REMOTE: "REMOTE"
        };

        /**
         * A simple wrapper for callback based operations
         * to automatically add a loader to these kinds
         * of calls
         * */
        let callbackLoadingWrapper = function (rootFunction, ...args) {
            let loader = NOTIFICATION_MANAGER.showLoader();
            let callback = args.pop();
            rootFunction(...args, (...params) => {
                loader.stop();
                callback(...params);
            });
        };

        let _activeStrategy = new LocalStorageStrategy();

        /**
         * Interface for adding a user
         * @function Storage.StorageManager#addUser
         * @param {Model.User} user - User to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addUser = function (user, callback) {
            callbackLoadingWrapper(_activeStrategy.addUser, user, callback);
        };

        /**
         * Interface for removing a user
         * @function Storage.StorageManager#removeUser
         * @param {Model.User} user - User to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removeUser = function (user, callback) {
            callbackLoadingWrapper(_activeStrategy.removeUser, user, callback);
        };

        /**
         * Interface for getting all users
         * @function Storage.StorageManager#getUsers
         * @param {function} callback - Callback for async structure
         * */
        that.getUsers = function (callback) {
            callbackLoadingWrapper(_activeStrategy.getUsers, callback);
        };

        /**
         * Interface for adding a topic
         * @function Storage.StorageManager#addTopic
         * @param {Model.Topic} topic - Topic to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addTopic = function (topic, callback) {
            callbackLoadingWrapper(_activeStrategy.addTopic, topic, callback);
        };

        /**
         * Interface for removing a topic
         * @function Storage.StorageManager#removeTopic
         * @param {Model.Topic} topic - Topic to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removeTopic = function (topic, callback) {
            callbackLoadingWrapper(_activeStrategy.removeTopic, topic, callback);
        };

        /**
         * Interface for getting topics
         * @function Storage.StorageManager#getTopics
         * @param {function} callback - Callback for async structure
         * */
        that.getTopics = function (callback) {
            callbackLoadingWrapper(_activeStrategy.getTopics, callback);
        };

        /**
         * Interface for adding a post
         * @function Storage.StorageManager#addPost
         * @param {Model.Post} post - Post to be added
         * @param {function} callback - Callback for async structure
         * */
        that.addPost = function (post, callback) {
            callbackLoadingWrapper(_activeStrategy.addPost, post, callback);
        };

        /**
         * Interface for removing a post
         * @function Storage.StorageManager#removePost
         * @param {Model.Post} post - Post to be removed
         * @param {function} callback - Callback for async structure
         * */
        that.removePost = function (post, callback) {
            callbackLoadingWrapper(_activeStrategy.removePost, post, callback);
        };

        /**
         * Interface for setting a user as active
         * @function Storage.StorageManager#setActiveUser
         * @param {Model.User} user - User to be set active
         * @param {function} callback - Callback for async structure
         * */
        that.setActiveUser = function (user, callback) {
            callbackLoadingWrapper(_activeStrategy.setActiveUser, user, callback);
        };

        /**
         * Interface for getting the active user
         * @function Storage.StorageManager#getActiveUser
         * @param {function} callback - Callback for async structure
         * */
        that.getActiveUser = function (callback) {
            callbackLoadingWrapper(_activeStrategy.getActiveUser, callback);
        };

        /**
         * Interface for setting the active topic
         * @function Storage.StorageManager#setActiveTopic
         * @param {Model.Topic} topic - Topic to be set as active
         * @param {function} callback - Callback for async structure
         * */
        that.setActiveTopic = function (topic, callback) {
            callbackLoadingWrapper(_activeStrategy.setActiveTopic, topic, callback);
        };

        /**
         * Interface for getting the active topic
         * @function Storage.StorageManager#getActiveTopic
         * @param {function} callback - Callback for async structure
         * */
        that.getActiveTopic = function (callback) {
            callbackLoadingWrapper(_activeStrategy.getActiveTopic, callback);
        };

        /**
         * Interface for getting all posts
         * @function Storage.StorageManager#getPosts
         * @param {function} callback - Callback for async structure
         * */
        that.getPosts = function (callback) {
            callbackLoadingWrapper(_activeStrategy.getPosts, callback);
        };

        /**
         * Interface for setting multiple posts
         * @function Storage.StorageManager#setPosts
         * @param {array} posts - Array of posts
         * @param {function} callback - Callback for async structure
         * */
        that.setPosts = function (posts, callback) {
            callbackLoadingWrapper(_activeStrategy.setPosts, posts, callback);
        };

        /**
         * Interface for clearing users from storage
         * @function Storage.StorageManager#clearUsers
         * @param {function} callback - Callback for async structure
         * */
        that.clearUsers = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearUsers, callback);
        };

        /**
         * Interface for clearing topics from storage
         * @function Storage.StorageManager#clearTopics
         * @param {function} callback - Callback for async structure
         * */
        that.clearTopics = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearTopics, callback);
        };

        /**
         * Interface for clearing posts from storage
         * @function Storage.StorageManager#clearPosts
         * @param {function} callback - Callback for async structure
         * */
        that.clearPosts = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearPosts, callback);
        };

        /**
         * Interface for clearing the active user from storage
         * @function Storage.StorageManager#clearActiveUser
         * @param {function} callback - Callback for async structure
         * */
        that.clearActiveUser = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearActiveUser, callback);
        };

        /**
         * Interface for clearing active topic from storage
         * @function Storage.StorageManager#clearActiveTopic
         * @param {function} callback - Callback for async structure
         * */
        that.clearActiveTopic = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearActiveTopic, callback);
        };

        /**
         * Interface for clearing all storages from storage
         * @function Storage.StorageManager#clearStorage
         * @param {function} callback - Callback for async structure
         * */
        that.clearStorage = function (callback) {
            callbackLoadingWrapper(_activeStrategy.clearStorage, callback);
        };

        /**
         * Function for changing the storage strategy
         * @function Storage.StorageManager#changeStrategy
         * @param {object} strategy - Strategy object for changing storage strategy
         * */
        that.changeStrategy = function (strategy) {
            if (strategy) {
                if (strategy === this.STRATEGY.LOCAL) {
                    _activeStrategy = new LocalStorageStrategy();
                }
                if (strategy === this.STRATEGY.REMOTE) {
                    _activeStrategy = new RemoteStorageStrategy(BASE_URI);
                }
            } else {
                NOTIFICATION_MANAGER.showError("Please define a strategy. Use StoreManager.STRATEGY.");
            }
        }
    }

    /**
     * Removing certain objects from global namespace in order
     * to keep them private
     * */
    delete window.RedditApp._TO_BE_REMOVED;

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