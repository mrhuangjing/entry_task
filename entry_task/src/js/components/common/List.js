import '../../../css/List.scss'
import { Icon, Toast } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import model from '../../api/model.js'
import store from '../../store'
import moment from 'moment'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'
import Empty from './Empty.js'

function List (props) {
  const [dataList, setDataList] = useState([])
  const [pageState, setPageState] = useState({
    pageSize: 15,
    pageNum: 0,
    isLoading: false,
    isEnd: false
  })
  let isUnmount = false

  function goDetail (index) {
    const id = dataList[index].id
    props.history.push({ pathname: '/detail', query: { id } })
  }

  async function handleCheckClick (e, index) {
    e.stopPropagation()

    try {
      await model.joinEvent({
        id: dataList[index].id,
        token: props.userInfo.token
      })
      const list = [...dataList].map((el, sub) => {
        if (sub == index) {
          return {
            ...el,
            isGoing: true
          }
        }
        return el
      })
      setDataList(list)
    } catch (e) {
      Toast.fail(`加入失败，${e}`)
    }
  }

  async function handleHeartClick (e, index) {
    e.stopPropagation()

    try {
      await model.likeEvent({
        id: dataList[index].id,
        token: props.userInfo.token
      })
      const list = [...dataList].map((el, sub) => {
        if (sub == index) {
          return {
            ...el,
            isLike: true
          }
        }
        return el
      })
      setDataList(list)
    } catch (e) {
      if (e.response.status === 403 && e.response.data && e.response.data.error === 'already_liked') {
        Toast.fail('您已经点过赞了哟')
      } else {
        Toast.fail(`点赞失败，${e}`)
      }
    }
  }

  async function queryDataList (fromStart) {
    if (pageState.isLoading || pageState.isEnd) return
    setPageState({ ...pageState, isLoading: true })

    const { userInfo } = store.getState()
    try {
      const res = await model.queryDataList({
        params: {
          before: props.date ? props.date.start : '',
          after: props.date ? props.date.end : (props.type === 'past' ? moment(new Date()).valueOf() : ''),
          channels: props.channel ? props.channel.join(',') : '',
          offset: fromStart ? 0 : pageState.pageNum,
          limit: pageState.pageSize
        },
        token: userInfo.token
      })

      const list = res.events.filter(el => {
        if (!props.type) {
          return true
        } else if (props.type === 'likes' && el.me_likes) {
          return true
        } else if (props.type === 'going' && el.me_going) {
          return true
        } else if (props.type === 'past') {
          return true
        }
        return false
      }).map(el => {
        const obj = {
          id: el.id,
          avatar: el.creator.avatar,
          username: el.creator.username,
          channel: el.channel.name,
          title: el.name,
          time: `${moment(el.begin_time).format('YYYY/MM/DD HH:mm')}-${moment(el.end_time).format('YYYY/MM/DD HH:mm')}`,
          content: el.description,
          isGoing: el.me_going,
          isLike: el.me_likes,
          likesCount: el.likes_count,
          goingsCount: el.goings_count
        }
        if (el.images && el.images.length) {
          if (el.images[1]) {
            obj.pic = el.images[1]
          } else {
            obj.pic = el.images[0]
          }
        }
        return obj
      })

      if (props.transferResult) {
        props.transferResult(res.total)
      }
      if (!isUnmount) {
        fromStart ? setDataList(list) : setDataList(dataList.concat(list))
      }
      if (!res.hasMore) {
        setPageState({ ...pageState, isEnd: true })
      }
      setPageState({ ...pageState, pageNum: (fromStart ? 0 : pageState.pageNum) + pageState.pageSize, isLoading: false })
    } catch (e) {
      setPageState({ ...pageState, isEnd: true })
    }
  }

  useEffect(() => {
    queryDataList(true)

    return () => {
      isUnmount = true
    }
  }, [props.date, props.channel, props.type])

  // 翻页判断
  function isNext () {
    const $el = document.querySelector('.list_content')
    return ($el.scrollHeight - $el.scrollTop - $el.clientHeight < 15)
  }

  function onScrollNext () {
    if (isNext() && !pageState.isLoading && !pageState.isEnd) {
      queryDataList()
    }
  }

  return (
    <>
      {
        dataList.length > 0 ?
        (<div className='list_content' style={{ height: `${window.innerHeight - 50}px` }} onScroll={onScrollNext}>
          {
                    dataList.map((el, index) => {
                      return (
                        <div className='list_content_item' key={index} onClick={() => goDetail(index)}>
                          <div className='list_content_item_line'>
                            <LazyLoad scrollContainer='.list_content'>
                              <img className='list_content_item_avatar' src={el.avatar} />
                            </LazyLoad>
                            <div className='list_content_item_username'>{el.username}</div>
                            <div className='list_content_item_channel'>{el.channel}</div>
                          </div>
                          <div className='list_content_item_title' style={{ width: `${el.pic ? '10.8rem' : '14.4rem'}` }}>
                            {el.title}
                          </div>
                          {
                                    el.pic && (
                                      <LazyLoad scrollContainer='.list_content'>
                                        <img className='list_content_item_pic' src={el.pic} />
                                      </LazyLoad>
                                    )
                                }
                          <div className='list_content_item_time'>{el.time}</div>
                          <div className='list_content_item_con'>
                            {el.content}
                          </div>
                          <div className='list_content_item_line'>
                            <div className={['list_content_item_actIcon', el.isGoing ? 'on' : ''].join(' ')} onClick={(e) => handleCheckClick(e, index)} />
                            <div className={['list_content_item_actDesc', el.isGoing ? 'on' : ''].join(' ')} onClick={(e) => handleCheckClick(e, index)}>{el.isGoing ? 'I am going!' : `${el.goingsCount} Going`}</div>
                            <div className={['list_content_item_likeIcon', el.isLike ? 'on' : ''].join(' ')} onClick={(e) => handleHeartClick(e, index)} />
                            <div className={['list_content_item_likeDesc', el.isLike ? 'on' : ''].join(' ')} onClick={(e) => handleHeartClick(e, index)}>{el.isLike ? 'I like it' : `${el.likesCount} Likes`}</div>
                          </div>
                        </div>
                      )
                    })
                }
          {
                    (dataList.length && pageState.isEnd) ? (<div className='list_content_loading'>
                      <Icon type='loading' className='list_content_loading_icon' />
                    </div>) : ''
                }
        </div>) : (<Empty />)
      }
    </>
  )
}

function mapStateToProps (state) {
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps
)(List))
