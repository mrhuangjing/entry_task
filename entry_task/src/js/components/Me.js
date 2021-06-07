import '../../css/Me.scss'
import Top from './common/Top.js'
import List from './common/List.js'
import { connect } from 'react-redux'
import { useState } from 'react'

function Me (props) {
  const [type, setType] = useState('likes')
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
          <a href='#likes' className={['me_tabs_item me_tabs_item_likes', type == 'likes' ? 'on' : ''].join(' ')} onClick={() => setType('likes')}>
            <span>{textConfig.tabs.likes[lang]}</span>
          </a>
          <span>|</span>
          <a href='#going' className={['me_tabs_item me_tabs_item_going', type == 'going' ? 'on' : ''].join(' ')} onClick={() => setType('going')}>
            <span>{textConfig.tabs.going[lang]}</span>
          </a>
          <span>|</span>
          <a href='#past' className={['me_tabs_item me_tabs_item_past', type == 'past' ? 'on' : ''].join(' ')} onClick={() => setType('past')}>
            <span>{textConfig.tabs.past[lang]}</span>
          </a>
        </div>
        <List type={type} />
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
