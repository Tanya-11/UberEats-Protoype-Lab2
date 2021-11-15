import React, { useEffect, useState } from 'react'
import './CustomerProfile.css'
import Axios from 'axios'
import { useSelector } from 'react-redux'
// import RestCard from '../common/RestCard'
import { useHistory } from 'react-router'
import { Favorites } from './Favourites'
import { About } from './About'
const CustomerProfile = () => {
    const [file, setFile] = useState('')
     const history = useHistory()
    const customer = useSelector((state) => state.userLogin.user)
    Axios.defaults.withCredentials = true;
    const [userData, setUserData] = useState({
        name: '',
        username: customer,
        phoneNo: '',
        city: '',
        state: '',
        country: '',
        nickName: '',
        fav:[],
        image:''
    })
    const [showAbout, setShowAbout] = useState(false)

    const setShowState = () => {
        setShowAbout(!showAbout)
    }

    const navigateToDashboard = () => {
        history.push('/dashboard')
    }
    useEffect(() => {
        getCustomerData()
    }, [])

    const getCustomerData = () => {
        Axios.post('http://3.129.16.0:3001/api/customer/profile', {
            username: customer,
        })
            .then((res) => {
                console.log(res)
                if (res.data) {
                    setUserData(
                        {
                            name: res.data.name || '',
                            username: res.data.username || '',
                            phoneNo: res.data.phoneNo || '',
                            city: res.data.city || '',
                            state: res.data.state || '',
                            country: res.data.country || '',
                            nickName: res.data.nickName || '',
                            fav:res.data.fav || [],
                            image: res.data.imageURL||''
                        },
                      //  setImage(res?.data?.image)

                        //  email: res.data[0].email
                    )
                    console.log('user' + JSON.stringify(userData))
                    // setName(res.data[0].name);
                    // setEmail(res.data[0].email);
                    // setPhoneNo(res.data[0].phone);
                    // setCity(res.data[0].city);
                    // setCountry(res.data[0].country);
                    // setState(res.data[0].state);
                }
            })
            .catch((err) => {
                throw err
            })
    }

    const onImageChange = (event) => {
        console.log(event.target.files[0])
        // if (event.target.value) {
        //   setFile(
        //     URL.createObjectURL(event.target.value)
        //   );
        // }
    }

    return (
        <div class="CustomerProfile">
            <div class="leftContent">
                <ul className="customer-profile-wrapper">
                    <li className="uber-logo" onClick={navigateToDashboard}></li>
                    <li onClick={setShowState}>About</li>
                    <li onClick={setShowState}>Favorites</li>
                </ul>
            </div>
            <div class="rightContent">
                {!showAbout && userData ? (
                    <About data={userData} disabled={false}  />
                ) : (
                    <Favorites data={userData?.fav} />
                )}
                {/* {/* <span>Profile Img</span>
      <input type="file" onChange={(e) => onImageChange(e)} value={file}></input>  
        */}
            </div>
        </div>
    )
}

export default CustomerProfile
