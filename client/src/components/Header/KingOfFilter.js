import React, { useState } from 'react';

import axios from "axios";
import API_BASE_URL from "../../config/api";
import Filter from './Filter';
import ShowInforLine from '../ShowInforLine';
import Menu from '../Menu';


export default function KingOfFilter(props) {
    const [Foods, setFood] = React.useState([]);
    const [Types, setType] = React.useState([]);

    React.useEffect(() => {
        axios.get(`${API_BASE_URL}/ordermanagement/food`).then((response) => {
            setFood(response.data);
            // console.log("Foods..........", response.data);
        });
        axios.get(`${API_BASE_URL}/ordermanagement/type`).then((response) => {
            setType(response.data);
            // console.log("Types...............", response.data);
        });
    }, []);
    if (!Foods) return null;
    if (!Types) return null;
    if(Types[props.typeId]) console.log("_id...............>>>>>",Types[props.typeId]._id)
    if(Types[props.typeId]) console.log("id...............>>>>>", props.typeId)
    return (
        <>
            <div className="background">
                <Filter 
                    x={props.x} 
                    Foods={Foods} 
                    Typess={Types} 
                />
            </div>
            <div className="background3">
                <ShowInforLine typeId={props.typeId} typeProduct={Types}/>
                {Types[props.typeId] && <Menu typeId={props.typeId} Foods={Foods} type_id={Types[props.typeId]._id}/>}
            </div>
        </>
    )
}