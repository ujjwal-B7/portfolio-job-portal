// lib/store/store.js
"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { persistReducer } from "redux-persist";

import { rootReducer } from "@/lib/store/reducers";
import { apiMiddlewares } from "@/lib/store/middleware";
import { persistConfig } from "@/lib/store/persistConfig";

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  // middlewares
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiMiddlewares),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
