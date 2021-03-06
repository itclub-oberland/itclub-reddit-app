function initActiveTopic(callback) {
    STORAGE_MANAGER.getActiveTopic((activeTopic) => {
        if (!activeTopic) {
            STORAGE_MANAGER.getTopics((topics) => {
                if (!topics.length) {
                    STORAGE_MANAGER.addTopic(DEFAULT_TOPIC, () => {
                        STORAGE_MANAGER.setActiveTopic(DEFAULT_TOPIC, callback);
                    });
                } else {
                    STORAGE_MANAGER.setActiveTopic(topics[0], callback);
                }
            });
        } else {
            callback();
        }
    });
}

function initActiveUser(callback) {
    STORAGE_MANAGER.getActiveUser((activeUser) => {
        if (!activeUser) {
            STORAGE_MANAGER.getUsers((users) => {
                if (!users.length) {
                    STORAGE_MANAGER.addUser(DEFAULT_USER, () => {
                        STORAGE_MANAGER.setActiveUser(DEFAULT_USER, callback);
                    });
                } else {
                    STORAGE_MANAGER.setActiveUser(users[0], callback);
                }
            })
        } else {
            callback();
        }
    });
}

function setupDefaults(callback) {
    initActiveUser(() => {
        initActiveTopic(callback);
    })
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

function refreshUsersDropdown(callback) {
    let usersDropdown = $("#usersDropdown");
    usersDropdown.empty();
    STORAGE_MANAGER.getUsers((users) => {
        STORAGE_MANAGER.getActiveUser((activeUser) => {
            usersDropdown.append(
                VIEW_MANAGER.renderUserList(
                    activeUser,
                    users)
            );
            callback();
        });
    });
}

function redditStreamRenderAndAppend(posts) {
    $("#redditStream").html(
        VIEW_MANAGER.renderPosts(posts)
    );
}

function refreshRedditStream(posts) {
    if (!posts) {
        STORAGE_MANAGER.getPosts((posts) => {
            redditStreamRenderAndAppend(posts);
            refreshStreamListeners();
        })
    } else {
        redditStreamRenderAndAppend(posts);
        refreshStreamListeners();
    }
}

function filterPosts(selectedTopic, callback) {
    STORAGE_MANAGER.getPosts((posts) => {
        if (selectedTopic.getName() !== DEFAULT_TOPIC_NAME) {
            posts = posts.filter((aPost) => {
                return aPost.getTopic().getName() === selectedTopic.getName();
            });
        }
        refreshRedditStream(posts);
        callback();
    });
}

function updateRedditStream(topicName, callback) {
    STORAGE_MANAGER.getTopics((topics) => {
        let selectedTopic = topics.find((aTopic) => aTopic.getName() === topicName);
        if (!selectedTopic) {
            STORAGE_MANAGER.getActiveTopic((activeTopic) => {
                filterPosts(activeTopic, callback);
            });
        } else {
            STORAGE_MANAGER.setActiveTopic(selectedTopic, () => {
                filterPosts(selectedTopic, callback);
            });
        }
    });
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
        STORAGE_MANAGER.getPosts((posts) => {
            let root = findRoot(event);
            let post = findPost(root, posts);
            if (post) {
                callback(post, () => {
                    STORAGE_MANAGER.setPosts(posts, () => {
                        root.find(".js-vote-count-text").html(post.getVoteCount());
                    });
                });
            }
        });
    }

    $(".js-vote-up-btn").unbind().click(function (event) {
        votingTemplate(event, (post, callback) => {
            STORAGE_MANAGER.getActiveUser((activeUser) => {
                post.addUpVote(activeUser);
                callback();
            });
        })
    });

    $(".js-vote-down-btn").unbind().click(function (event) {
        votingTemplate(event, (post, callback) => {
            STORAGE_MANAGER.getActiveUser((activeUser) => {
                post.addDownVote(activeUser);
                callback();
            });
        });
    });

    $(".js-comment-btn").unbind().click(function (event) {
        STORAGE_MANAGER.getPosts((posts) => {
            let root = findRoot(event);
            let commentInputValue = root.find(".reddit-post__comment-message-input").val();
            let post = findPost(root, posts);
            if (post) {
                try {
                    STORAGE_MANAGER.getActiveUser((activeUser) => {
                        post.addComment(new COMMENT(activeUser, commentInputValue));
                        STORAGE_MANAGER.setPosts(posts, () => {
                            let commentSection = root.find(".reddit-post__comments");
                            commentSection.html(VIEW_MANAGER.renderComments(post.getComments()));
                            root.find(".reddit-post__comment-message-input").val("");
                            NOTIFICATION_MANAGER.showSuccess("New Comment added successfully!");
                        });
                    });
                } catch (ex) {
                    NOTIFICATION_MANAGER.showError(ex);
                }
            } else {
                NOTIFICATION_MANAGER.showError("Couldn't retrieve Post!");
            }
        });
    });

    function showComments(event) {
        STORAGE_MANAGER.getPosts((posts) => {
            let root = findRoot(event);
            let post = findPost(root, posts);
            let commentSection = root.find(".reddit-post__comments");
            commentSection.html(VIEW_MANAGER.renderComments(post.getComments(), false));
        });
    }

    $(".js-show-comments").unbind().click(function (event) {
        showComments(event);
    });

    function hideComments(event) {
        STORAGE_MANAGER.getPosts((posts) => {
            let root = findRoot(event);
            let post = findPost(root, posts);
            let commentSection = root.find(".reddit-post__comments");
            commentSection.html(VIEW_MANAGER.renderComments(post.getComments(), true));
        });
    }

    $(".js-hide-comments").unbind().click(function (event) {
        hideComments(event);
    });

    $(".reddit-post__close-btn").unbind().click(function (event) {
        let elem = $(event.target);
        let postId = elem.data("postid");
        let postToBeRemovedDummy = new POST();
        postToBeRemovedDummy.setId(postId);
        STORAGE_MANAGER.removePost(postToBeRemovedDummy, (hasSucceded) => {
            if (hasSucceded) {
                findRoot(event).remove();
            }
        });
    });
}

function updateTopicListeners() {
    $(".js-topic-btn").unbind().click(function (event) {
        let selectedTopicName = $(event.target).html();
        updateRedditStream(selectedTopicName, () => {
            refreshTopicsList();
        });
    })
}

function refreshTopicsList(callback) {
    STORAGE_MANAGER.getActiveTopic((activeTopic) => {
        STORAGE_MANAGER.getTopics((topics) => {
            let newTopicSection = $("#newTopicSection");
            let topicsList = newTopicSection.parent().find(".topics__list");
            if (topicsList) {
                topicsList.remove();
            }
            newTopicSection.before(VIEW_MANAGER.renderTopicsList(activeTopic, topics));
            updateTopicListeners();
            callback();
        });
    });
}

function refreshTopicDropdown(callback) {
    let newPostCategory = $("#newPostCategory");
    newPostCategory.empty();
    STORAGE_MANAGER.getTopics((topics) => {
        newPostCategory.append(VIEW_MANAGER.renderTopicDropdown(topics));
        callback();
    });
}

function init() {
    setupDefaults(() => {
        refreshUsersDropdown(() => {
            refreshTopicsList(() => {
                refreshTopicDropdown(() => {
                    updateRedditStream(null, () => {
                        NOTIFICATION_MANAGER.showInfo("App initialized");
                    });
                });
            })
        });
    });
}

/**
 * Listeners to be defined once DOM has loaded
 * */
function setup() {
    init();

    $("#newPostBtn").unbind().click(function () {
        try {
            let readNewPostValues = getNewPostValues();
            STORAGE_MANAGER.getActiveUser((activeUser) => {
                let newPost = new POST(
                    new TOPIC(readNewPostValues.newPostTopic),
                    activeUser,
                    readNewPostValues.newPostTitle,
                    readNewPostValues.newPostImageUrl,
                    readNewPostValues.newPostMessage
                );
                STORAGE_MANAGER.addPost(newPost, () => {
                    STORAGE_MANAGER.getActiveTopic((activeTopic) => {
                        if (newPost.getTopic().getName() === activeTopic.getName()
                            || activeTopic.getName() === DEFAULT_TOPIC_NAME) {
                            $(".reddit-stream").prepend(VIEW_MANAGER.renderPost(newPost));
                            refreshStreamListeners();
                        }
                        $("#newPostTitle").val("");
                        $("#newPostImageUrl").val("");
                        $("#newPostMessage").val("");
                    });
                });
            });
        } catch (ex) {
            NOTIFICATION_MANAGER.showError("Something went wrong during post creation!");
        }
    });

    $("#newUserBtn").unbind().click(function () {
        try {
            let readUserValues = getNewUserValues();
            let newUser = new USER(readUserValues.username, readUserValues.password);
            STORAGE_MANAGER.addUser(newUser, () => {
                refreshUsersDropdown(() => {
                    $("#username").val("");
                    $("#password").val("");
                });
            });
        } catch (ex) {
            NOTIFICATION_MANAGER.showError(ex);
        }
    });

    $("#usersDropdown").unbind().change(function () {
        try {
            let activeUserName = $("#usersDropdown :selected").val();
            STORAGE_MANAGER.getUsers((users) => {
                let activeUser = users.find((user) => {
                    return user.getUsername() === activeUserName;
                });
                STORAGE_MANAGER.setActiveUser(activeUser, () => {
                    refreshUsersDropdown(()=>{});
                });
            });
        } catch (ex) {
            NOTIFICATION_MANAGER.showError("Something went wrong during Active User change!");
        }
    });

    $("#addNewTopicBtn").unbind().click(function () {
        try {
            let readNewTopicValue = getNewTopicValue();
            if (readNewTopicValue.newTopicName) {
                let newTopic = new TOPIC(readNewTopicValue.newTopicName);
                STORAGE_MANAGER.addTopic(newTopic, () => {
                    refreshTopicsList(() => {
                        refreshTopicDropdown(() => {
                            $("#newTopic").val("");
                        });
                    });
                });
            } else {
                NOTIFICATION_MANAGER.showError("No Topic name entered!");
            }
        } catch (ex) {
            NOTIFICATION_MANAGER.showError(ex);
        }
    });

    $("#autoFillNewPostBtn").unbind().click(function () {
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

    $("#clearStorageBtn").unbind().click(function () {
        STORAGE_MANAGER.clearStorage(() => {
            location.reload();
        });
    });
}

$(document).ready(setup);