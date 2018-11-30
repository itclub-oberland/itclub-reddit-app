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
        let that = this;
        /**
         * Shows success messages in green color
         * @function Notification.NotificationManager#showSuccess
         * @param {string} message - Message for snackbar to show
         * */
        that.showSuccess = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--success">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        };

        /**
         * Shows info messages in a blue color
         * @function Notification.NotificationManager#showSuccess
         * @param {string} message - Message for snackbar to show
         * */
        that.showInfo = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--info">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        };

        /**
         * Shows error messages in red color
         * @function Notification.NotificationManager#showError
         * @param {string} message - Message for snackbar to show
         * */
        that.showError = function (message) {
            let snackbar = $("#snackbar");
            let id = Date.now();
            let domMessage = $(`<div id="${id}" class="message message--failure">${message}</div>`);
            snackbar.append(domMessage);
            setTimeout(() => {
                snackbar.find(`#${id}`).remove();
            }, messageDelay);
        };

        /**
         * Shows a blue blinking message when app is loading
         * @function Notification.NotificationManager#showLoader
         * @returns {object} A Handle to remove the loader.
         * */
        that.showLoader = function () {
            let snackbar = $("#snackbar");
            let domMessage = "";
            if (!snackbar.find(".js-loader-active").length) {
                domMessage = $(`<div class="message message--loading js-loader-active">Loading...</div>`);
            } else {
                domMessage = $(`<div class="message message--loading js-loader-hidden" hidden></div>`);
            }
            snackbar.append(domMessage);
            return {
                stop: function () {
                    let hiddenLoaders = snackbar.find(".js-loader-hidden");
                    if (hiddenLoaders.length) {
                        $(hiddenLoaders.get(0)).remove();
                    } else {
                        snackbar.find(".js-loader-active").remove();
                    }
                }
            }
        }
    }

    window.RedditApp.NotificationManager = function () {
        return new NotificationManager();
    }
})(window);