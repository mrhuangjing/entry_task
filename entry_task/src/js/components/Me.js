import '../../css/Me.scss';
import Top from './common/Top.js';
import Empty from './common/Empty.js';
import List from './common/List.js';
import { connect } from 'react-redux';

function  Me (props) {

    return (
        <div className="me">
            <Top />
            <div className="me_info">
                <div className="me_info_icon">
                    <img className="me_info_icon_avatar" src={props.userInfo.user.avatar} />
                </div>
                <div className="me_info_username">{props.userInfo.user.username}</div>
                <div className="me_info_email">
                    <span>{props.userInfo.user.email}</span>
                </div>
            </div>
            <div className="me_tabs">
                <a href="#likes" className="me_tabs_item me_tabs_item_likes on">
                    <span>Likes</span>
                </a>
                <span>|</span>
                <a href="#going" className="me_tabs_item me_tabs_item_going on">
                    <span>Going</span>
                </a>
                <span>|</span>
                <a href="#past" className="me_tabs_item me_tabs_item_past on">
                    <span>Past</span>
                </a>
            </div>
            {/* <Empty /> */}
            <List />
        </div>
    );
}

function mapStateToProps (state) {
    return {
        userInfo: state.userInfo
    };
}

export default connect(
    mapStateToProps
)(Me);