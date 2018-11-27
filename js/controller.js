/**
 * Helper functions Controller
 * */

function showSuccess(message) {
    let snackbar = $("#snackbar");
    snackbar.html(message);
    snackbar.addClass("message--success");
    setTimeout(() => {
        snackbar.removeClass("message--success");
    }, 2000);
}

function showError(message) {
    let snackbar = $("#snackbar");
    snackbar.html(message);
    snackbar.addClass("message--failure");
    setTimeout(() => {
        snackbar.removeClass("message--failure");
    }, 2000);
}

function setupDefaults() {
    if (!STORAGE_MANAGER.getActiveUser()) {
        let defaultUser = new USER("Zmotey", "123");
        STORAGE_MANAGER.setActiveUser(defaultUser);
        STORAGE_MANAGER.addUser(defaultUser);
    }
    if (!STORAGE_MANAGER.getTopics().length) {
        let defaultTopic = new TOPIC(DEFAULT_TOPIC_NAME);
        STORAGE_MANAGER.setActiveTopic(defaultTopic);
        STORAGE_MANAGER.addTopic(defaultTopic);
    }
}

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

function getNewTopicValue() {
    let newTopicName = $("#newTopic").val();
    return {newTopicName};
}

function getNewUserValues() {
    let username = $("#username").val();
    let password = $("#password").val();
    return {
        username,
        password
    }
}

function refreshUsersDropdown() {
    let usersDropdown = $("#usersDropdown");
    usersDropdown.empty();
    usersDropdown.append(
        VIEW_MANAGER.renderUserList(
            STORAGE_MANAGER.getActiveUser(),
            STORAGE_MANAGER.getUsers())
    );
}

function refreshRedditStream(posts) {
    posts = posts || STORAGE_MANAGER.getPosts();
    $("#redditStream").html(
        VIEW_MANAGER.renderPosts(posts)
    );
}

function updateRedditStream(topicName) {
    topicName = topicName || STORAGE_MANAGER.getActiveTopic().getName();
    let topics = STORAGE_MANAGER.getTopics();
    let selectedTopic = topics.find((aTopic) => {
        return aTopic.getName() === topicName;
    });

    let posts = STORAGE_MANAGER.getPosts();

    if (selectedTopic) {
        STORAGE_MANAGER.setActiveTopic(selectedTopic);
        if (topicName !== DEFAULT_TOPIC_NAME) {
            posts = posts.filter((aPost) => {
                return aPost.getTopic().getName() === selectedTopic.getName();
            });
        }
    }

    refreshRedditStream(posts);
    refreshStreamListeners();
}

function refreshStreamListeners() {

    function findRoot(event) {
        let elem = $(event.target);
        return elem.closest(".reddit-post");
    }

    function getRootId(root) {
        return +root.attr("id");
    }

    function findPost(root, posts) {
        let postId = getRootId(root);
        return posts.find((aPost) => {
            return aPost.getId() === postId;
        });
    }

    function votingTemplate(event, callback) {
        let root = findRoot(event);
        let posts = STORAGE_MANAGER.getPosts();
        let post = findPost(root, posts);
        if (post) {
            callback(post);
            STORAGE_MANAGER.setPosts(posts);
            root.find(".js-vote-count-text").html(post.getVoteCount());
        }
    }

    $(".js-vote-up-btn").click(function (event) {
        votingTemplate(event, (post) => {
            return post.addUpVote(STORAGE_MANAGER.getActiveUser());
        })
    });

    $(".js-vote-down-btn").click(function (event) {
        votingTemplate(event, (post) => {
            post.addDownVote(STORAGE_MANAGER.getActiveUser());
        });
    });

    $(".js-comment-btn").click(function (event) {
        let root = findRoot(event);
        let commentInputValue = root.find(".reddit-post__comment-message-input").val();
        let posts = STORAGE_MANAGER.getPosts();
        let post = findPost(root, posts);
        if (post) {
            post.addComment(new COMMENT(STORAGE_MANAGER.getActiveUser(), commentInputValue));
            STORAGE_MANAGER.setPosts(posts);
            let commentSection = root.find(".reddit-post__comments");
            commentSection.html(VIEW_MANAGER.renderComments(post.getComments()));
            root.find(".reddit-post__comment-message-input").val("");
            showSuccess("New Comment added successfully!");
        } else {
            showError("Couldn't retrieve Post!");
        }
    });

    function showComments(event) {
        let root = findRoot(event);
        let posts = STORAGE_MANAGER.getPosts();
        let post = findPost(root, posts);
        let commentSection = root.find(".reddit-post__comments");
        commentSection.html(VIEW_MANAGER.renderComments(post.getComments(), false));
    }

    $(".js-show-comments").click(function (event) {
        showComments(event);
    });

    function hideComments(event) {
        let root = findRoot(event);
        let posts = STORAGE_MANAGER.getPosts();
        let post = findPost(root, posts);
        let commentSection = root.find(".reddit-post__comments");
        commentSection.html(VIEW_MANAGER.renderComments(post.getComments(), true));
    }

    $(".js-hide-comments").click(function (event) {
        hideComments(event);
    });
}

function updateTopicListeners() {
    $(".js-topic-btn").click(function (event) {
        let selectedTopicName = $(event.target).html();
        updateRedditStream(selectedTopicName);
        refreshTopicsList();
    })
}

function refreshTopicsList() {
    let newTopicSection = $("#newTopicSection");
    let topicsList = newTopicSection.parent().find(".topics__list");
    if (topicsList) {
        topicsList.remove();
    }
    newTopicSection.before(VIEW_MANAGER.renderTopicsList(STORAGE_MANAGER.getActiveTopic(), STORAGE_MANAGER.getTopics()));
    updateTopicListeners();
}

function refreshTopicDropdown() {
    let newPostCategory = $("#newPostCategory");
    newPostCategory.empty();
    let topics = STORAGE_MANAGER.getTopics();
    newPostCategory.append(VIEW_MANAGER.renderTopicDropdown(topics));
}

function init() {
    // STORAGE_MANAGER.clearStorage();
    setupDefaults();
    refreshUsersDropdown();
    refreshTopicsList();
    refreshTopicDropdown();
    updateRedditStream(STORAGE_MANAGER.getActiveTopic().getName());
}

/**
 * Listeners to be defined once DOM has loaded
 * */
$(document).ready(function () {
    init();

    $("#newPostBtn").click(function () {
        try {
            let readNewPostValues = getNewPostValues();
            let newPost = new POST(
                new TOPIC(readNewPostValues.newPostTopic),
                STORAGE_MANAGER.getActiveUser(),
                readNewPostValues.newPostTitle,
                readNewPostValues.newPostImageUrl,
                readNewPostValues.newPostMessage
            );
            STORAGE_MANAGER.addPost(newPost);
            let activeTopic = STORAGE_MANAGER.getActiveTopic().getName();
            if (newPost.getTopic().getName() === activeTopic
                || activeTopic === DEFAULT_TOPIC_NAME) {
                $(".reddit-stream").prepend(VIEW_MANAGER.renderPost(newPost));
                refreshStreamListeners();
            }
            $("#newPostTitle").val("");
            $("#newPostImageUrl").val("");
            $("#newPostMessage").val("");
            showSuccess("New Post created successfully!");
        } catch (ex) {
            showError("Something went wrong during post creation!");
        }
    });

    $("#newUserBtn").click(function () {
        try {
            let readUserValues = getNewUserValues();
            let newUser = new USER(readUserValues.username, readUserValues.password);
            STORAGE_MANAGER.addUser(newUser);
            refreshUsersDropdown();
            $("#username").val("");
            $("#password").val("");
            showSuccess(`New User "${newUser.getUsername()}" added!`);
        } catch (ex) {
            showError(ex);
        }
    });

    $("#usersDropdown").change(function () {
        try {
            let activeUserName = $("#usersDropdown :selected").val();
            let users = STORAGE_MANAGER.getUsers();
            let activeUser = users.find((user) => {
                return user.getUsername() === activeUserName;
            });
            STORAGE_MANAGER.setActiveUser(activeUser);
            refreshUsersDropdown();
            showSuccess(`Active User changed to "${activeUser.getUsername()}"!`);
        } catch (ex) {
            showError("Something went wrong during Active User change!");
        }
    });

    $("#addNewTopicBtn").click(function () {
        try {
            let readNewTopicValue = getNewTopicValue();
            if (readNewTopicValue.newTopicName) {
                let newTopic = new TOPIC(readNewTopicValue.newTopicName);
                STORAGE_MANAGER.addTopic(newTopic);
                refreshTopicsList();
                refreshTopicDropdown();
                $("#newTopic").val("");
                showSuccess("New Topic created successfully!");
            } else {
                showError("No Topic name entered!");
            }
        } catch (ex) {
            showError(ex);
        }
    });

    $("#autoFillNewPostBtn").click(function () {
        let randomContent = AUTOFILL_MANAGER[Math.floor(Math.random() * AUTOFILL_MANAGER.length)];
        let header = "Header";
        let image = "https://cdn.mos.cms.futurecdn.net/Jcxu2eRWDRQiA8BV9cScjb.jpg";
        let message = "Buffalo laborum dolore picanha kevin.  Ut ball tip shoulder est.  " +
            "Lorem flank pariatur enim, turkey officia doner spare ribs in reprehenderit fugiat.  " +
            "Nostrud commodo venison excepteur dolore cupidatat turducken aute proident veniam eu.  " +
            "Venison cow irure, sausage chuck brisket strip steak ut nulla tenderloin adipisicing kevin.  " +
            "Deserunt ut boudin alcatra tri-tip.";
        if (randomContent) {
            header = randomContent.header;
            image = randomContent.image;
            message = randomContent.message;
        }
        $("#newPostTitle").val(header);
        $("#newPostImageUrl").val(image);
        $("#newPostMessage").val(message);

        let topics = $("#newPostCategory");
        topics.prop('selectedIndex', Math.floor(Math.random() * topics.find("option").length));
    });

    $("#clearStorageBtn").click(function(){
        STORAGE_MANAGER.clearStorage();
        location.reload();
    });
});