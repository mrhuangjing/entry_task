import initState from './state';

function reducer(state = initState, action) {
    switch (action.type) {
        case 'SET_USERINFO':
            return {...state, userInfo: action.userInfo};
        default:
            return state;
    }
}

export default reducer;