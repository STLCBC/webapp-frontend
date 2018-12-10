import Event from './event'
import Rating from './rating'

export default interface User {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    isAdmin: boolean,
    events?: Event[],
    ratings?: Rating[],
}
