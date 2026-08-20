import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        _placeholder: (state = {}) => state, // dummy reducer just to avoid the empty-object warning
    }
})

