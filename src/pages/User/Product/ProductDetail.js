import React, { Component } from 'react'
import ProdDetail from '../../../components/user/Item/ProdDetail'
import Navbar from '../../../components/user/Navbar/Navbar'
import {
    Ripple,
    Collapse,
    Input,
    initTWE,
} from "tw-elements";
export default class ProductDetail extends Component {
    componentDidMount() {
        initTWE({ Collapse, Input, Ripple }, { allowReinits: true });

    }
    render() {
        return (
            <>
                <Navbar />
                <ProdDetail />
            </>

        )
    }
}
