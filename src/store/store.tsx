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

const tabSlice = createSlice({
  name: 'tabSlice',
  initialState: {
    curTab: undefined,
    rawHTML: '',
  },
  reducers: {
    updateCurTab: (state, action) => {
      state.curTab = action.payload;
    },
    updateRawHTML: (state, action) => {
      state.rawHTML = action.payload;
    }
  }
})

export const { updateTokenState } = userSlice.actions;
export const { updateCurTab, updateRawHTML } = tabSlice.actions;

export const getTokenState = (state: any) => state.user.token
export const getCurTabState = (state: any) => state.tab.curTab
export const getRawHTMLState = (state: any) => state.tab.rawHTML

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    tab: tabSlice.reducer
  },
})
