/*
* 定义接口
* */
const api = {
    login: {
        register: '/api/v1/join',
        login: '/api/v1/auth/token'
    },
    channels: {
        channelList: '/api/v1/channels'
    },
    events: {
        dataList: '/api/v1/events',
        eventInfo: '/api/v1/events',
        participantList: '/api/v1/events',
        likeList: '/api/v1/events',
        commentList: '/api/v1/events',
        like: '/api/v1/events',
        join: '/api/v1/events',
        comment: '/api/v1/events'
    }
};

export default api;
