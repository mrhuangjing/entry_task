import '../../css/Me.scss'
import Top from './common/Top.js'
import Empty from './common/Empty.js'
import List from './common/List.js'
import { connect } from 'react-redux'
import { useState } from 'react'

function Me (props) {
  const [type, setType] = useState('likes')
  const [showEmpty, setShowEmpty] = useState(false)
  const { userInfo, lang } = props
  const textConfig = {
    tabs: {
      likes: {
        en: 'Likes',
        zh: '喜欢的'
      },
      going: {
        en: 'Going',
        zh: '参与的'
      },
      past: {
        en: 'Past',
        zh: '过去的'
      }
    }
  }

  function handleResult (total, noResult) {
    noResult && setShowEmpty(true)
  }

  function handleLikes () {
    setType('likes')
    setShowEmpty(false)
  }

  function handleGoing () {
    setType('going')
    setShowEmpty(false)
  }

  function handlePast () {
    setType('past')
    setShowEmpty(false)
  }

  return (
    <>
      <Top />
      <div className='me' style={{ height: `${window.innerHeight - 50}px` }}>
        <div className='me_info'>
          <div className='me_info_icon'>
            <img className='me_info_icon_avatar' src={userInfo.user.avatar} />
          </div>
          <div className='me_info_username'>{userInfo.user.username}</div>
          <div className='me_info_email'>
            <span>{userInfo.user.email}</span>
          </div>
        </div>
        <div className='me_tabs'>
          <a href='#likes' className={['me_tabs_item me_tabs_item_likes', type == 'likes' ? 'on' : ''].join(' ')} onClick={handleLikes}>
            <span>{textConfig.tabs.likes[lang]}</span>
          </a>
          <span>|</span>
          <a href='#going' className={['me_tabs_item me_tabs_item_going', type == 'going' ? 'on' : ''].join(' ')} onClick={handleGoing}>
            <span>{textConfig.tabs.going[lang]}</span>
          </a>
          <span>|</span>
          <a href='#past' className={['me_tabs_item me_tabs_item_past', type == 'past' ? 'on' : ''].join(' ')} onClick={handlePast}>
            <span>{textConfig.tabs.past[lang]}</span>
          </a>
        </div>
        {
                  showEmpty ? (<Empty />) : (<List type={type} transferResult={handleResult} />)
              }
      </div>
    </>
  )
}

function mapStateToProps (state) {
  return {
    userInfo: state.userInfo,
    lang: state.lang
  }
}

export default connect(
  mapStateToProps
)(Me)
