import React from "react";
import ShowProduct from "./ShowProduct";

export default function DetailOrder(props) {
    return (
        // if(items.length === props.order.listItemID.length) 
        props.order.OrderItems.map((item, index) => (
            <ShowProduct 
                key={index}
                order={item} 
                indexx={index}
                onDelete={props.onDeleteItem}
                onQuantityChange={props.onQuantityChange}
            />
        ))
    )
}