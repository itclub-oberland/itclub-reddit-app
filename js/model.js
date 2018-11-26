/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * */


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
        };

        this.toString = function () {
            return `Owner: ${_owner}
            Message: ${_message}`;
        };

        this.toJSON = function () {
            return {
                owner: _owner,
                message: _message,
                __type: TYPES.COMMENT
            }
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
        };

        this.toString = function () {
            return `Username: ${_username}
            Password: ${_password}`;
        };


        this.toJSON = function () {
            return {
                username: _username,
                password: _password,
                __type: TYPES.USER /* Works, because field is only used when accessed, so the script order doesn't matter*/
            }
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

        this.toString = function () {
            return `Name: ${_name}`;
        };

        this.toJSON = function () {
            return {
                name: _name,
                __type: TYPES.TOPIC
            };
        }
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
            return `Topic: ${_topic}, 
          Owner:${_owner},
          Image URL: ${_image},
          Title:${_title},
          Message:${_message},
          UpVotes:${_upVotes.join()},
          DownVotes:${_downVotes.join()},
          TotalVotes:${this.getVoteCount()}`;
        };

        this.toJSON = function () {
            return {
                topic: _topic,
                owner: _owner,
                title: _title,
                image: _image,
                message: _message,
                comments: _comments,
                upVotes: _upVotes,
                downVotes: _downVotes,
                __type: TYPES.POST
            };
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