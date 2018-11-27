/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * */

(function (window) {
    window.RedditApp = window.RedditApp || {};

    function ViewManager() {
        if (!(this instanceof ViewManager)) {
            return new ViewManager();
        }

        let _renderComment = function (comment) {
            return `
            <div class="reddit-post__comment">
                <h3>${comment.getOwner().getUsername()}</h3>
                <p>${comment.getMessage()}</p>
            </div>
                       `;
        };

        this.renderPost = function (post) {
            let top = `
            <div class="reddit-post" id="${post.getId()}">
                <div class="reddit-post__main">
                    <div class="arrows">
                        <button class="arrows__arrow arrows__arrow--up js-vote-up-btn"></button>
                        <p class="js-vote-count-text">${post.getVoteCount()}</p>
                        <button class="arrows__arrow arrows_arrow--down js-vote-down-btn"></button>
                    </div>
                    <div class="reddit-post__content">
                        <div class="reddit-post__content-body">
                            <div class="reddit-post__body-header">
                                <div class="reddit-post__header-text">
                                    <div class="reddit-post__topic">${post.getTopic().getName()}</div>
                                    <div class="reddit-post__user">${post.getOwner().getUsername()}</div>
                                    <h2 class="reddit-post__heading">${post.getTitle()}</h2>
                                </div>`;
            let middle = post.getImage() ? `
                            <div class="reddit-post__header-image">
                                <img src="${post.getImage()}"/>
                            </div>` : '';
            let bottom =
                `      </div>
                            <p class="reddit-post__message">${post.getMessage()}</p>
                            <div class="reddit-post__comments-input-section">
                                <textarea class="reddit-post__comment-message-input"></textarea>
                                <button class="btn-post btn-post--primary js-comment-btn">Comment
                                </button>
                                <button class="btn-post btn-post--primary js-show-comments">Show
                                    All
                                </button>
                                <button class="btn-post btn-post--primary js-hide-comments ">Hide
                                    All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="reddit-post__comments">
                    <h3>Comments (${post.getComments().length})</h3>
                </div>
            </div>
            `;
            return top + middle + bottom;
        };

        this.renderComments = function (comments, isHidden) {
            let renderedComments = `<h3>Comments (${comments.length})</h3><div class="reddit-post__comment-section">`;
            if(isHidden){
                comments = [];
            }
            for (let comment of comments) {
                renderedComments += _renderComment(comment);
            }
            renderedComments += `</div>`;
            return renderedComments;
        };

        this.renderPosts = function (posts) {
            let renderedPosts = "";
            for (let post of posts) {
                renderedPosts = this.renderPost(post) + renderedPosts;
            }
            return renderedPosts;
        };

        this.renderUserList = function (activeUser, users) {
            users = users.filter((user) => {
                return user.getUsername() !== activeUser.getUsername()
            });
            let userList = `<option selected>${activeUser.getUsername()}</option>`;
            for (let user of users) {
                userList += `<option value="${user.getUsername()}">${user.getUsername()}</option>`;
            }
            return userList;
        };

        this.renderTopicsList = function(activeTopic, topics){
            let topicsList = `<div class="topics__list">`;
            for(let topic of topics){
                let active = '';
                if(topic.getName() === activeTopic.getName()){
                    active = 'topic-btn--active';
                }
                topicsList += `<button class="topic-btn topic-btn--primary ${active} js-topic-btn">${topic.getName()}</button>`;
            }
            topicsList += `</div>`;
            return topicsList;
        };

        this.renderTopicDropdown = function(topics){
            let topicsList ="";
            for(let topic of topics){
                topicsList += `<option value="${topic.getName()}">${topic.getName()}</option>`;
            }
            return topicsList;
        }
    }

    window.RedditApp.ViewManager = function () {
        return new ViewManager();
    }
})(window);