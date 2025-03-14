import React from "react";
import "./AppDownload.css"
import { assets } from "../../assets/assets"; 
const AppDownLoad = () =>{
    return(
        <dic className = 'app_download' id ='app_download'>
            <p>For Better Experience Download <br/> Tomato App</p>
            <div className="app_download_platforms">
                <img src = {assets.app_store} alt=""/>
                <img src = {assets.gg_play} alt=""/>
            </div>
        </dic>
    )
}

export default AppDownLoad;