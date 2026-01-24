// import Menu from './components/Menu'
// import ShowCard from './components/ShowCard';
import './index.css'
import ShowCart from './components/ShowCart'
import GlobalState from './components/GlobalState'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useState } from 'react'
// import Filter from './components/Header/Filter'
// import TypeProducts from './components/TypeProducts'
// import ShowInforLine from './components/ShowInforLine'
import Payment from './components/Payment/Payment'
import Admin from './Admin'
import Orders from './components/Orders/Orders'
import KingOfFilter from './components/Header/KingOfFilter'
import Navigation from './components/Navigation/Navigation'

function App() {
  const [idType, setIdType] = useState(-1)
  function ChangeForIdType(id) {
    setIdType(id)
  }
  return (
    <>
      <Router>
        <GlobalState>
          <Navigation />
          <ShowCart />
          <Switch>
            <Route exact path='/'>
              <KingOfFilter x={ChangeForIdType} typeId={idType}/>
            </Route>
            <Route path='/payment' component={Payment} />
            <Route path='/orders' component={Orders} />
            <Route path='/admin' component={Admin} />
          </Switch>
        </GlobalState>
      </Router>
    </>
  )
}

export default App
