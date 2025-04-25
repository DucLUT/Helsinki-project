import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import matchReducer from '../reducers/matchReducer';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        match: matchReducer,

    }
})

export default store