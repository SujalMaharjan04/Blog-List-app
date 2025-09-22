import { createContext } from "react";
import { useReducer } from "react";

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET_NOTIFICATION":
            return action.payload
        case "CLEAR_NOTIFICATION":
            return null
        default: 
            return state
    }
}

const userReducer = (state, action) => {
    switch(action.type) {
        case 'SET_USER':
            return action.payload
        case 'CLEAR_USER':
            return null
        default: 
            return state
    }
}



export const UserContext = createContext()
export const NotificationContext = createContext()


export const NotificationContextProvider = (props) => {
    const [notification, dispatchNotification] = useReducer(notificationReducer, {text: null, type: null})

    return (
        <NotificationContext.Provider value = {[notification, dispatchNotification]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const UserContextProvider = (props) => {
    const [user, dispatchUser] = useReducer(userReducer, null)

    return (
        <UserContext.Provider value = {[user, dispatchUser]}>
            {props.children}
        </UserContext.Provider>
    )
}

