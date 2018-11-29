(function(window){
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
                    post.setId(parsedJson._id);
                    return post;
                }
            }
        }
    }
    window.RedditApp._TO_BE_REMOVED = window.RedditApp._TO_BE_REMOVED || {};
    window.RedditApp._TO_BE_REMOVED.Transformer = transform;
})(window);