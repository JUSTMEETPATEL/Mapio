const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude })
    }, (error) => {
        console.log(error);

    },
        {
            enableHighAccuracy: true,
            maximumAge: 0,     //Perform 0 Cacheing 
            timeout: 1000,    //Checks position every 1 second
        }
    );
}

const map = L.map("map").setView([0,0],15);   

//L.map("map") is used for getting the location permission from the user and .setView is used to set the view and it accepts coordinates as an array of latitude followed by longitude. It also accepts the deafult view height as a second parameter



L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Meet Patel"
}).addTo(map);

//L.tileLayer() creates a map outline and accept a url as a parameter, the s,x,y and z are so values which leaflet put itself as the are dyanmic values. The other parameter is an object where attribution can passed.
//and in the end .addTo() is used to add the tile to the map 

const markers = {};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLang([latitude,longitude])
    }
    else{
        markers.id = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})