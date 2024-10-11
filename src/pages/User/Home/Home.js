import React from 'react';
import Navbar from '../../../components/user/Navbar/Navbar';
import Footer from '../../../components/user/Footer/Footer';
import Carous from '../../../components/user/Carousel/Carous';
import ListProduct from '../../../components/user/ListProduct/Home';
import {
    Collapse,
    Ripple,
    Input,
    initTWE,
} from "tw-elements";
class Home extends React.Component {
    componentDidMount() {
        initTWE({ Collapse, Ripple, Input }, { allowReinits: true });
    }


    render() {
        return (
            <div className='bg-slate-100'>
                {/* <StorageImage /> */}
                <Navbar />
                <Carous />
                <ListProduct />
                <Footer />
            </div>
        );
    }
}
export default Home