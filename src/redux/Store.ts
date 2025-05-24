import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./RootReducer";
import { conversationsTransform } from "./transformChats";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["conversations"],
  transforms: [conversationsTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store using configureStore
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);