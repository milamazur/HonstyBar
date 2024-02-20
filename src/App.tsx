import './App.css'
import { Button, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { baseTheme } from './styles/themes/theme'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import axios from "axios";
import SuccesPage from './pages/SuccesPage'
import AddStockPage from './pages/AddStockPage'
import QRCodePage from './pages/QRCodePage'
import { Timer } from './components/Timer'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { reactPlugin } from './AppInsights'
import  withAITracking  from './AppInsights'

axios.defaults.baseURL = import.meta.env.HONESTYBAR_API_URL;

function App() {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <ChakraProvider>
        <div className="App">
          <Timer>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/order/:userId' element={<OrderPage />} />
              <Route path='/succes/:userId' element={<SuccesPage />} />
              <Route path='/stock/add' element={<AddStockPage />} />
              <Route path='/qr/:userId' element={<QRCodePage />} />
            </Routes>
          </Timer>
        </div>
      </ChakraProvider>
    </AppInsightsContext.Provider>
  )
}

export default withAITracking(App);
