module.exports = [
    function () {
        var progressService = {};
        if(!localStorage.progresses) {
            localStorage.progresses = '{}';
        }
        progressService.pipe = function (handle) {
            var progresses = JSON.parse(localStorage.progresses);
            progresses = handle(progresses);
            localStorage.progresses = JSON.stringify(progresses);
        };
        progressService.done = function (type, id) {
            progressService.pipe(function (progresses) {
                if(!progresses[type]){
                    progresses[type] = {};
                }
                progresses[type][id] = {status:true};

                return progresses;
            })
        };
        progressService.isDone = function (type, id) {
            var done;
            done = false;
            progressService.pipe(function (progresses) {
                if(!progresses[type]){
                    progresses[type] = {};
                }
                done = progresses[type][id].status;
            });

            return done;
        };
        return progressService;
    }
];
