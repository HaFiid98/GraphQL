import LoginForm from '../components/LoginForm.js';
import { fetchGraph } from '../services/graphql.js';
import { currentXP } from '../components/Profile.js';
import { LineChart} from '../components/xpOverTime.js'

// Add the form to the body
LoginForm()
const userInfoQuery = { query:`
{
  user {
    id
    login
  }
  progress{
    id
  }
}
`
}
await currentXP()
console.log(await currentXP());


export function createSVG(type , attr = {}){
  const Svgelement = document.createElementNS("http://www.w3.org/2000/svg", type)
  for ( const [key , value] of Object.entries(attr)){
    Svgelement.setAttribute(key , value)
  }
  return Svgelement
}

await LineChart()
