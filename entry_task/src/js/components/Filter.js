import '../../css/Filter.scss';
import { useState, useEffect } from 'react';
import { DatePicker } from 'antd-mobile';
import tool from '../tools/tool.js';
import model from '../api/model.js';
import store from '../store';
import moment from 'moment';

function Filter (props) {
    const [laterStart, setLaterStart] = useState(new Date());
    const [laterEnd, setLaterEnd] = useState(new Date());
    const [desc, setDesc] = useState('No activities anytime');
    const dates = [
        {
            en: 'ANYTIME',
            start: '',
            end: ''
        }, {
            en: 'TODAY',
            start: moment().startOf('day').valueOf(),
            end: moment().endOf('day').valueOf()
        }, {
            en: 'TOMORROW',
            start: moment(new Date()).add(1,'days').valueOf(),
            end: moment(new Date()).add(1,'days').valueOf()
        }, {
            en: 'THIS WEEK',
            start: moment().startOf('isoWeek').valueOf(),
            end: moment().endOf('isoWeek').valueOf()
        }, {
            en: 'THIS MONTH',
            start: moment().startOf('month').valueOf(),
            end: moment().endOf('month').valueOf()
        }, {
            en: 'LATER'
        }
    ];
    const [chosenDate, setChosenDate] = useState(0);

    function modifyDesc (dateIndex, channelDesc) {
        let desc = ['activities'];
        let cDesc = [];
        if (!channelDesc) {
            channels.forEach(el => {
                if (el.on) {
                    cDesc.push(el.en);
                }
            });
        } else {
            cDesc = channelDesc;
        }

        if (dateIndex == 0) {
            desc.push('anytime');
        } else {
            let start, end;
            if (dateIndex == dates.length - 1) {
                start = moment(laterStart).format('YYYY-MM-DD');
                end = moment(laterEnd).format('YYYY-MM-DD');
            } else {
                start = moment(dates[dateIndex].start).format('YYYY-MM-DD');
                end = moment(dates[dateIndex].end).format('YYYY-MM-DD');
            }
            desc.push(`from ${start} to ${end}`);
        }
        desc.unshift(cDesc.join(','));
        setDesc(desc.join(' '));
    }

    function handleSelectDate (index) {
        setChosenDate(index);
        modifyDesc(index);
    }

    const [channels, setChannels] = useState([]);

    function handleSelectChannel (index) {
        let channelDesc = [];
        const data = channels.map((el, sub) => {
            if (sub == index) {
                if (!el.on) channelDesc.push(el.en);
                return {
                    ...el,
                    on: !el.on
                };
            }
            if (el.on) channelDesc.push(el.en);
            return el;
        });
        setChannels(data);
        modifyDesc(chosenDate, channelDesc);
    }

    async function queryChannels () {
        try {
            const { userInfo } = store.getState();
            const res = await model.queryChannels({
                token: userInfo.token
            });
            setChannels(res.map(el => {
                return {
                    en: el.name,
                    val: el.id
                };
            }));
        } catch (e) {
            // 拉取channel失败
        }
    }

    useEffect(() => {
        queryChannels();
    }, []);

    function handleSearch () {
        const selectedChannels = channels.filter(el => {
            return el.on;
        }).map(el => {
            return el.val;
        });
        let date = {};
        if (chosenDate == dates.length - 1) {
            date.start = moment(laterStart).valueOf();
            date.end = moment(laterEnd).valueOf();
        } else {
            date.start = dates[chosenDate].start;
            date.end = dates[chosenDate].end;
        }
        props.transferFilter(date, selectedChannels, desc);
    }

    return (
        <div className="filter">
            <div className="filter_date">DATE</div>
            <div className="filter_date_content">
                {
                    dates.map((el, index) => {
                        return <div className={["filter_date_content_opt", index == chosenDate ? "on" : ""].join(" ")} key={index} onClick={() => handleSelectDate(index)}>{el.en}</div>;
                    })
                }
            </div>
            {
                chosenDate == dates.length - 1 && (<div className="filter_later">
                    <div className="filter_later_left_arrow"></div>
                    <DatePicker
                        value={laterStart}
                        minDate={new Date()}
                        mode="date"
                        onChange={val => setLaterStart(val)}
                    >
                        <div className="filter_later_start" >{tool.formatDate(laterStart)}</div>
                    </DatePicker>
                    <span>-</span>
                    <div className="filter_later_right_arrow"></div>
                    <DatePicker
                        value={laterEnd}
                        mode="date"
                        minDate={new Date()}
                        onChange={val => setLaterEnd(val)}
                    >
                        <div className="filter_later_end" >{tool.formatDate(laterEnd)}</div>
                    </DatePicker>
                </div>)
            }
            <div className="filter_channel">CHANNEL</div>
            <div className="filter_channel_content">
                {
                    channels.map((el, index) => {
                        return <div className={["filter_channel_content_opt", el.on ? "on" : ""].join(" ")} key={index} onClick={() => handleSelectChannel(index)}>{el.en}</div>;
                    })
                }
            </div>
            <div className="filter_search" onClick={handleSearch} style={{ top: `${window.innerHeight}px` }}>
                <div className="filter_search_name">SEARCH</div>
                <div className="filter_search_desc">{desc}</div>
            </div>
        </div>
    );
}

export default Filter;