module.exports = [
    function () {
        var progressService = {};
        progressService.done = function (type, id) {
            localStorage.progresses[type][id] = {status:true};
        };
        progressService.isDone = function (type, id) {
            return localStorage.progresses[type][id].status;
        };
        return progressService;
    }
];
