import { configureStore, createSlice } from '@reduxjs/toolkit';
import { getToken, setToken, removeToken } from '../utils/auth'

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    userId: '',
    product: 'hotel',
    apiToken: '',
    permissionArr: []
  },
  reducers: {
    updateTokenState: (state, action) => {
      state.token = action.payload;
    }
  }
})

export const { updateTokenState } = userSlice.actions;
export const getTokenState = (state: any) => state.userSlice.token

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
})
