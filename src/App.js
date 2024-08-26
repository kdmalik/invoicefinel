import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Setting } from './components/Setting';
import { Invoice } from './components/Invoice';
import { NewInvoice } from './components/NewInvoice';
import { Home } from './components/Home';
import { InvoiceDetails } from './components/InvoiceDetails';
import { UpdateFile } from './components/UpdateFile';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/updatefile' element={<UpdateFile/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/dashboard' element={<Dashboard />}>
            <Route path='home' element={<Home />} />
            <Route path='invoice' element={<Invoice />} />
            <Route path='newinvoice' element={<NewInvoice />} />
            <Route path='setting' element={<Setting />} />
            <Route path='invoicedetail/' element ={<InvoiceDetails/>} />
            <Route index element={<Home />} /> 
          </Route>
          
          <Route path='/setting' element={<Setting />} />
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/newinvoice' element={<NewInvoice />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
