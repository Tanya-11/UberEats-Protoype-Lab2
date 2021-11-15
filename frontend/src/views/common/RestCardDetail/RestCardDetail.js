import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import './RestCardDetail.css'
import RestDishCard from '../RestDishCard/RestDishCard'

const RestCardDetail = () => {
    const [dish, setDish] = useState([])
    const [image, setImage] = useState([])

    useEffect(() => {
        if (localStorage.getItem('RestCardDetails')) {
          //  getRestDishDetails(JSON.parse(localStorage.getItem('RestCardDetails')).restId)
            setDish(JSON.parse(localStorage.getItem('RestCardDetails')));
            setImage(JSON.parse(localStorage.getItem('RestCardDetails')).imageURL)
        }
    }, [])

    // const getRestDishDetails = async (restId) => {
    //     const api = '/getDataForRestDish'
    //     let response = []
    //     try {
    //         response = await Axios.post(api, {
    //             city: localStorage.getItem('city'),
    //             mode: '',
    //             searchTabText: restId,
    //         }).then((res) => {
    //             setDish(res.data)
    //             return res
    //         })
    //     } catch (err) {
    //         throw err
    //     }
    // }

    return (
        <div class="RestCardDetail">
            <div class="RestImg">
                {image && <img src={`http://3.129.16.0:3001/api/images/${image}`} />}
            </div>
            <div class="RestdescWrapper">
                <div class="Restdesc">
                    <div class="name">
                        {dish.name}({dish?.addressLine1}), {dish.city}, {dish.country}
                    </div>
                    <div class="desc">{dish?.description}</div>
                    <div class="open-hrs">{dish?.openHrs}</div>
                </div>
                <div class="dishcardWrapper">
                    <div class="dishcards">
                        { dish?.dishes?.length>0 && dish?.dishes.map((result, i) => (
                            <RestDishCard key={i} dishes={result} restName={dish.name} restId={dish.username}></RestDishCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestCardDetail

/**
 * todo: get restdetails(rest,dish) by refID
 */
