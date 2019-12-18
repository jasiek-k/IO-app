import React from 'react';

import OffersItems from './offersItems';
import data from '../data/offers.json';
import FilterItems from './filterItems';
import "./style.css";
//import refreshIcon from "../data/refresh.png";

// serwer springowy -> endpointy 
// npm request -> zwraca promise 
// request("localhost:8081/getCarDATA")/(result) => { this.setState()}
// postman -> testowanie 
export default class OffersDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // array collecting all the offers that 
            // are supposed to be displayed at the moment
            displayedOffers: Array(0), 
            allOffers: Array(0),
            searchInput: "",
            sortCondition: "",
            filterCondition: Array(0),
        };

        this.getOffers = this.getOffers.bind(this);
        this.checkCarId = this.checkCarId.bind(this);
        //this.filterOffers = this.filterOffers.bind(this);
    }

    // sends json request 
    getOffers() {
        let offersArray = [...this.state.displayedOffers];
        offersArray.splice(0, offersArray.length);
    
        // reading data from the json file uncomment below
        // loop for testing purposes
        for (let i = 0; i < data.Cars.length; i++) {
            let carArray = [];

            carArray = [data.Cars[i].CarID,
                        data.Cars[i].Manufacturer, 
                        data.Cars[i].Model, 
                        data.Cars[i].Type,
                        data.Cars[i].DateOfProduction,
                        data.Cars[i].Price,
                        data.Cars[i].NumberOfSeats,
                        data.Cars[i].FuelConsumption];

            offersArray.push({
                car: carArray,
                index: Math.random()
            });
        }

        // sorting all the offers by their 
        // IDs as it is default order
        offersArray.sort((a, b) => (parseInt(a.car[0]) > parseInt(b.car[0])) ? 1 : -1)
           
        let category1 = [];
        let category2 = [];
        let category3 = [];

        for (let i = 0; i < offersArray.length; i++) {
            category1.push(offersArray[i].car[1]);
            category2.push(offersArray[i].car[3]);
            category3.push(offersArray[i].car[6]);
        }

        category1.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1);
        category2.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1);
        category3.sort((a, b) => (parseInt(a) > parseInt(b)) ? 1 : -1);

        let filters = [];
        filters.push([...new Set(category1)]);
        filters.push([...new Set(category2)]);
        filters.push([...new Set(category3)]);


        document.getElementById("searchInput").value=""; 
        document.getElementById("sortSelect").value=""; 

        this.setState({
            displayedOffers: offersArray,
            allOffers: offersArray,
            filterCondition: filters,
            sortCondition: "none",
            searchInput: ""
        });
    }

    checkCarId(id, array) {
        let ifContains = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].car[0] === id) ifContains = true;
        }
        return ifContains;
    }

    searchItems = () => {
        const searchInput = this.state.searchInput;
        const sortCondition = this.state.sortCondition;
        const displayedOffers = [...this.state.allOffers];

        // getting the array of all the checkboxes 
        // that have been clicked by the user in order to 
        // use that in filtering function
        let checkedList = document.querySelectorAll('input[type="checkbox"]:checked');
        let categoriesNumber = [];
        let offersToDisplay = [];
        let filter = [];
        
        // let array = [];
   
        if (checkedList.length > 0) {
            for (let i = 0; i < checkedList.length; i++) {
                if (parseInt(checkedList[i].value) === 0) filter.push([checkedList[i].nextSibling.data, 1]);
                else if (parseInt(checkedList[i].value) === 1) filter.push([checkedList[i].nextSibling.data, 3]);
                else if (parseInt(checkedList[i].value) === 2) filter.push([checkedList[i].nextSibling.data, 6]);
                categoriesNumber.push(filter[i][1]);
            }
        } if (filter.length > 0) {
            categoriesNumber = new Set(categoriesNumber).size;
            
            /*
            for (let i = 0; i < displayedOffers.length; i++) {
                for (let j = 0; j < filter.length; j++) {
                    for (let k = 0; k < categoriesNumber; k++) {
                        if (displayedOffers[i].car[filter[j][1]] === filter[j][0] 
                            && this.checkCarId(displayedOffers[i].car[0], offersToDisplay) === false) {
                                offersToDisplay.push({
                                    car: displayedOffers[i].car,
                                    index: Math.random()
                                });
                        } if (displayedOffers[i].car[filter[j][1]] !== filter[j][0] 
                            && this.checkCarId(displayedOffers[i].car[0], offersToDisplay) === true) {
                                for (let l = 0; l < offersToDisplay.length; l++) {
                                    if (offersToDisplay[l].car[0] === displayedOffers[i].car[0]) {                              
                                    offersToDisplay.splice(l, 1);
                                }
                            }
                        }
                    }
                    if (!checkArray.includes(false)) offersToDisplay.push({
                        car: displayedOffers[i].car,
                        index: Math.random()
                    });
                    checkArray.splice(0, checkArray.length);
                }
                let index = parseInt(filter[j][1]);
                checkArray[k][index] = true;
            */
                for (let i = 0; i < displayedOffers.length; i++) {
                    let checkArray = [];
                    console.log(checkArray)
                    let checkArray2 = [];
                    //let checkArray = [filter.length];
                    for (let j = 0; j < filter.length; j++) {
                        if (displayedOffers[i].car[parseInt(filter[j][1])] === filter[j][0]) {
                            let array = new Array(2);
                            array[0] = parseInt(filter[j][1]);
                            array[1] = true;
                            checkArray.push(array);
                        } else if (displayedOffers[i].car[parseInt(filter[j][1])] !== filter[j][0]) {
                            let array = new Array(2);
                            array[0] = parseInt(filter[j][1]);
                            array[1] = false;
                            checkArray.push(array);
                        }
                    }
                    for (let k = 0; k < checkArray.length; k++) {
                        if (checkArray[k][1] === true) {
                            checkArray2.push(true);
                        }
                    }

                    if (checkArray2.length >= categoriesNumber) offersToDisplay.push({
                        car: displayedOffers[i].car,
                        index: Math.random()
                    });
                }




        } if (searchInput.length > 0 && filter.length === 0) {
            for (let i = 0; i < displayedOffers.length; i++) {
                for (let j = 0; j < displayedOffers[0].car.length; j++) {
                    if (displayedOffers[i].car[j].toLowerCase().includes(searchInput.toLowerCase())) {
                        offersToDisplay.push({
                            car: displayedOffers[i].car,
                            index: Math.random()
                        });
                        j = displayedOffers[0].car.length;
                    }
                }
            }   
        } else if (searchInput.length > 0 && filter.length > 0) {
            const offersCopy = [...offersToDisplay];
            for (let i = 0; i < offersCopy.length; i++) {
                for (let j = 0; j < offersCopy[0].car.length; j++) {
                    if (offersCopy[i].car[j].toLowerCase().includes(searchInput.toLowerCase())) {
                        offersToDisplay.push({
                            car: displayedOffers[i].car,
                            index: Math.random()
                        });
                        j = offersCopy[0].car.length;
                    }
                }
            }   
        } else if (searchInput.length === 0 && filter.length === 0) {
            offersToDisplay = [...this.state.allOffers];
        } if (sortCondition.length > 0) {
            if (sortCondition === "priceAsc") { 
                offersToDisplay = offersToDisplay.sort((a, b) => (parseInt(a.car[5]) > parseInt(b.car[5])) ? 1 : -1); 
            } else if (sortCondition === "priceDesc") {
                offersToDisplay = offersToDisplay.sort((a, b) => (parseInt(a.car[5]) < parseInt(b.car[5])) ? 1 : -1);
            } else if (sortCondition === "brandsAz") {
                offersToDisplay = offersToDisplay.sort((a, b) => (a.car[1].concat(a.car[2]) > b.car[1].concat(b.car[2])) ? 1 : -1);
            } else if (sortCondition === "brandsZa") {
                offersToDisplay = offersToDisplay.sort((a, b) => (a.car[1].concat(a.car[2]) < b.car[1].concat(b.car[2])) ? 1 : -1);
            } else if (sortCondition === "none") {
                offersToDisplay = offersToDisplay.sort((a, b) => (parseInt(a.car[0]) > parseInt(b.car[0])) ? 1 : -1);
            }
        }

        this.setState({
            displayedOffers: offersToDisplay
        });
    }

    // update sort condition state
    sortOffers = (e) => {
        this.setState({
            sortCondition: e.target.value
        });
    }
    
    /*
    // update filter condition state
    filterOffers() {
        var checkedList = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checkedList);
    }
    */

    // update search input state
    searchForOffers = (e) => {
        this.setState({
            searchInput: e.target.value
        });
    }  

    refreshOffers = () => {
        //console.log(this.state.choosenFilters);
        this.getOffers();
    }

    // showing and hiding dropdown menu containing filtering options 
    showOptions = () => {    
        let displayProperty = "block";
        const dropdownElement = document.getElementById("filterDropdownContent");
        if (dropdownElement.style.display === "none") {
            dropdownElement.style.display = displayProperty;
        } else {
            document.getElementById("filterDropdownContent").style.display = "none";
        }
    }
  
    componentDidMount = () => {
       this.getOffers();
    }

    render() {
        return (
            <div className="offersDisplayContainer">
                <div className="navigation">
                    <input  id="searchInput" 
                        className="searchInput"
                        placeholder="Search for..." 
                        onChange={this.searchForOffers}></input>
                    <select id="sortSelect" 
                            className="sortSelect"
                            onChange={this.sortOffers}>
                        <option value="" hidden>Sort by...</option>
                        <option value="none">-</option>
                        <option value="priceAsc">Price ascending</option>
                        <option value="priceDesc">Price descending</option>
                        <option value="brandsAz">Brands A-Z</option>
                        <option value="brandsZa">Brands Z-A</option>
                    </select>
                    <div className="filterDropdown">
                        <span   onClick={this.showOptions}
                                className="filterPlaceholder">Filter by...</span>
                        <div    className="filterDropdownContent" 
                                id="filterDropdownContent"
                                style={{display: "none"}}>
                            <FilterItems content={[...this.state.filterCondition]}/>
                        </div>
                    </div>
                    <button onClick={this.searchItems} 
                            className="searchButton">SEARCH</button>
                    <button onClick={this.refreshOffers}
                            className="refreshButton">
                            <span className="refreshSpan">&#8634;</span>
                    </button>
                </div>
                <div className="offersItems">
                    <OffersItems className="offersItems" content={this.state.displayedOffers} />
                </div>
            </div>
        )
    }
}
