import './rest-card.css'
import { useEffect, useState } from 'react'
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RestCard = (props) => {
    const [isFav, setisFav] = useState(false)
    const history = useHistory()
    const [image, setImage] = useState([])

    const customer = useSelector((state) => state.userLogin.user)
    Axios.defaults.withCredentials = true


    useEffect(() => {
        console.log('restcard', props)
        setisFav(props.data.isFav)
        setImage(props.data.imageURL)
    }, [props.data])

    const setfavData = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('isFav', isFav)
        setisFav(!isFav)
        console.log('isFav', isFav)
        let api = ''
    //     if (!isFav) api = '/fav-add'
    //    else api = '/favorites-delete'
       console.log(`${api}${isFav}`)
        let response = []
        try {
            response = await Axios.post('http://3.129.16.0:3001/api/fav-add'
            , {
                user: customer,
                restaurant: props.data.username,
                isFav: !props.data.isFav
            }
            )
            console.log(response);
            // .then((data) => {
            //     console.log('Api res-', data)
            //   //  return data
            // })
        } catch (err) {
            console.log(err)
        }
    }

    const goToRestCardDetails = (e) => {
        e.preventDefault()
        history.push('/dashboard/restaurant-details')
        localStorage.setItem('RestCardDetails', JSON.stringify(props.data))
    }

    return (
        <div class="rest-card-container" onClick={goToRestCardDetails}>
            <div class="image-container">
                {image && <img src={`http://3.129.16.0:3001/api/images/${image}`} />}
            </div>
            <div class="rest-name-container">
                <h3 class="title"> {props.data.name}</h3>
                <div onClick={setfavData}>
                    {isFav !== null && (
                        <>
                            {isFav === true ? (
                                <div>
                                    <FavoriteTwoToneIcon />
                                </div>
                            ) : (
                                <div>
                                    <FavoriteBorderTwoToneIcon />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestCard
