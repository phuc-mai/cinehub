import { fetchTrending } from "@actions/movieData"
import HeroCard from "./HeroCard"

const Hero = async () => {
  const trending = await fetchTrending()
  const randonNumber = Math.floor(Math.random() * trending.length)
  const trendingMovie = trending[randonNumber]

  return (
    <div>
      <HeroCard trendingMovie={trendingMovie}/>
    </div>
  )
}

export default Hero