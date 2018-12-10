import Rating from './rating'

export default interface Brewery {
    id: number,
    name: string,
    visited: boolean,
    ratings?: Rating[],
    events?: Event[]
}
