import Brewery from './brewery'
import User from './user'
import Rating from './rating'
import { Moment } from 'moment'

export default interface Event {
    id: number,
    at: Moment,
    location: string,
    code: string,
    attendees?: User[],
    brewery: Brewery,
    ratings?: Rating[],
}
