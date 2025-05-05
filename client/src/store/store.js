import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import matchReducer from '../reducers/matchReducer';
import messageReducer from '../reducers/messageReducer';
import aiReducer from '../reducers/aiReducer';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        match: matchReducer,
        message: messageReducer,
        ai: aiReducer,

    }
})

export default store