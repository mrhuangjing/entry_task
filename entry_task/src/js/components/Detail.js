import '../../css/Detail.scss';
import { useState, useEffect } from 'react';
import gmap from '../../images/detail/gmap.png';
import { InputItem, Toast } from 'antd-mobile';
import Top from './common/Top.js';
import { withRouter } from "react-router-dom";
import model from '../api/model.js';
import moment from 'moment';
import { connect } from 'react-redux';
import $ from 'n-zepto';
import LazyLoad from 'react-lazyload';

function Detail (props) {
    const [eid, setEid] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [goingAll, setGoingAll] = useState(false);
    const [commentStr, setCommentStr] = useState('');
    const [eventInfo, setEventInfo] = useState({});
    const [participants, setParticipants] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [showCommentPanel, setShowCommentPanel] = useState(false);
    const [tabOn, setTabOn] = useState('');
    const { userInfo, location, history, lang } = props;
    const textConfig = {
        tabs: {
            details: {
                en: 'Details',
                zh: '详情'
            },
            participants: {
                en: 'Participants',
                zh: '参与者'
            },
            comments: {
                en: 'Comments',
                zh: '评论'
            }
        },
        viewAll: {
            en: 'VIEW ALL',
            zh: '查看全部'
        },
        when: {
            en: 'When',
            zh: '时间'
        },
        where: {
            en: 'Where',
            zh: '地点'
        },
        btn: {
            en: 'join',
            zh: '加入'
        }
    };

    function handleViewAll () {
        setViewAll(true);
    }

    function handleGoingBtnClick () {
        setGoingAll(!goingAll);
    }

    function handleDelete () {
        setCommentStr('');
    }

    async function queryEventInfo (id) {
        try {
            const res = await model.queryEventInfo({
                id,
                token: userInfo.token
            });
            const obj = {
                channel: res.channel.name,
                title: res.name,
                content: res.description,
                avatar: res.creator.avatar,
                username: res.creator.username,
                images: res.images,
                location: res.location,
                locationDetail: res.location_detail,
                beginTime: moment(new Date(res.begin_time)).format('YYYY/MM/DD'),
                beginTimeDetail: moment(new Date(res.begin_time)).format('hh:mm a').split(' '),
                endTime: moment(new Date(res.end_time)).format('YYYY/MM/DD'),
                endTimeDetail: moment(new Date(res.end_time)).format('hh:mm a').split(' '),
                likesCount: res.likes_count,
                goingCount: res.goings_count,
            };
            let createTime = moment(new Date(res.create_time));
            let now = moment(new Date());
            let diff = now.diff(createTime, 'day');
            obj.desc = `Published ${diff} days ago`;
            setEventInfo(obj);
        } catch (e) {

        }
    }

    async function queryParticipantList (id) {
        try {
            const res = await model.queryParticipantList({
                id,
                token: userInfo.token
            });
            const list = res.map(el => {
                return el.avatar;
            });
            setParticipants(list);
        } catch (e) {

        }
    }

    async function queryLikeList (id) {
        try {
            const res = await model.queryLikeList({
                id,
                token: userInfo.token,
                params: {
                    offset: 0,
                    limit: 25
                }
            });
            const list = res.map(el => {
                return el.avatar;
            });
            setLikes(list);
        } catch (e) {

        }
    }

    async function queryCommentList (id) {
        try {
            const res = await model.queryCommentList({
                id,
                token: userInfo.token,
                params: {
                    offset: 0,
                    limit: 25
                }
            });
            const list = res.map(el => {
                const obj = {
                    avatar: el.user.avatar,
                    username: el.user.username,
                    comment: el.comment,
                    id: el.id,
                    eventId: el.eventId
                };

                let createTime = moment(new Date(el.create_time));
                let now = moment(new Date());
                let days = now.diff(createTime, 'day');
                let hours = now.diff(createTime, 'hours');
                let mins = now.diff(createTime, 'minutes');
                let secs = now.diff(createTime, 'seconds');
                if (days >= 1) {
                    obj.desc = `${days} days ago`;
                } else if (hours >= 1) {
                    obj.desc = `${hours} hours ago`;
                } else if (mins >= 1) {
                    obj.desc = `${mins} minutes ago`;
                } else {
                    obj.desc = `${secs} seconds ago`;
                }
                return obj;
            });
            setComments(list);
        } catch (e) {

        }
    }

    async function handleSendComment () {
        if (String(commentStr).length == 0) {
            Toast.fail('发送内容不可为空哟');
            return;
        }

        try {
            await model.commentEvent({
                id: eid,
                token: userInfo.token,
                params: {
                    comment: commentStr
                }
            });
            setCommentStr('');
            setShowCommentPanel(false);
            queryCommentList(eid);
        } catch (e) {
            Toast.fail('发布评论失败，请稍后再试');
        }
    }

    async function handleCommentPerson (index) {
        setShowCommentPanel(true);
        const username = comments[index].username;
        setCommentStr(`@${username}`);
    }

    async function handleLike () {
        try {
            await model.likeEvent({
                id: eid,
                token: userInfo.token
            });
            Toast.info('点赞成功～');
        } catch (e) {
            Toast.fail('点赞失败，请稍后再试');
        }
    }

    async function handleJoin () {
        try {
            await model.joinEvent({
                id: eid,
                token: userInfo.token
            });
            Toast.info('加入活动成功～');
        } catch (e) {
            Toast.fail('加入失败，请稍后再试');
        }
    }

    useEffect(() => {
        if (location.query) {
            const id = location.query.id;
            setEid(id);
            queryEventInfo(id);
            queryParticipantList(id);
            queryLikeList(id);
            queryCommentList(id);
        } else {
            history.push('/home');
        }
    }, []);

    function handleScroll () {
        const tabs = $('#tabs');
        const tabWrapper = $('.detail_tabs_wrapper');
        const top = tabWrapper.offset().top;
        if (top <= 0) {
            tabs.css('position', 'fixed');
            tabs.css('top', '0');
            tabs.css('left', '0');
        } else {
            tabs.css('position', 'static');
            tabs.css('top', 'auto');
            tabs.css('left', 'auto');
        }

        const details = document.getElementById('details');
        const participants = document.getElementById('participants');
        const comments = document.getElementById('comments');
        const isDetailsRange = isElementInViewport(details);
        const isParticipantsRange = isElementInViewport(participants);
        const isCommentsRange = isElementInViewport(comments);
        if (isDetailsRange) {
            setTabOn('d');
        } else if (isParticipantsRange) {
            setTabOn('p');
        } else if (isCommentsRange) {
            setTabOn('c');
        }

        function isElementInViewport(el) {
            //获取元素是否在可视区域
            const rect = el.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom >= 0;
        }
    }

    return (
        <div className="detail" onScroll={handleScroll} style={{ height: `${window.innerHeight}px` }}>
            <Top />
            <div className="detail_basic">
                <div className="detail_basic_channel">
                    {eventInfo.channel}
                </div>
                <div className="detail_basic_title">
                    {eventInfo.title}
                </div>
                <div style={{ height: '1.8rem', marginBottom: '1.2rem' }}>
                    <img className="detail_basic_avatar" src={eventInfo.avatar} />
                    <div style={{ float: 'left', height: '1.8rem' }}>
                        <div className="detail_basic_username">{eventInfo.username}</div>
                        <div className="detail_basic_desc">{eventInfo.desc}</div>
                    </div>
                </div>
            </div>
            <div className="detail_tabs_wrapper">
                <div className="detail_tabs" id="tabs">
                    <a href="#details" className={["detail_tabs_item detail_tabs_item_details", tabOn == "d" ? "on" : ""].join(" ")}>
                        <span>{textConfig.tabs.details[lang]}</span>
                    </a>
                    <span>|</span>
                    <a href="#participants" className={["detail_tabs_item detail_tabs_item_participants", tabOn == "p" ? "on" : ""].join(" ")}>
                        <span>{textConfig.tabs.participants[lang]}</span>
                    </a>
                    <span>|</span>
                    <a href="#comments" className={["detail_tabs_item detail_tabs_item_comments", tabOn == "c" ? "on" : ""].join(" ")}>
                        <span>{textConfig.tabs.comments[lang]}</span>
                    </a>
                </div>
            </div>
            <div className="detail_article" id="details">
                <div className="detail_article_content">
                    {
                        eventInfo.images && eventInfo.images.length > 0 && (
                            <div className="detail_article_imgList">
                            {
                                eventInfo.images.map((el, index) => {
                                    return (
                                        <div className="detail_article_imgList_item" key={index}>
                                            <LazyLoad scrollContainer={'.detail_article_imgList'}>
                                                <img src={el} />
                                            </LazyLoad>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        )
                    }
                    <div className="detail_article_text" style={{ maxHeight: `${viewAll ? 'none' : '9rem'}` }}>
                        { eventInfo.content }
                        {
                            !viewAll && (<div className="detail_article_text_cover" onClick={handleViewAll}>
                                <span>{textConfig.viewAll[lang]}</span>
                            </div>)
                        }
                    </div>
                </div>
            </div>
            <div className="detail_when">
                <div className="detail_when_content">
                    <div className="detail_when_tag">{textConfig.when[lang]}</div>
                    <div className="detail_when_date">
                        <div className="detail_when_date_from">
                            <span>{eventInfo.beginTime}</span>
                            <div className="detail_when_date_from_time">
                                {eventInfo.beginTimeDetail && eventInfo.beginTimeDetail[0]}<span>{eventInfo.beginTimeDetail && eventInfo.beginTimeDetail[1]}</span>
                            </div>
                        </div>
                        <div className="detail_when_date_to">
                            <span>{eventInfo.endTime}</span>
                            <div className="detail_when_date_from_time">
                                {eventInfo.endTimeDetail && eventInfo.endTimeDetail[0]}<span>{eventInfo.endTimeDetail && eventInfo.endTimeDetail[1]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="detail_where" id="participants">
                <div className="detail_where_content">
                    <div className="detail_where_tag">{textConfig.where[lang]}</div>
                    <div className="detail_where_area">{eventInfo.location}</div>
                    <div className="detail_where_street">{eventInfo.locationDetail}</div>
                    <div className="detail_where_map">
                        <img src={gmap} />
                    </div>
                </div>
            </div>
            <div className="detail_related">
                <div className="detail_related_going" style={{ minHeight: goingAll ? 'none' : '3.025rem', height: goingAll ? 'auto' : '3.025rem' }}>
                    {
                        !goingAll && participants.length > 6 && (<div className="detail_related_going_btn on" onClick={handleGoingBtnClick}></div>)
                    }
                    <div className="detail_related_going_tag">{eventInfo.goingCount} going</div>
                    <div className="detail_related_going_content">
                        {
                            participants.map((el, index) => {
                                return (
                                    <div key={index}>
                                        <LazyLoad scrollContainer={'.detail'}>
                                            <img className="detail_related_going_item" src={el} />
                                        </LazyLoad>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="detail_related_likes">
                    <div className="detail_related_likes_tag">{eventInfo.likesCount} likes</div>
                    <div className="detail_related_likes_content">
                        {
                            likes.map((el, index) => {
                                return (
                                    <div className="detail_related_likes_item" key={index}>
                                        <LazyLoad scrollContainer={'.detail'}>
                                            <img src={el}/>
                                        </LazyLoad>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="detail_comments" id="comments">
                {
                    comments.map((el, index) => {
                        return (
                            <div className="detail_comments_item" key={index}>
                                <LazyLoad scrollContainer={'.detail'}>
                                    <img className="detail_comments_item_avatar" src={el.avatar} />
                                </LazyLoad>
                                <div className="detail_comments_item_username">{el.username}</div>
                                <div className="detail_comments_item_time">{el.desc}</div>
                                <div className="detail_comments_item_back" onClick={() => handleCommentPerson(index)}></div>
                                <div className="detail_comments_item_text">
                                    {el.comment}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            {
                showCommentPanel ? (
                    <div className="detail_bottom">
                        <div className="detail_bottom_edit">
                            <div className="detail_bottom_edit_delete" onClick={handleDelete}>X</div>
                            <InputItem
                                className="detail_bottom_edit_input"
                                placeholder="Leave your comment here"
                                value={commentStr}
                                onChange={(val) => setCommentStr(val)}
                            >
                            </InputItem>
                        </div>
                        <div className="detail_bottom_send" onClick={handleSendComment}></div>
                    </div>
                ) : (<div className="detail_bottom">
                    <div className="detail_bottom_left">
                        <div className="detail_bottom_left_comment" onClick={() => setShowCommentPanel(true)}></div>
                        <div className="detail_bottom_left_like" onClick={handleLike}></div>
                    </div>
                    <div className="detail_bottom_right" onClick={handleJoin}>
                        <span>{textConfig.btn[lang]}</span>
                    </div>
                </div>)
            }
        </div>
    );
}

function mapStateToProps (state) {
    return {
        userInfo: state.userInfo,
        lang: state.lang
    };
}

export default withRouter(connect(
    mapStateToProps
)(Detail));