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

    let BASE_URI = "http://localhost:3000";

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

        /**
         * Interface for adding a user
         * @function Storage.StorageManager#addUser
         * @param {Model.User} user - User to be added
         * */
        this.addUser = function (user) {
            _activeStrategy.addUser(user);
        };

        /**
         * Interface for removing a user
         * @function Storage.StorageManager#removeUser
         * @param {Model.User} user - User to be removed
         * */
        this.removeUser = function (user) {
            _activeStrategy.removeUser(user);
        };

        /**
         * Interface for getting all users
         * @function Storage.StorageManager#getUsers
         * @param {function} callback - Callback for async structure
         * */
        this.getUsers = function (callback) {
            return _activeStrategy.getUsers(callback);
        };

        /**
         * Interface for adding a topic
         * @function Storage.StorageManager#addTopic
         * @param {Model.Topic} topic - Topic to be added
         * */
        this.addTopic = function (topic) {
            _activeStrategy.addTopic(topic);
        };

        /**
         * Interface for removing a topic
         * @function Storage.StorageManager#removeTopic
         * @param {Model.Topic} topic - Topic to be removed
         * */
        this.removeTopic = function (topic) {
            _activeStrategy.removeTopic(topic);
        };

        /**
         * Interface for getting topics
         * @function Storage.StorageManager#getTopics
         * @param {function} callback - Callback for async structure
         * */
        this.getTopics = function (callback) {
            return _activeStrategy.getTopics(callback);
        };

        /**
         * Interface for adding a post
         * @function Storage.StorageManager#addPost
         * @param {Model.Post} post - Post to be added
         * */
        this.addPost = function (post) {
            _activeStrategy.addPost(post);
        };

        /**
         * Interface for removing a post
         * @function Storage.StorageManager#removePost
         * @param {Model.Post} post - Post to be removed
         * */
        this.removePost = function (post) {
            _activeStrategy.removePost(post);
        };

        /**
         * Interface for setting a user as active
         * @function Storage.StorageManager#setActiveUser
         * @param {Model.User} user - User to be set active
         * */
        this.setActiveUser = function (user) {
            _activeStrategy.setActiveUser(user);
        };

        /**
         * Interface for getting the active user
         * @function Storage.StorageManager#getActiveUser
         * @param {function} callback - Callback for async structure
         * */
        this.getActiveUser = function (callback) {
            return _activeStrategy.getActiveUser(callback);
        };

        /**
         * Interface for setting the active topic
         * @function Storage.StorageManager#setActiveTopic
         * @param {Model.Topic} topic - Topic to be set as active
         * @param {function} callback - Callback for async structure
         * */
        this.setActiveTopic = function (topic, callback) {
            _activeStrategy.setActiveTopic(topic, callback);
        };

        /**
         * Interface for getting the active topic
         * @function Storage.StorageManager#getActiveTopic
         * @param {function} callback - Callback for async structure
         * */
        this.getActiveTopic = function (callback) {
            return _activeStrategy.getActiveTopic(callback);
        };

        /**
         * Interface for getting all posts
         * @function Storage.StorageManager#getPosts
         * @param {function} callback - Callback for async structure
         * */
        this.getPosts = function (callback) {
            return _activeStrategy.getPosts(callback);
        };

        /**
         * Interface for setting multiple posts
         * @function Storage.StorageManager#setPosts
         * @param {array} posts - Array of posts
         * */
        this.setPosts = function (posts) {
            _activeStrategy.setPosts(posts);
        };

        /**
         * Interface for clearing users from storage
         * @function Storage.StorageManager#clearUsers
         * @param {function} callback - Callback for async structure
         * */
        this.clearUsers = function (callback) {
            _activeStrategy.clearUsers(callback);
        };

        /**
         * Interface for clearing topics from storage
         * @function Storage.StorageManager#clearTopics
         * @param {function} callback - Callback for async structure
         * */
        this.clearTopics = function (callback) {
            _activeStrategy.clearTopics(callback);
        };

        /**
         * Interface for clearing posts from storage
         * @function Storage.StorageManager#clearPosts
         * @param {function} callback - Callback for async structure
         * */
        this.clearPosts = function (callback) {
            _activeStrategy.clearPosts(callback);
        };

        /**
         * Interface for clearing the active user from storage
         * @function Storage.StorageManager#clearActiveUser
         * @param {function} callback - Callback for async structure
         * */
        this.clearActiveUser = function (callback) {
            _activeStrategy.clearActiveUser(callback);
        };

        /**
         * Interface for clearing active topic from storage
         * @function Storage.StorageManager#clearActiveTopic
         * @param {function} callback - Callback for async structure
         * */
        this.clearActiveTopic = function (callback) {
            _activeStrategy.clearActiveTopic(callback);
        };

        /**
         * Interface for clearing all storages from storage
         * @function Storage.StorageManager#clearStorage
         * @param {function} callback - Callback for async structure
         * */
        this.clearStorage = function (callback) {
            _activeStrategy.clearStorage(callback);
        };

        /**
         * Function for changing the storage strategy
         * @function Storage.StorageManager#changeStrategy
         * @param {object} strategy - Strategy object for changing storage strategy
         * */
        this.changeStrategy = function (strategy) {
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