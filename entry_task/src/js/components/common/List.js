import '../../../css/List.scss';
import { Icon, Toast } from 'antd-mobile';
import { withRouter } from "react-router-dom";
import { useState, useEffect } from 'react';
import model from '../../api/model.js';
import $ from 'n-zepto';
import tool from '../../tools/tool.js';
import store from '../../store';
import moment from 'moment';
import { connect } from 'react-redux';

function List (props) {
    const [dataList, setDataList] = useState([]);
    // const pageState = {
    //     pageSize: 5,
    //     pageNum: 0,
    //     isLoading: false,
    //     isEnd: false
    // };
    const [pageState, setPageState] = useState({
        pageSize: 5,
        pageNum: 0,
        isLoading: false,
        isEnd: false
    });
    let isUnmount = false;
    let global = {x: 1}
    let t = 99;

    function goDetail (index) {
        const id = dataList[index].id;
        // props.history.push({ pathname: '/detail', query: { id } });
    }

    async function handleCheckClick (e, index) {
        e.stopPropagation();

        try {
            await model.joinEvent({
                id: dataList[index].id,
                token: props.userInfo.token
            });
            const list = [...dataList].map((el, sub) => {
                if (sub == index) {
                    return {
                        ...el,
                        isGoing: true
                    };
                }
                return el;
            });
            setDataList(list);
        } catch (e) {
            Toast.fail('加入失败，请稍后再试');
        }
    }

    async function handleHeartClick (e, index) {
        e.stopPropagation();

        try {
            await model.likeEvent({
                id: dataList[index].id,
                token: props.userInfo.token
            });
            const list = [...dataList].map((el, sub) => {
                if (sub == index) {
                    return {
                        ...el,
                        isLike: true
                    };
                }
                return el;
            });
            setDataList(list);
        } catch (e) {
            Toast.fail('点赞失败，请稍后再试');
        }
    }

    async function queryDataList () {
        // if (pageState.isLoading || pageState.isEnd) return;
        const a = pageState.pageNum;
        global.x += 1;
        t++;
        console.log(global, t)
        setPageState({...pageState, isLoading: false, pageNum: a + 5});
        setDataList([1,2,3,4,5]);

        // const { userInfo } = store.getState();
        // try {
        //     const res = await model.queryDataList({
        //         params: {
        //             before: props.date ? props.date.start : '',
        //             after: props.date ? props.date.end : '',
        //             channels: props.channel ? props.channel.join(',') : '',
        //             offset: pageState.pageNum,
        //             limit: pageState.pageSize
        //         },
        //         token: userInfo.token
        //     });

        //     const list = res.events.map(el => {
        //         const obj = {
        //             id: el.id,
        //             avatar: el.creator.avatar,
        //             username: el.creator.username,
        //             channel: el.channel.name,
        //             title: el.name,
        //             time: `${moment(el.begin_time).format('YYYY/MM/DD HH:mm')}-${moment(el.end_time).format('YYYY/MM/DD HH:mm')}`,
        //             content: el.description,
        //             isGoing: el.me_going,
        //             isLike: el.me_likes,
        //             likesCount: el.likes_count,
        //             goingsCount: el.goings_count
        //         };
        //         if (el.images && el.images.length) {
        //             if (el.images[1]) {
        //                 obj.pic = el.images[1];
        //             } else {
        //                 obj.pic = el.images[0];
        //             }
        //         }
        //         return obj;
        //     });

        //     if (props.transferResult) {
        //         props.transferResult(res.total);
        //     }

        //     if (!isUnmount) {
        //         setDataList(dataList.concat(list));
        //     }
        //     if (!res.hasMore) {
        //         pageState.isEnd = true;
        //     }
        //     pageState.pageNum += pageState.pageSize;
        //     // pageState.isLoading = false;
        // } catch (e) {
        //     console.log('ppppp', e)
        //     pageState.isEnd = true;
        // }
    }

    useEffect(() => {
        pageState.pageNum = 0;
        setDataList([]);
        queryDataList();

        return () => {
            isUnmount = true;
            $(window).off('scroll');
        };
    }, [props]);

    // 翻页判断
    function isNext () {
        const $el = $('.list_content');
        if ($el.length) {
            const elOffset = $el.offset();
            const elBottom = elOffset.top + elOffset.height;
            const winBottom = tool.getScrollTop() + $(window).height();
            // console.log(winBottom , elBottom)
            return winBottom > elBottom - 5;
        }
    }

    function onScrollNext () {
        // const fn = tool.throttle(() => {
            console.log('++', pageState)
            // if (isNext() && !pageState.isLoading && !pageState.isEnd) {
                queryDataList();
            // }
        // }, 0.5);
        // fn();
    }

    // 滚动事件绑定
    // $(window).on('scroll', tool.throttle(onScrollNext, 0.5));

    return (
        <div className="list_content" style={{ height: `${window.innerHeight}px` }} onScroll={onScrollNext}>
            {
                dataList.map((el, index) => {
                    return (
                        <div className="list_content_item" key={ index } onClick={() => goDetail(index)}>
                            <div className="list_content_item_line">
                                <img className="list_content_item_avatar" src={ el.avatar } />
                                <div className="list_content_item_username">{ el.username }</div>
                                <div className="list_content_item_channel">{ el.channel }</div>
                            </div>
                            <div className="list_content_item_title" style={{ width: `${el.pic ? '10.8rem' : '14.4rem'}` }}>
                                { el.title }
                            </div>
                            {
                                el.pic && <img className="list_content_item_pic" src={ el.pic } />
                            }
                            <div className="list_content_item_time">{ el.time }</div>
                            <div className="list_content_item_con">
                                { el.content }
                            </div>
                            <div className="list_content_item_line">
                                <div className={["list_content_item_actIcon", el.isGoing ? "on" : ""].join(" ")} onClick={(e) => handleCheckClick(e, index)}></div>
                                <div className={["list_content_item_actDesc", el.isGoing ? "on" : ""].join(" ")} onClick={(e) => handleCheckClick(e, index)}>{el.isGoing ? 'I am going!' : `${el.goingsCount} Going`}</div>
                                <div className={["list_content_item_likeIcon", el.isLike ? "on" : ""].join(" ")} onClick={(e) => handleHeartClick(e, index)}></div>
                                <div className={["list_content_item_likeDesc", el.isLike ? "on" : ""].join(" ")} onClick={(e) => handleHeartClick(e, index)}>{el.isLike ? 'I like it' : `${el.likesCount} Likes`}</div>
                            </div>
                        </div>
                    );
                })
            }
            {/* {
                [1,2,3,4,5].map((el, index) => {
                    return (<div className="list_content_item" key={index}>
                    <div className="list_content_item_line">
                        <img className="list_content_item_avatar"  />
                        <div className="list_content_item_username"></div>
                        <div className="list_content_item_channel"></div>
                    </div>
                    <div className="list_content_item_title" >
                        
                    </div>
                    <div className="list_content_item_time"></div>
                    <div className="list_content_item_con">
                        
                    </div>
                    <div className="list_content_item_line">
                        
                    </div>
                </div>);
                })
            } */}
            
            {
                dataList.length ? (<div className="list_content_loading">
                    <Icon type="loading" className="list_content_loading_icon" />
                </div>) : ''
            }
        </div>
    );
}

function mapStateToProps (state) {
    return {
        userInfo: state.userInfo
    };
}

export default withRouter(connect(
    mapStateToProps
)(List));