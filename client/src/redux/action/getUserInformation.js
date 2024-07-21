import getUserInformationFromAccessToken from '../../utils/api/getUserInformationFromAccessToken'
import getUserInformationAndNewAccessToken from '../../utils/api/getUserInformationAndNewAccessToken'

import setUserInformation from './setUserInformation'

export default () => async dispatch => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const accessFrom = localStorage.getItem('access_from')

    try {
        if (accessToken && accessFrom) {
            const accessTokenDaysUsed = (new Date().getTime() - accessFrom)/86400000
        
            if (accessTokenDaysUsed < 1) {
                const res =  await getUserInformationFromAccessToken()

                dispatch(setUserInformation(res.data))

                return true
            } else if (refreshToken) {
                const res = await getUserInformationAndNewAccessToken()
    
                dispatch(setUserInformation(res.data))
                localStorage.setItem('access_token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                localStorage.setItem('access_from', res.data.access_from)

                return true
            } else {
                return false
            }
        } else if (refreshToken) {
            const res = await getUserInformationAndNewAccessToken()
    
            dispatch(setUserInformation(res.data))
            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('refresh_token', res.data.refresh_token)
            localStorage.setItem('access_from', res.data.access_from)

            return true
        } else {
            return false
        }
    } catch(err) {
        console.log(err.message)
    }
}