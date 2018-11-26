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

        let _renderPost = function (post) {
            let top = `
            <div class="reddit-post">
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
                    <h3>Comments</h3>
                </div>
            </div>
            `;
            return top + middle + bottom;
        };

        this.renderComments = function (comments) {
            let renderedComments = "";
            for (let comment of comments) {
                renderedComments += _renderComment(comment);
            }
            return renderedComments;
        };

        this.renderPosts = function (posts) {
            let renderedPosts = "";
            for (let post of posts) {
                renderedPosts += _renderPost(post);
            }
            return renderedPosts;
        };
    }

    window.RedditApp.ViewManager = function () {
        return new ViewManager();
    }
})(window);