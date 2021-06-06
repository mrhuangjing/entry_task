import '../../css/Home.scss';
import { useState } from 'react';
import Filter from './Filter.js';
import { withRouter } from "react-router-dom";
import List from './common/List.js';
import Empty from './common/Empty.js';
import { connect } from 'react-redux';

function Home (props) {
    const [showFilter, setShowFilter] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [filterChannel, setFilterChannel] = useState('');
    const [filterDesc, setFilterDesc] = useState('No activities anytime');
    const [showResult, setShowResult] = useState(false);
    const [resultNum, setResultNum] = useState(-1);
    const { userInfo, history } = props;

    function handleSearchClick () {
        setShowFilter(!showFilter);
    }

    function goMe () {
        history.push('/me');
    }

    function handleSearch (date, channel, desc) {
        setFilterDate(date);
        setFilterChannel(channel);
        setFilterDesc(desc);
        setShowFilter(!showFilter);
        setShowResult(true);
    }

    function handleClearSearch () {
        setFilterDate('');
        setFilterChannel('');
        setFilterDesc('No activities anytime');
        setShowResult(false);
    }

    return (
        <>
            <Filter transferFilter={handleSearch} list={[]}/>
            <div className="home" style={{ left: showFilter ? '12rem' : '0', minHeight: `${window.innerHeight}px` }}>
                <div className="home_top">
                    <div className="home_top_search" onClick={() => handleSearchClick()}></div>
                    <div className="home_top_cat"></div>
                    <img className="home_top_me" src={userInfo.user.avatar} onClick={goMe}/>
                </div>
                {
                    showResult && (<div className="home_result">
                        <div className="home_result_num">{resultNum} Results</div>
                        <div className="home_result_btn" onClick={handleClearSearch}>
                            <span>CLEAR SEARCH</span>
                        </div>
                        <div className="home_result_desc">
                            <span>
                                {`Searched for ${filterDesc}`}
                            </span>
                        </div>
                    </div>)
                }
                {
                    resultNum == 0 && (<Empty />)
                }
                <List date={filterDate} channel={filterChannel} transferResult={(total) => setResultNum(total)}/>
            </div>
        </>
    );
}

function mapStateToProps (state) {
    return {
        userInfo: state.userInfo
    };
}

export default withRouter(connect(
    mapStateToProps
)(Home));