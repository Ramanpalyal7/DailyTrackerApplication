export const trackDownload = async () => {

    try{

        const response = await fetch("/api/track-download",{
            method:"POST",
        });
        
        const data= await  response.json();
        
        return data;
        
    }
    catch(error)
    {
        console.error("Failed to track download: ",error);
    }
};


export const getStats = async () => {

    try{

        const response= await fetch("/api/analytics/stats",{
            method:"GET",
        });
        
        const data= await response.json();
        return data;

        
    }
    catch(error)
    {
        console.error(" Failed to fetch stats ",error);

    }


}