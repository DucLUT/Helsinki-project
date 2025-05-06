import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import matchReducer from '../reducers/matchReducer';
import messageReducer from '../reducers/messageReducer';
import aiReducer from '../reducers/aiReducer';
import suggestReducer from '../reducers/suggestReducer';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        match: matchReducer,
        message: messageReducer,
        ai: aiReducer,
        suggest: suggestReducer,

    }
})

export default store