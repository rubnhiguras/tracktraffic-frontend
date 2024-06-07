import { Alert, AlertColor, Backdrop, Button, CardActions, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Slide, Snackbar, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { UserModel } from '../../../services/UserModel/UserModel';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseAuth, firebaseDatabase, firebaseStorage } from '../../../services/Firebase/FirebaseService';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import PersonIcon from '@mui/icons-material/Person';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import SaveIcon from '@mui/icons-material/Save';
import PasswordIcon from '@mui/icons-material/Password';
import packageJson from '../../../../package.json';

function LoggedUserDataForm(props: { datauserparam: UserModel } | any) {

    const nameVar = props.datauserparam?.name;
    const genderVar = props.datauserparam?.gender;
    const uuid = props.datauserparam?.uuid;

    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [passwordAlert, setPasswordAlert] = useState(false);
    const [openResultUpload, setOpenResultUpload] = useState(false);
    const [messageUpload, setMessageUpload] = useState('');
    const [severityMessage, setSeverityMessage] = useState<AlertColor>();
    const [error, setError] = useState('');
    const [editableDataUser, setEditableDataUser] = useState<{name: string, gender:string}>(() => { 
        return {name: nameVar, gender: genderVar};
    });

    document.title = document.title = packageJson.title + ' ' + props.datauserparam?.name; 

    if(props.datauserparam ){
        if(editableDataUser){
            if(editableDataUser.name == undefined || editableDataUser.gender == undefined){
                setEditableDataUser({name: nameVar, gender: genderVar});
            }
        }
    }

    const genders = [
        { name: 'Masculino', code: 'MA' },
        { name: 'Femenino', code: 'FE' },
        { name: 'Mejor dicho...', code: 'UN' }
    ]; 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setOpen(true);
            const reference = ref(firebaseStorage, `/images/${uuid}/avatar`);
            const uploadTask = uploadBytesResumable(reference, e.target.files[0]);
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress =
                        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress);
                },
                (error) => {
                    alert(error);
                },
                () => {
                    if (uuid) {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            props.datauserparam.urlAvatarProfile = downloadURL;
                            const userDoc = doc(firebaseDatabase, 'users', uuid);
                            updateDoc(userDoc, { 'urlAvatarProfile': downloadURL })
                                .then(() => {
                                    setMessageUpload(editableDataUser.name + ", el avatar del perfil se ha cambiado.")
                                    setSeverityMessage('success');
                                }).catch((error) => {
                                    setMessageUpload(editableDataUser.name + ", el avatar del perfil NO se ha podido cambiar: ERROR al actualizar:\n " + error.message)
                                    setSeverityMessage('error');
                                    setError(error.message);
                                }).finally(() => {
                                    setProgress(100); setOpen(false); setProgress(0); setOpenResultUpload(true);
                                });
                        });
                    }
                }
            );
        }
    };

    const handleSave = () => {
        setOpen(true);
        const able = checkName();
        if (able) {
            if (uuid) {
                const userDoc = doc(firebaseDatabase, "users", uuid);
                updateDoc(userDoc, { 'name': editableDataUser.name, 'gender': editableDataUser.gender })
                    .then(() => {
                        setMessageUpload("Datos actualizados correctamente.");
                        setSeverityMessage('success');
                        //if (dataUserExist) {
                        //    loadUserData(dataUserExist.uuid);
                        //}
                    }).catch((error) => {
                        setMessageUpload("ERROR al actualizar:\n " + error.message);
                        setSeverityMessage('error');
                        setError(error.message);
                    }).finally(() => {
                        setOpen(false);
                        setOpenResultUpload(true);
                    });
            }
        } else {
            setOpen(false);
        };
    }

    const handleClose = () => {
        setOpenResultUpload(false);
        setPasswordAlert(false);
        setOpen(false);
    };

    function checkName(): boolean {
        let result = false;
        if (editableDataUser.name) {
            result = editableDataUser.name.length > 2;
            setError(result ? "" : "No es un nombre válido");
        }
        return result;
    }

    function CustomErrorAlert() {
        if (error.length > 0) {
            return <Alert severity="error" >{error}</Alert>;
        } else {
            return <p></p>;
        }
    }

    function showDialogToChangePassword() {
        setPasswordAlert(true);
    }

    function handleSendPasswordEmail() {
        if (props.datauserparam) {
            setPasswordAlert(false);
            setOpen(true);
            sendPasswordResetEmail(firebaseAuth, props.datauserparam.email)
                .then(() => {
                    setMessageUpload("Enviado enlace de restauración de contraseña a " + props.datauserparam.email);
                    setSeverityMessage('success');
                }).catch((error) => {
                    setMessageUpload("ERROR al enviar enlace de restauración de contraseña:\n " + error.message)
                    setSeverityMessage('error');
                }).finally(() => {
                    setOpen(false); setOpenResultUpload(true);
                });
        }
    }

    const handleChange = (e: { target: { name: string, value: any; }; }) => {
        setEditableDataUser({... editableDataUser, [e.target.name]: e.target.value}); 
    } 

    const genderDetailHTML = <TextField sx={{ width: '20ch' }} id="gender-detail-basic" variant="standard" value={editableDataUser.gender === 'Mejor dicho...' ? '' :  editableDataUser.gender} onChange={handleChange} name="gender"/>;

    return (
        <React.Fragment>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" variant='determinate' value={progress} />
            </Backdrop>
            <FormControl component="form" sx={{ p: 4, textAlign: "left", '& > :not(style)': { m: 1, width: '90%' }, marginTop: "1rem" }} autoComplete="off">

                <Chip label={props.datauserparam?.email} variant="filled" color="default" />
                <Chip label={props.datauserparam?.role} variant="filled" color="default" />

                <TextField id="Name-basic" placeholder="Nombre" variant="standard" value={editableDataUser.name} name="name" onChange={handleChange}
                    required />

                <TextField sx={{ width: '20ch' }}
                    select
                    id="GenderField"
                    label="Género"
                    value={( editableDataUser.gender != 'Masculino' &&  editableDataUser.gender != 'Femenino') ? 'Mejor dicho...' : editableDataUser.gender} name="gender"
                    variant="standard"
                    onChange={handleChange}
                >
                    {genders.map((gender) => (
                        <MenuItem key={gender.code} value={gender.name}>
                            {gender.name}
                        </MenuItem>
                    ))}
                </TextField>

                {(editableDataUser.gender != 'Masculino' && editableDataUser.gender != 'Femenino') ? genderDetailHTML : ''}

                <small style={{ textAlign: 'justify' }}>(*)Campos&nbsp;obligatorios</small>

                <CustomErrorAlert></CustomErrorAlert>
                <CardActions className='button-section'>
                    <Tooltip title='Cambiar contraseña'>
                        <Button
                            variant="contained"
                            component="label"
                            color="inherit"
                            sx={{ width: '5ch', height: '4ch' }}
                            onClick={showDialogToChangePassword}
                        >
                            <PasswordIcon />
                        </Button>
                    </Tooltip>
                    <Dialog
                        open={passwordAlert}
                    >
                        <DialogTitle id="alert-password-dialog-title">
                            Cambiando contraseña...
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-password-dialog-description">
                                Para cambiar la contraseña, se enviará un correo electrónico ¿Continuamos?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={{ color: "red" }} onClick={handleClose} autoFocus>Mejor no, cancelar</Button>
                            <Button sx={{ color: "#c5ad6d" }} onClick={handleSendPasswordEmail}>Si, adelante</Button>
                        </DialogActions>
                    </Dialog>
                    <div id='avataruploadsection'>
                        <Tooltip title='Actualizar foto de perfil/avatar'>
                            <Button
                                variant="contained"
                                component="label"
                                color="warning"
                                sx={{ width: '5ch', height: '4ch' }}
                            >
                                <PersonIcon /><UpgradeIcon />
                                <input accept="image/*"
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}

                                />
                            </Button>
                        </Tooltip>
                        <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            open={openResultUpload}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            message={messageUpload}
                            key={messageUpload}
                            TransitionComponent={Slide}>
                            <Alert
                                onClose={handleClose}
                                severity={severityMessage}
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                {messageUpload}
                            </Alert>
                        </Snackbar>
                    </div>
                    <Tooltip title="Actualizar datos">
                        <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: "#c5ad6d", ":hover": { backgroundColor: "#506C60" } }} className='button-section-element' startIcon={<SaveIcon />} />
                    </Tooltip>
                </CardActions>

            </FormControl>

        </React.Fragment>
    );

}

export default LoggedUserDataForm;