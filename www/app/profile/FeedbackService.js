angular.module('vendorConsoleApp')
    .factory('FeedbackService', function ($http, $q, apiConfig) {
        var service = {};

        service.feedback = function (content, fileId) {
            return $http({
                url: apiConfig.host + "/api/v2/feedback",
                method: 'POST',
                data: {feedbackDescription: content, mediaFileId: fileId}
            }).then(function(payload) {
                return payload.data;
            });
        };

        return service;
    })