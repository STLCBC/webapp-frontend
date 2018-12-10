import Brewery from './brewery'
import User from './user'
import Rating from './rating'

export default interface Event {
    id: number,
    at: string,
    location: string,
    code: string,
    attendees?: User[],
    brewery: Brewery,
    ratings?: Rating[],
}
