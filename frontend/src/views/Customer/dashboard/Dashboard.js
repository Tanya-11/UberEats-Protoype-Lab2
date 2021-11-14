import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import RestCard from '../../common/RestCard'
import './Dashboard.scss'

const Dashboard = () => {
    const [restData, setrestData] = useState([])
    const [favRest, setfavRest] = useState(false)
    const customer = useSelector((state) => state.userLogin.user)
    const [deliveryMode, setDeliveryMode] = useState(true)
    const [location, setLocation] = useState('')
    const [searchString, setSearchString] = useState('')
    const [searchData, setSearchData] = useState({
        city:'',
        delivery: false,
        pickUp:false,
        category: '',
        searchTabText: '',
    })
    Axios.defaults.withCredentials = true


    const getRestData = Axios.post('http://18.191.91.254:3001/api/search', {
        searchData:searchData
    })

    const getFavData = Axios.post('http://18.191.91.254:3001/api/favs', {
        user: customer,
    })
    useEffect(() => {
        Promise.all([getRestData, getFavData])
            .then((res) => {
                res[0].data.map((el) => {
                    res[1].data.data.map((item) => {
                        if (el.username === item.restaurant) {
                            console.log(item)
                            el.isFav = true
                        }
                    })
                })
                setrestData(res[0].data)
            })
            .catch((err) => {
                throw err
            })
    },[searchData]
    )

    const handleChange = (e) => {
         console.log(e.target.name)
        const { name, value } = e.target
        setSearchData((prevSate) => ({
            ...prevSate,
            [name]: value,
        }))
        // console  .log(searchData)
    }

    return (
        <div className="dashboardContent">
            <div className="leftContent">
                <div className="mode" onChange={(e) => handleChange(e)}>
                    <label>
                        <input type="checkbox" value={!searchData.delivery} name="delivery"
                            // checked={searchData.delivery}
                             />
                        Delivery
                    </label>
                    <label>
                        <input type="checkbox" value={!searchData.pickUp} name="pickUp"
                            // checked={searchData.pickUp}
                             />
                        Pick Up
                    </label>
                    {/* <label>
                        <input type="radio" value="both" name="mode"
                            checked={searchData.mode === 'both'} />
                        Both
                    </label> */}
                </div>
                <div className="location">
                    <input
                        type="text"
                        name="city"
                        value={searchData.city}
                        onChange={(e) => { handleChange(e); localStorage.setItem('city', e.target.value) }}
                        placeholder="search City"
                    />
                </div>
                <div className="category" onChange={(e) => handleChange(e)}>
                    <label>
                        <input type="radio" value="Vegetarian" name="category"
                            checked={searchData.category === 'Vegetarian'} />
                        Vegetarian
                    </label>
                    <label>
                        <input type="radio" value="Halal" name="category" 
                            checked={searchData.category === 'Halal'}/>
                        Halal
                    </label>
                </div>
                <div className="search">
                    <input
                        type="text"
                        name="searchTabText"
                        value={searchData.searchTabText}
                        onChange={(e) => handleChange(e)}
                        placeholder="search Restaurant"
                    />
                </div>
            </div>
            <div className="rightContent">
                {restData && restData.length>0 &&  restData.map((result, i) => (
                    <RestCard key={i} data={result}></RestCard>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
