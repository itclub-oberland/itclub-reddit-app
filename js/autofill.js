(function(window){
    window.RedditApp = window.RedditApp || {};
    window.RedditApp.AutofillManager = function () {
        let randomContentCount = 20;
        let autofills = [];
        let imageUrls = [];
        $.get("https://picsum.photos/list", function (data) {
            for (let i = 0; i < randomContentCount; i++) {
                imageUrls.push(`https://picsum.photos/800/400?image=${data[i].id}`);
            }
            $.get(`https://baconipsum.com/api/?type=meat-and-filler&paras=${randomContentCount}`, function (data) {
                for (let i = 0; i < randomContentCount; i++) {
                    let header = `Header ${i}`;
                    let image = imageUrls[i];
                    let message = data[i];
                    autofills.push({
                        header,
                        image,
                        message
                    });
                }
            });
        });
        return autofills;
    };
})(window);