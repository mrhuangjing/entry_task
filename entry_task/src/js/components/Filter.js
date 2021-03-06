import '../../css/Filter.scss'
import { useState, useEffect } from 'react'
import { DatePicker } from 'antd-mobile'
import tool from '../tools/tool.js'
import model from '../api/model.js'
import store from '../store'
import moment from 'moment'
import { connect } from 'react-redux'

function Filter (props) {
  const [laterStart, setLaterStart] = useState(new Date())
  const [laterEnd, setLaterEnd] = useState(new Date())
  const [desc, setDesc] = useState('No activities anytime')
  const dates = [
    {
      en: 'ANYTIME',
      zh: '任何时候',
      start: '',
      end: ''
    }, {
      en: 'TODAY',
      zh: '今天',
      start: moment().startOf('day').valueOf(),
      end: moment().endOf('day').valueOf()
    }, {
      en: 'TOMORROW',
      zh: '明天',
      start: moment(new Date()).add(1, 'days').valueOf(),
      end: moment(new Date()).add(1, 'days').valueOf()
    }, {
      en: 'THIS WEEK',
      zh: '本周',
      start: moment().startOf('isoWeek').valueOf(),
      end: moment().endOf('isoWeek').valueOf()
    }, {
      en: 'THIS MONTH',
      zh: '本月',
      start: moment().startOf('month').valueOf(),
      end: moment().endOf('month').valueOf()
    }, {
      en: 'LATER',
      zh: '本日及之后'
    }
  ]
  const [chosenDate, setChosenDate] = useState(0)
  const { transferFilter, lang } = props
  const textConfig = {
    date: {
      title: {
        en: 'DATE',
        zh: '日  期'
      }
    },
    channel: {
      title: {
        en: 'CHANNEL',
        zh: '频  道'
      }
    }
  }

  function modifyDesc (dateIndex, channelDesc) {
    const desc = ['activities']
    let cDesc = []
    if (!channelDesc) {
      channels.forEach(el => {
        if (el.on) {
          cDesc.push(el.en)
        }
      })
    } else {
      cDesc = channelDesc
    }

    if (dateIndex == 0) {
      desc.push('anytime')
    } else {
      let start, end
      if (dateIndex == dates.length - 1) {
        start = moment(laterStart).format('YYYY-MM-DD')
        end = moment(laterEnd).format('YYYY-MM-DD')
      } else {
        start = moment(dates[dateIndex].start).format('YYYY-MM-DD')
        end = moment(dates[dateIndex].end).format('YYYY-MM-DD')
      }
      desc.push(`from ${start} to ${end}`)
    }
    desc.unshift(cDesc.join(','))
    setDesc(desc.join(' '))
  }

  function handleSelectDate (index) {
    setChosenDate(index)
    modifyDesc(index)
  }

  const [channels, setChannels] = useState([])

  function handleSelectChannel (index) {
    const channelDesc = []
    const data = channels.map((el, sub) => {
      if (sub == index) {
        if (!el.on) channelDesc.push(el.en)
        return {
          ...el,
          on: !el.on
        }
      }
      if (el.on) channelDesc.push(el.en)
      return el
    })
    setChannels(data)
    modifyDesc(chosenDate, channelDesc)
  }

  async function queryChannels () {
    try {
      const { userInfo } = store.getState()
      const res = await model.queryChannels({
        token: userInfo.token
      })
      setChannels(res.map(el => {
        return {
          en: el.name,
          val: el.id
        }
      }))
    } catch (e) {
      // 拉取channel失败，则不显示即可
    }
  }

  useEffect(() => {
    queryChannels()
  }, [])

  function handleSearch () {
    const selectedChannels = channels.filter(el => {
      return el.on
    }).map(el => {
      return el.val
    })
    const date = {}
    if (chosenDate == dates.length - 1) {
      date.start = moment(laterStart).valueOf()
      date.end = moment(laterEnd).valueOf()
    } else {
      date.start = dates[chosenDate].start
      date.end = dates[chosenDate].end
    }
    transferFilter(date, selectedChannels, desc)
  }

  return (
    <div className='filter'>
      <div className='filter_date'>{textConfig.date.title[lang]}</div>
      <div className='filter_date_content'>
        {
                    dates.map((el, index) => {
                      return <div className={['filter_date_content_opt', index == chosenDate ? 'on' : ''].join(' ')} key={index} onClick={() => handleSelectDate(index)}>{el[lang]}</div>
                    })
                }
      </div>
      {
                chosenDate == dates.length - 1 && (<div className='filter_later'>
                  <div className='filter_later_left_arrow' />
                  <DatePicker
                    value={laterStart}
                    minDate={new Date()}
                    mode='date'
                    onChange={val => setLaterStart(val)}
                  >
                    <div className='filter_later_start'>{tool.formatDate(laterStart)}</div>
                  </DatePicker>
                  <span>-</span>
                  <div className='filter_later_right_arrow' />
                  <DatePicker
                    value={laterEnd}
                    mode='date'
                    minDate={new Date()}
                    onChange={val => setLaterEnd(val)}
                  >
                    <div className='filter_later_end'>{tool.formatDate(laterEnd)}</div>
                  </DatePicker>
                </div>)
            }
      <div className='filter_channel'>{textConfig.channel.title[lang]}</div>
      <div className='filter_channel_content'>
        {
                    channels.map((el, index) => {
                      return <div className={['filter_channel_content_opt', el.on ? 'on' : ''].join(' ')} key={index} onClick={() => handleSelectChannel(index)}>{el.en}</div>
                    })
                }
      </div>
      <div className='filter_search' onClick={handleSearch} style={{ top: `${window.innerHeight}px` }}>
        <div className='filter_search_name'>SEARCH</div>
        <div className='filter_search_desc'>{desc}</div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    lang: state.lang
  }
}

export default connect(
  mapStateToProps
)(Filter)
