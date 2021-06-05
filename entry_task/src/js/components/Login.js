import '../../css/Login.scss';
import backPic from '../../images/login/back.jpg';
import userIcon from '../../images/login/user.svg';
import pwdIcon from '../../images/login/password.svg';
import { InputItem, Toast, Button } from 'antd-mobile';
import { useState, useEffect } from 'react';
import model from '../api/model.js';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

function Login (props) {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const { setUserInfo } = props;

    async function handleSignIn () {
        if (!user) {
            Toast.info('请输入用户名');
            return;
        }
        if (!pwd) {
            Toast.info('请输入密码');
            return;
        }

        try {
            const res = await model.login({
                username: user,
                password: pwd
            });
            setUserInfo(res);
            Toast.success('登录成功', 1, () => {
                props.history.push('/home');
            });
        } catch (e) {
            Toast.fail(`登录失败 ${e}`);
        }
    }

    async function register () {
        try {
            const res = await model.register();
        } catch (e) {
            console.log('注册新用户失败，错误信息：', e);
        }
    }

    useEffect(() => {
        register();
    }, []);

    return (
        <div className="login" style={{ height: `${window.innerHeight}px` }}>
            <img className="login_back_pic" src={backPic} />
            <div className="login_cover"></div>
            <div className="login_desc_1">
                FIND THE MOST LOVED ACTIVITIES
            </div>
            <div className="login_desc_2">
                BLACK CAT
            </div>
            <div className="login_icon" ></div>
            <InputItem
                className="login_input login_user"
                value={user}
                onChange={(val) => setUser(val)}
                placeholder="Username"
            >
            <div style={{ backgroundImage:`url(${userIcon})`, backgroundSize:'cover', height:'0.665rem', width:'0.665rem', filter: 'invert(100%)'}}/>
            </InputItem>
            <InputItem
                className="login_input login_pwd"
                type="password"
                value={pwd}
                onChange={(val) => setPwd(val)}
                placeholder="Password"
            >
            <div style={{ backgroundImage:`url(${pwdIcon})`, backgroundSize:'cover', height:'0.665rem', width:'0.665rem', filter: 'invert(100%)'}}/>
            </InputItem>
            <Button type="primary" className="login_btn" activeClassName="login_btn_active" style={{ borderRadius: '0', color: '#453257', fontSize: '16px' }} onClick={handleSignIn}>SIGN IN</Button>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (info) => dispatch({
            type: 'SET_USERINFO',
            userInfo: info
        })
    };
};

export default withRouter(connect(
    null,
    mapDispatchToProps
)(Login));