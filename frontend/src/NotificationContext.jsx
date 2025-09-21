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



const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, dispatchNotification] = useReducer(notificationReducer, {text: null, type: null})

    return (
        <NotificationContext.Provider value = {[notification, dispatchNotification]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext