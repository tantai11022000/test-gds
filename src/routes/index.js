import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Customer from '../containers/Customer/Customer';
import Employee from '../containers/Employee/Employee';
import Order from '../containers/Order/Order';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddCustomer from '../containers/Customer/AddCustomer';
import AddEmployee from '../containers/Employee/AddEmployee';
import AddOrder from '../containers/Order/AddOrder';
import MyChart from '../containers/Chart/MyChart';
function MyRoutes() {
    return (
        <div style={{marginTop: '100px'}}>
            <Switch>
                <Route exact path="/" component={Customer}/>
                <Route path="/customer/:id" component={AddCustomer}/>
                <Route exact path="/employee" component={Employee} />
                <Route path="/employee/:id" component={AddEmployee}/>
                <Route exact path="/order" component={Order}/>
                <Route path="/order/:id" component={AddOrder}/>
                <Route exact path="/chart" component={MyChart}></Route>
                <Redirect to="/" ></Redirect>
            </Switch>
            <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
    );
}

export default MyRoutes;