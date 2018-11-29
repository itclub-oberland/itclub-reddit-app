/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * @namespace Notification
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
     * Object for managing Notifications in the RedditApp
     * @class NotificationManager
     * @memberOf Notification
     * */
    function NotificationManager() {
        let messageDelay = 3000;
        /**
         * @function showSuccess
         * @param {string} message - Message for snackbar to show
         * */
        this.showSuccess = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--success">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        };

        /**
         * @function showSuccess
         * @param {string} message - Message for snackbar to show
         * */
        this.showInfo = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--info">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        };

        /**
         * @function showError
         * @param {string} message - Message for snackbar to show
         * */
        this.showError = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--failure">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        }
    }

    window.RedditApp.NotificationManager = function () {
        return new NotificationManager();
    }
})(window);