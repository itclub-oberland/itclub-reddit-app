const DEFAULT_TOPIC_NAME = "ALL";

const KEYS = {
    USERS_KEY : "users",
    TOPICS_KEY : "topics",
    POSTS_KEY : "posts",
    ACTIVE_USER_KEY : "activeUser",
    ACTIVE_TOPIC_KEY: "activeTopic"
};

const TYPES = {
    COMMENT: "Comment",
    TOPIC: "Topic",
    USER: "User",
    POST: "Post"
};

const VIEW_MANAGER = RedditApp.ViewManager();
const MODEL_MANAGER = window.RedditApp.ModelManager();
const STORAGE_MANAGER = RedditApp.StorageManager();
const AUTOFILL_MANAGER = RedditApp.AutofillManager();

const USER = MODEL_MANAGER.User;
const TOPIC = MODEL_MANAGER.Topic;
const POST = MODEL_MANAGER.Post;
const COMMENT = MODEL_MANAGER.Comment;