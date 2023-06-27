import {getUserData,setUserData} from '../repositories/UserRepository.js';


export const getUserDataService  = async (req,res) => {
    const userData = await getUserData();
    if (userData) {
        res.status(200).json({success:true,userData});
    } else {
        res.status(500).json({success:false});
    }
}

export const setUserDataService = async (req,res) => {
    const result = await setUserData(req.body);
    if (result) {
        res.status(200).json({success:true,result});
    } else {
        res.status(500).json({success:false});
    }
}