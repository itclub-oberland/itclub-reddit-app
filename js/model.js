/**
 * This code intentionally doesn't use OO JavaScript
 * by not using classes or prototypial inheritance.
 * The purpose of this exercise at this stage is to
 * be a segue to OO JavaScript
 * */

(function (window) {
    window.RedditApp = window.RedditApp || {};

    /**
     * Model definition for a Comment
     * @param {User} [owner] - The user that owns this comment
     * @param {string} [message] - The message of the {Comment}
     * */
    function Comment(owner, message) {
        if (!(this instanceof Comment)) {
            return new Comment(owner, message);
        }
        let _owner = owner instanceof User ? owner : new User(owner + "");
        let _message = message || "";

        /**
         * @function Comment#setOwner
         * @param {User} newOwner - New owner of this comment
         * */
        this.setOwner = function (newOwner) {
            _owner = newOwner instanceof User ? newOwner : new User(newOwner + "");
        };

        /**
         * @function Comment#getOwner
         * @returns {User} the user that this Comment belongs to
         * */
        this.getOwner = function () {
            return _owner;
        };

        /**
         * @function Comment#setMessage
         * @param {string} newMessage - Setter for the new message of this {Comment}
         * */
        this.setMessage = function (newMessage) {
            _message = newMessage;
        };

        /**
         * @function Comment#getMessage
         * @returns {string} Message of this {Comment}
         * */
        this.getMessage = function () {
            return _message;
        };


        /**
         * @override Object#toString
         * @function Comment#toString
         * @returns {string} textual representation of the {Comment}
         * */
        this.toString = function () {
            return `Owner: ${_owner}
            Message: ${_message}`;
        };

        /**
         * The __type property in the returned
         * JSON object is for later parsing with JSON.parse.
         * Via this property we can transform the JSON Objects
         * back to the function objects they were before serialization.
         * @function Comment#toJSON
         * @returns {object} for stringifying function object with JSON.stringify
         * */
        this.toJSON = function () {
            return {
                owner: _owner,
                message: _message,
                __type: TYPES.COMMENT
            }
        }
    }

    /**
     * Model definition for User's
     * @param {string} [username] - Username
     * @param {string} [password] - Password
     * */
    function User(username, password) {
        if (!(this instanceof User)) {
            return new User(username, password);
        }
        let _username = username || "Guest";
        let _password = password || "1234";

        /**
         * @function User#setUsername
         * @param {string} newUsername - New Username
         * */
        this.setUsername = function (newUsername) {
            _username = newUsername;
        };

        /**
         * @function User#getUsername
         * @returns {string} the username
         * */
        this.getUsername = function () {
            return _username;
        };

        /**
         * @function User#setPassword
         * @param {string} newPassword - The new password
         * */
        this.setPassword = function (newPassword) {
            _password = newPassword;
        };

        /**
         * @function User#getPassword
         * @returns {string} the User password
         * */
        this.getPassword = function () {
            return _password;
        };


        /**
         * @override Object#toString
         * @function User#toString
         * @returns {string} a textual representation of the {User}
         * */
        this.toString = function () {
            return `Username: ${_username}
            Password: ${_password}`;
        };

        /**
         * The __type property in the returned
         * JSON object is for later parsing with JSON.parse.
         * Via this property we can transform the JSON Objects
         * back to the function objects they were before serialization.
         * @function User#toJSON
         * @returns {object} for stringifying function object with JSON.stringify
         * */
        this.toJSON = function () {
            return {
                username: _username,
                password: _password,
                __type: TYPES.USER /* Works, because field is only used when accessed, so the script order doesn't matter*/
            }
        }
    }

    /**
     * Model definition for Topic's
     * @param {string} [name] - Name of the topic
     * */
    function Topic(name) {
        if (!(this instanceof Topic)) {
            return new Topic(name);
        }
        let _name = name || "";

        /**
         * @function Topic#setName
         * @param {string} newName - New name of the topic
         * */
        this.setName = function (newName) {
            _name = newName;
        };

        /**
         * @function Topic#getName
         * @returns {string} the name of the Topic
         * */
        this.getName = function () {
            return _name;
        };

        /**
         * @override Object#toString
         * @function Topic#toString
         * @returns {string} A textual representation of a Topic
         * */
        this.toString = function () {
            return `Name: ${_name}`;
        };


        /**
         * The __type property in the returned
         * JSON object is for later parsing with JSON.parse.
         * Via this property we can transform the JSON Objects
         * back to the function objects they were before serialization.
         * @function Topic#toJSON
         * @returns {object} Object representation for JSON.stringify
         * */
        this.toJSON = function () {
            return {
                name: _name,
                __type: TYPES.TOPIC
            };
        }
    }

    /**
     * Model definition for a Post
     * @param {Topic} [topic] - Topic of the Post
     * @param {User} [owner] - User that owns the Post
     * @param {string} [title] - Title of the Post
     * @param {string} [image] - Image URL of the Post
     * @param {string} [message] - Message of the Post
     * */
    function Post(topic, owner, title, image, message) {
        if (!(this instanceof Post)) {
            return new Post(topic, owner, title, image, message);
        }
        let _id = Date.now(); // Enough for exercise purposes
        let _topic = topic instanceof Topic ? topic : new Topic(topic + "");
        let _owner = owner instanceof User ? owner : new User(owner + "");
        let _title = title || "";
        let _image = image || "";
        let _message = message || "";
        let _comments = [];
        let _upVotes = [];
        let _downVotes = [];

        /**
         * @function Post#setTopic
         * @param {Topic} newTopic - Sets the new topic of this Post
         * */
        this.setTopic = function (newTopic) {
            _topic = newTopic instanceof Topic ? newTopic : new Topic(newTopic + "");
        };

        /**
         * @function Post#getTopic
         * @returns {Topic} of t his Post
         * */
        this.getTopic = function () {
            return _topic;
        };

        /**
         * @function Post#setOwner
         * @param {User} newOwner - The new owner of this Post
         * */
        this.setOwner = function (newOwner) {
            _owner = newOwner instanceof User ? newOwner : new User(newOwner + "");
        };

        /**
         * @function Post#getOwner
         * @returns {User} the owner of this Post
         * */
        this.getOwner = function () {
            return _owner;
        };

        /**
         * @function Post#setTitle
         * @returns {string} the title
         * */
        this.setTitle = function (newTitle) {
            _title = newTitle;
        };

        /**
         * @function Post#getTitle
         * @returns {string} the title
         * */
        this.getTitle = function () {
            return _title;
        };

        /**
         * @function Post#setImage
         * @param {string} newImage - Image URL
         * */
        this.setImage = function (newImage) {
            _image = newImage;
        };

        /**
         * @function Post#getImage
         * @returns {string} URL of the image of this post
         * */
        this.getImage = function () {
            return _image;
        };


        /**
         * @function Post#setMessage
         * @param {string} newMessage - Sets the new message string for this Post
         * */
        this.setMessage = function (newMessage) {
            _message = newMessage;
        };

        /**
         * @function Post#getMessage
         * @returns {string} the message string of this Post
         * */
        this.getMessage = function () {
            return _message;
        };

        /**
         * @function Post#addComment
         * @param {Comment} comment - Adds new comment to this Post
         * */
        this.addComment = function (comment) {
            if (comment instanceof Comment) {
                _comments.push(comment);
            } else {
                throw "Parameter needs to be of type 'Comment'";
            }
        };

        /**
         * @function Post#getComments
         * @returns {array} of {Comment}'s of this {Post}
         * */
        this.getComments = function () {
            return _comments;
        };

        /**
         * @function Post#addUpVote
         * @param {User} user - Adds the voting user to the array of up voters
         * */
        this.addUpVote = function (user) {
            if (user instanceof User) {
                if (!this.removeDownVote(user)) {
                    if (!_upVotes.find((aUser) => aUser.getUsername() === user.getUsername())) {
                        _upVotes.push(user);
                    }
                }
            } else {
                throw "Parameter needs to be of type 'User'";
            }
        };

        /**
         * @function Post#removeUpVote
         * @param {User} user - User to be removed from the array of up voters
         * */
        this.removeUpVote = function (user) {
            if (user instanceof User) {
                let _upVotesCountBefore = _upVotes.length;
                _upVotes = _upVotes.filter((aUser) => {
                    return user.getUsername() !== aUser.getUsername();
                });
                return _upVotesCountBefore > _upVotes.length;
            } else {
                throw "Parameter needs to be of type 'User'";
            }
        };

        /**
         * @function Post#addDownVote
         * @param {User} user - User to be added to the array of down voters
         * */
        this.addDownVote = function (user) {
            if (user instanceof User) {
                if (!this.removeUpVote(user)) {
                    if (!_downVotes.find((aUser) => aUser.getUsername() === user.getUsername())) {
                        _downVotes.push(user);
                    }
                }
            } else {
                throw "Parameter needs to be of type 'User'";
            }
        };

        /**
         * @function Post#removeDownVote
         * @param {User} user - User to be removed from the array of down voters
         * */
        this.removeDownVote = function (user) {
            if (user instanceof User) {
                let downVotesCountBefore = _downVotes.length;
                _downVotes = _downVotes.filter((aUser) => {
                    return user.getUsername() !== aUser.getUsername();
                });
                return downVotesCountBefore > _downVotes.length;
            } else {
                throw "Parameter needs to be of type 'User'";
            }
        };

        /**
         * @function Post#getVoteCount
         * @returns {number} the difference between up votes and down votes
         * */
        this.getVoteCount = function () {
            return _upVotes.length - _downVotes.length;
        };

        /**
         * @function Post#getId
         * @returns {number} the id
         * */
        this.getId = function () {
            return _id;
        };

        /**
         * @function Post#setId
         * @param {number} newId - Sets the new Id for this {Post}
         * */
        this.setId = function (newId) {
            _id = newId;
        };

        /**
         * @override Object#toString
         * @function Post#toString
         * @returns {string} a textual representation fo the {Post} object
         * */
        this.toString = function () {
            return `
          Id: ${_id}
          Topic: ${_topic}, 
          Owner:${_owner},
          Image URL: ${_image},
          Title:${_title},
          Message:${_message},
          UpVotes:${_upVotes.join()},
          DownVotes:${_downVotes.join()},
          TotalVotes:${this.getVoteCount()}`;
        };

        /**
         * The __type property in the returned
         * JSON object is for later parsing with JSON.parse.
         * Via this property we can transform the JSON Objects
         * back to the function objects they were before serialization.
         * @function Post#toJSON
         * @returns {object} for stringifying function object with JSON.stringify
         * */
        this.toJSON = function () {
            return {
                id: _id,
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