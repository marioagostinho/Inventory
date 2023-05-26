import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//CSS
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//LAYOUT
import Layout from './pages/_layout/Layout';

//PAGES
import Home from './pages/Home/Home';
import Products from './pages/Products/Produtcs';
import Batches from './pages/Batches/Batches';
import NotFound from './pages/NotFound/NotFound';

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {}
  }),
  uri: "http://localhost:5034/graphql/"
});


function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="products" element= {<Products />} />
            <Route path="batches" element= {<Batches />} />
            <Route path="*" element= {<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
