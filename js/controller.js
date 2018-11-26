/**
 * Helper functions Controller
 * */

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
    newTopicSection.before(VIEW_MANAGER.renderTopicsList(STORAGE_MANAGER.getActiveTopic(),STORAGE_MANAGER.getTopics()));
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
    $("#newPostBtn").click(function () {
        let readNewPostValues = getNewPostValues();
        let newPost = new POST(
            new TOPIC(readNewPostValues.newPostTopic),
            STORAGE_MANAGER.getActiveUser(),
            readNewPostValues.newPostTitle,
            readNewPostValues.newPostImageUrl,
            readNewPostValues.newPostMessage
        );
        STORAGE_MANAGER.addPost(newPost);
        updateRedditStream(STORAGE_MANAGER.getActiveTopic().getName());
    });

    $("#newUserBtn").click(function () {
        let readUserValues = getNewUserValues();
        let newUser = new USER(readUserValues.username, readUserValues.password);
        STORAGE_MANAGER.addUser(newUser);
        refreshUsersDropdown();
    });

    $("#usersDropdown").change(function () {
        let activeUserName = $("#usersDropdown :selected").val();
        let users = STORAGE_MANAGER.getUsers();
        let activeUser = users.find((user) => {
            return user.getUsername() === activeUserName;
        });
        STORAGE_MANAGER.setActiveUser(activeUser);
        refreshUsersDropdown();
    });

    $("#addNewTopicBtn").click(function () {
        let readNewTopicValue = getNewTopicValue();
        if (readNewTopicValue.newTopicName) {
            let newTopic = new TOPIC(readNewTopicValue.newTopicName);
            STORAGE_MANAGER.addTopic(newTopic);
            refreshTopicsList();
            refreshTopicDropdown();
        }
    });

    init();
});