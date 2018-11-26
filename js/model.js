(function (window) {
    window.RedditApp = window.RedditApp || {};

    function Comment(owner, message) {
        if (!(this instanceof Comment)) {
            return new Comment(owner, message);
        }
        let _owner = owner instanceof User ? owner : new User(owner + "");
        let _message = message || "";

        this.setOwner = function (newOwner) {
            _owner = newOwner instanceof User ? newOwner : new User(newOwner + "");
        };
        this.getOwner = function () {
            return _owner;
        };
        this.setMessage = function (newMessage) {
            _message = newMessage;
        };
        this.getMessage = function () {
            return _message;
        }
    }

    function User(username, password) {
        if (!(this instanceof User)) {
            return new User(username, password);
        }
        let _username = username || "Guest";
        let _password = password || "1234";

        this.setUsername = function (newUsername) {
            _username = newUsername;
        };
        this.getUsername = function () {
            return _username;
        };
        this.setPassword = function (newPassword) {
            _password = newPassword;
        };
        this.getPassword = function () {
            return _password;
        }
    }

    function Topic(name) {
        if (!(this instanceof Topic)) {
            return new Topic(name);
        }
        let _name = name || "";

        this.setName = function (newName) {
            _name = newName;
        };
        this.getName = function () {
            return _name;
        };
    }

    function Post(topic, owner, title, image, message) {
        if (!(this instanceof Post)) {
            return new Post(topic, owner, title, image, message);
        }
        let _topic = topic instanceof Topic ? topic : new Topic(topic + "");
        let _owner = owner instanceof User ? owner : new User(owner + "");
        let _title = title || "";
        let _image = image || "";
        let _message = message || "";
        let _comments = [];
        let _upVotes = [];
        let _downVotes = [];

        this.setTopic = function (newTopic) {
            _topic = newTopic instanceof Topic ? newTopic : new Topic(newTopic + "");
        };
        this.getTopic = function () {
            return _topic;
        };

        this.setOwner = function (newOwner) {
            _owner = newOwner instanceof User ? newOwner : new User(newOwner + "");
        };
        this.getOwner = function () {
            return _owner;
        };

        this.setTitle = function (newTitle) {
            _title = newTitle;
        };

        this.getTitle = function () {
            return _title;
        };

        this.setImage = function (newImage) {
            _image = newImage;
        };

        this.getImage = function () {
            return _image;
        };

        this.setMessage = function (newMessage) {
            _message = newMessage;
        };

        this.getMessage = function () {
            return _message;
        };

        this.addComment = function (comment) {
            if (comment instanceof Comment) {
                _comments.push(comment);
            }
            throw "Parameter needs to be of type 'Comment'";
        };

        this.addUpVote = function (user) {
            if (user instanceof User) {
                this.removeDownVote(user);
                if (!_upVotes.find((username) => username === user.getUsername())) {
                    _upVotes.push(user.getUsername());
                }
            }
            throw "Parameter needs to be of type 'User'";
        };

        this.removeUpVote = function (user) {
            if (user instanceof User) {
                _upVotes = _upVotes.filter((username) => {
                    return user.getUsername() !== username;
                });
            }
            throw "Parameter needs to be of type 'User'";
        };

        this.addDownVote = function (user) {
            if (user instanceof User) {
                this.removeUpVote(user);
                if (!_downVotes.find((username) => username === user.getUsername())) {
                    _downVotes.push(user.getUsername());
                }
            }
            throw "Parameter needs to be of type 'User'";
        };

        this.removeDownVote = function (user) {
            if (user instanceof User) {
                _downVotes = _downVotes.filter((username) => {
                    return user.getUsername() !== username;
                });
            }
            throw "Parameter needs to be of type 'User'";
        };

        this.getVoteCount = function () {
            return _upVotes.length - _downVotes.length;
        };

        this.toString = function () {
            return `Topic: ${_topic.getName()}, 
          \nOwner:${_owner.getUsername()},
          \nImage URL: ${_image},
          \nTitle:${_title},
          \nMessage:${_message},
          \nUpVotes:${_upVotes.join()},
          \nDownVotes:${_downVotes.join()},
          \nTotalVotes:${this.getVoteCount()}`;
        }
    }

    function ModelManager() {
        this.Comment = Comment;
        this.User = User;
        this.Topic = Topic;
        this.Post = Post;
    }

    window.RedditApp.ModelManager = function () {
        return new ModelManager();
    };

})(window);