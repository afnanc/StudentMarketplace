import { useState } from "react";

const SideBar = () => {
    // State management for filter inputs
    const [loc, setLoc] = useState();
    const [minPrice, setMinPrice] = useState()
    const [maxPrice, setMaxPrice] = useState()
    const [offering, setOffering] = useState()

    // Handle filtering that applied
    const applyFilters = (e) => {
        console.log("hi")
        e.preventDefault(); // Prevent the form from being submitted traditionally
        let filterString = "";
        // Construct the filter based on user inputs
        if(loc) {
            filterString += "location=" + loc + "&"
        }
        if(minPrice && Number.isInteger(minPrice)){
            filterString += "minPrice=" + minPrice + "&"
        }
        if(maxPrice && Number.isInteger(maxPrice)){
            filterString += "maxPrice=" + maxPrice + "&"
        }

        // Fetch filtered ads from the backend using the constructed filter string
        const returnResults = async () => {
            const response = await fetch(`https://cps630-group33-backend.onrender.com/api/ads/filter?${filterString}`);
            const ads = await response.json(); 
            navigate('/Search', { state: {ads:ads } });
          }
          returnResults() // Execute the async function to fetch filtered ads
        
    }
    // Render the side bar
    return (
    <div className="sidebar col-3">
    <h2 style={{textAlign:"center"}}>Filters</h2>
    <form>
        <div className="mb-3 input-group">
            <span className="input-group-text">
                <svg fill="#000000" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 395.71 395.71">
                <g>
                    <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
                        c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
                        C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
                        c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                </g>
                </svg>
            </span>
            <input type="text" className="form-control" placeholder="Enter City" onChange={(e) => setLoc(e.target.value)}/>
        </div>
        
        <div className="mb-3">
            <p style={{textAlign:"center", fontWeight:"bold"}}>Enter Price Range: </p>
            <div className="container">
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" id="fromPrice" placeholder="From" aria-label="From Price" onChange={(e) => setMinPrice(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" id="toPrice" placeholder="To" aria-label="To Price" onChange={(e) => setMaxPrice(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mb-3 form-check form-check-inline">
            <input className="form-check-input" type="radio" name="itemsWanted" id="itemsWanted"/>
            <label className="form-check-label" htmlFor="itemsWanted">Items Wanted</label>  
        </div>
        <div className="mb-3 form-check form-check-inline">
            <input className="form-check-input" type="radio" name="itemsOffered" id="itemsOffered"/>
            <label className="form-check-label" htmlFor="itemsOffered">Items Offered</label>
        </div>
        <div style={{textAlign:"center"}}>
        <button type="submit" style={{textAlign:"center"}} className="btn btn-primary" onClick={applyFilters}>Submit</button>
        </div>
    </form>
</div>

    );
}

export default SideBar;
