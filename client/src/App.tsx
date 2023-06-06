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
import Home from './pages/Home/HomePage';
import NotFound from './pages/NotFound/NotFoundPage';
import ProductsPage from './pages/Products/ProductsPage';
import OrdersPage from './pages/Orders/OrdersPage';
import OrderForm from './pages/Orders/OrderForm/OrderForm';
import BatchesPage from './pages/Batches/BatchesPage';
import BatchForm from './pages/Batches/BatchForm/BatchForm';
import HistoryPage from './pages/History/HistoryPage';
import ProductForm from './pages/Products/ProductForm/ProductForm';

//TOAST
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
              <Route path="products" element= {<ProductsPage />} />
              <Route path="products/:productId" element= {<ProductForm />} />
              <Route path="orders" element= {<OrdersPage />} />
              <Route path="orders/:orderId" element= {<OrderForm />} />
              <Route path="batches" element= {<BatchesPage />} />
              <Route path="batches/:batchId" element= {<BatchForm />} />
              <Route path="history" element= {<HistoryPage />} />
              <Route path="*" element= {<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer 
          position="top-center"
          autoClose={3000}/>
      </ApolloProvider>
  );
}

export default App;
