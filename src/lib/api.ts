export const trackDownload = async () => {

    try{

        const response = await fetch("URL",{
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

        const response= await fetch("URL",{
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