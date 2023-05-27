import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//CSS
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

//LAYOUT
import Layout from './pages/_layout/Layout';

//PAGES
import Home from './pages/Home/Home';
import Products from './pages/Products/ProductsPage';
import Batches from './pages/Batches/BatchesPage';
import NotFound from './pages/NotFound/NotFound';
import Orders from './pages/Orders/Orders';
import BatchForm from './pages/Batches/BatchForm/BatchForm';

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
            <Route path="batches/:batchId" element= {<BatchForm />} />
            <Route path="orders" element= {<Orders />} />
            <Route path="*" element= {<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
