import React, { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { theme } from './theme'
import { PrivateRoute } from './components'
import { Checker, Landing, Debug, Login, Dashboard, FormBuilder } from './pages'
import { AuthProvider, CheckerProvider } from './contexts'

const queryClient = new QueryClient()

const App: FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path="/c/:id" component={Checker} />
              <Route exact path="/debug" component={Debug} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Landing} />

              <PrivateRoute>
                <Route exact path="/dashboard" component={Dashboard} />
                {/* TO-DO: Rename CheckerProvider to BuilderProvider and context */}
                <CheckerProvider>
                  <Route exact path="/builder/:id" component={FormBuilder} />
                </CheckerProvider>
              </PrivateRoute>
              <Redirect to="/" />
            </Switch>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
export default App
