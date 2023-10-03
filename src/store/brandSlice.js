import { createSlice } from "@reduxjs/toolkit";

const storedState = JSON.parse(localStorage.getItem("brandDetails"));


const brandUserSlice = createSlice({
    name: 'brandUser',

      
    initialState: {
        isLoggedIn: storedState?.isLoggedIn || false,
        email: storedState?.email || '', // Use stored email or empty string
        brand_id: storedState?.brand_id || '', // Use stored creator_id or empty string
        brand_name: storedState?.brand_name || '', // Use stored creator_category or empty string
        brand_category: storedState?.brand_category || '', // Use stored creator_category or empty string
    },

    reducers: {

        login: (state, action) => {
            state.isLoggedIn = true;
            state.email = action.payload.email;
            state.brand_id = action.payload.brand_id;
            state.brand_name = action.payload.brand_name;
            state.brand_category = action.payload.brand_category;
        
            const brandDetails = {
              isLoggedIn: state.isLoggedIn,
              email: state.email,
              brand_id: state.brand_id,
              brand_name: state.brand_name,
              brand_category: state.brand_category,
            };
        
            localStorage.setItem("brandDetails", JSON.stringify(brandDetails));
          },

        logout: (state) => {
            state.isLoggedIn = false;
            state.email = '';
            state.brand_id = '';
            state.brand_name = '';
            state.brand_category = '';

            localStorage.removeItem("brandDetails");
        },
    },

});

export const { login, logout } = brandUserSlice.actions;
export default brandUserSlice.reducer;