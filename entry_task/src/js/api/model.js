import req from '../../../request'
import api from './api.js'

req.init(null, null, (res, error) => {
  if (error && error.response && error.response.status === 403 && error.response.data && error.response.data.error === 'invalid_token') {
    window.location = `${window.location.origin}/entry_task/login`
  } else {
    return res
  }
})

export default {
  register () {
    return new Promise((resolve, reject) => {
      req.post({
        url: api.login.register,
        data: {
          username: 'jinghuang',
          password: '123456',
          email: 'jing.huang@shopee.com',
          avatar: 'https://coding.net/static/fruit_avatar/Fruit-19.png'
        }
      })
        .then(res => {
          if (res.token) {
            resolve(res)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  login (data) {
    return new Promise((resolve, reject) => {
      req.post({
        url: api.login.login,
        data
      })
        .then(res => {
          if (res.token && res.user) {
            resolve(res)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryChannels (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: api.channels.channelList,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        }
      })
        .then(res => {
          if (res.channels) {
            resolve(res.channels)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryDataList (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: api.events.dataList,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        },
        data: data.params
      })
        .then(res => {
          if (res.events) {
            resolve(res)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryEventInfo (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: `${api.events.eventInfo}/${data.id}`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        }
      })
        .then(res => {
          if (res.event) {
            resolve(res.event)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryParticipantList (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: `${api.events.participantList}/${data.id}/participants`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        }
      })
        .then(res => {
          if (res.users) {
            resolve(res.users)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryLikeList (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: `${api.events.likeList}/${data.id}/likes`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        },
        data: data.params
      })
        .then(res => {
          if (res.users) {
            resolve(res.users)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  queryCommentList (data) {
    return new Promise((resolve, reject) => {
      req.get({
        url: `${api.events.commentList}/${data.id}/comments`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        },
        data: data.params
      })
        .then(res => {
          if (res.comments) {
            resolve(res.comments)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  },
  likeEvent (data) {
    return new Promise((resolve, reject) => {
      req.post({
        url: `${api.events.like}/${data.id}/likes`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  },
  joinEvent (data) {
    return new Promise((resolve, reject) => {
      req.post({
        url: `${api.events.join}/${data.id}/participants`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  },
  commentEvent (data) {
    return new Promise((resolve, reject) => {
      req.post({
        url: `${api.events.comment}/${data.id}/comments`,
        headers: {
          'X-BLACKCAT-TOKEN': data.token
        },
        data: data.params
      })
        .then(res => {
          if (res) {
            resolve(res)
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  }
}
