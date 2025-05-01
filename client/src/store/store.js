import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import matchReducer from '../reducers/matchReducer';
import messageReducer from '../reducers/messageReducer';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        match: matchReducer,
        message: messageReducer,

    }
})

export default store