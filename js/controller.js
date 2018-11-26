const ModelManager = RedditApp.ModelManager();
const ViewManager = RedditApp.ViewManager();
let activeUser = new ModelManager.User("Zmotey", "123");
let posts = [];

function getNewPostValues() {
    let newPostTitle = $("#newPostTitle").val();
    let newPostImageUrl = $("#newPostImageUrl").val();
    let newPostTopic = $("#newPostCategory option:selected").text();
    let newPostMessage = $("#newPostMessage").val();
    return {
        newPostTitle,
        newPostImageUrl,
        newPostTopic,
        newPostMessage
    }
}

$(document).ready(function () {
    $("#newPostBtn").click(function () {
        let readValues = getNewPostValues();
        let newPost = new ModelManager.Post(
            new ModelManager.Topic(readValues.newPostTopic),
            activeUser,
            readValues.newPostTitle,
            readValues.newPostImageUrl,
            readValues.newPostMessage
        );
        posts.push(newPost);♠
        $("#redditStream").html(
            ViewManager.renderPosts(posts)
        );
    });
});