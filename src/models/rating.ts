import Brewery from './brewery'
import User from './user'

export default interface Rating {
    id: number,
    beer: number,
    experience: number,
    brewery: Brewery,
    user: User,
}
