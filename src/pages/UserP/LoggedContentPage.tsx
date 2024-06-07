import React, { useState } from 'react';
import LoggedBarPage from './LoggedBarPage';
import { User, onAuthStateChanged  } from 'firebase/auth'; 
import { UserModel } from '../../services/UserModel/UserModel';
import LoggedUserDataForm from './Data/LoggedUserDataForm';
import { firebaseAuth, firebaseDatabase } from '../../services/Firebase/FirebaseService';
import { collection, doc, getDoc } from 'firebase/firestore'; 
import ImgThinking from '../../assets/thinking.svg';

function LoggedContentPage(){ 
    const MAIN_PAGE = '/User/';
    const [dataUserExist, setDataUserExist] = useState<UserModel>();
    let userLogged: User | null = null;

    onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
            userLogged = user;
            const uid = userLogged.uid;
            if (dataUserExist) {

            } else {
                loadUserData(uid);
            }
        } else {
            window.location.href = '/Login';
        }
    });

    function loadUserData(uid: string) {
        const usersCollection = collection(firebaseDatabase, 'users');
        getDoc(doc(usersCollection, uid))
            .then((document) => {
                setDataUserExist(new UserModel(document.get('name'), document.get('email'), document.get('role'), document.get('gender'), document.get('urlAvatarProfile'), document.get('uuid')));
            }).catch((error) => {
                console.error(error);
                alert(error);
            });
    }
 
    const componentUserDataForm = (<LoggedUserDataForm datauserparam={dataUserExist}></LoggedUserDataForm>);

    const componentHeaderNav = (<LoggedBarPage username={dataUserExist?.name} urlProfile={dataUserExist?.urlAvatarProfile} userArt={dataUserExist?.role}></LoggedBarPage>);

    const componentAbogados = (<h3>Página de abogados en contrucción...</h3>);

    const componentCasos = (<h3>Página de casos en contrucción...</h3>);

    const componentGeneric = (<><h3>Página seleccionada actualmente en contrucción...</h3><div><img src={ImgThinking} width="250" height="260"></img></div></>);

    function generateUserDataContent(): any {
        switch(window.location.pathname) { 
            case MAIN_PAGE: {
                if(firebaseAuth.currentUser){
                    loadUserData(firebaseAuth.currentUser?.uid); 
                }
                return (componentUserDataForm);
            }
            case MAIN_PAGE + "abogados/": { 
                return (componentAbogados); 
            } 
            case MAIN_PAGE + "casos/": { 
                return (componentCasos);
             } 
            default: { 
                return (componentGeneric);
            } 
         } 
    }

    return (
        <React.Fragment>
            {componentHeaderNav}
            {generateUserDataContent()}
        </React.Fragment>
    );
}

export default LoggedContentPage;
