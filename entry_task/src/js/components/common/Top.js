import '../../../css/Top.scss'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

function Top (props) {
  function goHome () {
    props.history.push('/home')
  }

  function goMe () {
    props.history.push('/me')
  }

  return (
    <div className='top'>
      <div className='top_home' onClick={goHome} />
      <div className='top_cat' />
      <img className='top_me' src={props.userInfo.user.avatar} onClick={goMe} />
    </div>
  )
}

function mapStateToProps (state) {
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps
)(Top))
