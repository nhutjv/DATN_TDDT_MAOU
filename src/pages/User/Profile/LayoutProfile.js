import React, { Component } from 'react'
import ItemProfileComp from '../../../components/user/ProfileComp/ItemProfileComp'
import Navbar from '../../../components/user/Navbar/Navbar';

import {
    Tab,
    Modal,
    Ripple,
    Tooltip,
    Popover,
    initTWE,
} from "tw-elements";

export default class LayoutProfile extends Component {
    componentDidMount() {
        initTWE({ Tab, Modal, Ripple, Tooltip, Popover, initTWE });
    }
    render() {
        return (
            <>
                <Navbar />
                <div
                    className='w-[auto] font-mono px-5 mt-5 font-bold uppercase bg-slate-700 text-white '
                >
                    Trang tài khoản
                </div>
                <ItemProfileComp />
            </>

        )
    }
}
