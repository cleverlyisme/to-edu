import { store } from 'react-notifications-component'

export default noti => {
    const { title, message, type } = noti

    store.addNotification({
        title,
        message,
        type,
        insert: "top",
        container: "bottom-left",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000,
          showIcon: true
        },
        width: 400
    })
}